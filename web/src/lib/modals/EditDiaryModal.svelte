<script>
  import FullModal from '$lib/modals/FullModal.svelte';
  import { env } from '$env/dynamic/public';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let showEditDiaryModal;
  export let editDiary = '';
  let enc_key = '';
  let enc_confirm_key = '';

  let submitState = 'idle';
  let isEditDiaryInitialized = false;

  const hosturl = env.SERVER_URL || '';

  $: {
    if (editDiary !== '' && !isEditDiaryInitialized) {
      isEditDiaryInitialized = true;
    }
  }

  function selectStars(starCount) {
    if (editDiary.rating === starCount - 0.5) {
      editDiary.rating = starCount;
    } else {
      editDiary.selectedStars = starCount - 0.5;
    }
  }

  async function submitEditDiary() {
    if (editDiary.encryption != 'none') {
      if (!enc_key || !enc_confirm_key) {
        submitState = 'no_key';
        ratelimitEditDiary();
        return;
      } else if (enc_key != enc_confirm_key) {
        submitState = 'inv_key';
        ratelimitEditDiary();
        return;
      }
    }

    if (!editDiary.content) {
      submitState = 'no_content';
      ratelimitEditDiary();
      return;
    }

    let final_enc_algo = 'none';
    if (editDiary.encryption == 'none') {
      final_enc_algo = 'none';
    } else {
      final_enc_algo = enc_algo;
    }

    var submitBody = await JSON.stringify({
      content: editDiary.content,
      date: editDiary.date,
      rating: editDiary.rating,
      encryption: final_enc_algo,
    });

    const editfetch = await fetch(hosturl + '/api/diary/' + editDiary.date, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: submitBody,
    });

    const editres = await editfetch.json();
    if (editres.id) {
      showEditDiaryModal = false;
      dispatch('toggle');
    }
  }

  async function ratelimitEditDiary() {
    setTimeout(() => {
      submitState = 'idle';
    }, 3200);
  }
</script>

{#if isEditDiaryInitialized}
  <FullModal bind:showModal={showEditDiaryModal}>
    <p class="new-entry-title roboto">Edit Diary Entry</p>

    <div class="fields">
      <div class="settings" class:settings-wider={editDiary.encryption !== 'none'}>
        <p class="date-desc desc roboto">Date:</p>
        <div>
          {#if submitState == 'already_exists'}
            <p class="small-error-msg roboto">Date already used</p>
          {/if}
          <input
            type="date"
            class="date-selector roboto"
            class:ds-key-ac={editDiary.encryption !== 'none'}
            class:red-outline={submitState == 'already_exists'}
            bind:value={editDiary.date}
          />
        </div>

        <p class="desc roboto">Encryption:</p>
        <select bind:value={editDiary.encryption} class="encryption-selector desc roboto">
          <option value="none">None</option>
          <option value="AES">AES</option>
        </select>

        {#if editDiary.encryption !== 'none'}
          <p class="desc roboto">Key:</p>
          <div>
            {#if submitState == 'no_key'}
              <p class="small-error-msg roboto">Please enter a Key and confirm it</p>
            {:else if submitState == 'inv_key'}
              <p class="small-error-msg roboto">Key and Confirm-Key don't match</p>
            {/if}
            <input
              type="password"
              bind:value={enc_key}
              class="key-input roboto"
              class:red-outline={submitState == 'no_key' || submitState == 'inv_key'}
            />
          </div>
        {/if}

        {#if editDiary.encryption !== 'none'}
          <p class="confirm-desc desc roboto">Confirm Key:</p>
          <input
            type="password"
            bind:value={enc_confirm_key}
            class="key-input roboto"
            class:red-outline={submitState == 'no_key' || submitState == 'inv_key'}
          />
        {/if}
      </div>

      <div class="content-container flex">
        <p class="roboto content-desc">Content:</p>
        {#if submitState == 'no_content'}
          <p class="content-error small-error-msg roboto">The Content cannot be empty</p>
        {/if}
        <textarea
          class="diary-content roboto"
          bind:value={editDiary.content}
          placeholder="How has your day been? :)"
          class:red-outline={submitState == 'no_content'}
        />
      </div>

      <div class="rating-container flex">
        <p class="desc rating-desc roboto">Rating:</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="flex r-inputs">
          <div class="starbox">
            {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as star}
              <span
                role="button"
                tabindex="-1"
                class="fa star"
                class:filledstar={star <= editDiary.rating || star - 0.5 === editDiary.rating}
                on:click={() => selectStars(star)}
              >
                {#if star - 0.5 === editDiary.rating}
                  <i class="fa fa-star-half-o"></i>
                {:else}
                  <i class="fa fa-star"></i>
                {/if}
              </span>
            {/each}
          </div>
          <input class="rating-input roboto" type="number" bind:value={editDiary.rating} min="0" max="10" step="0.5" />
        </div>
        <button
          on:click={submitEditDiary}
          disabled={submitState != 'idle'}
          class="new-entry-button create-button roboto"
          class:disable-submit={submitState != 'idle'}>Modify Diary Entry</button
        >
      </div>
    </div>
  </FullModal>
{/if}

<style>
  .flex {
    display: flex;
    justify-content: space-between;
  }

  .key-input {
    height: 44px;
    margin-top: 0.8vh;
    color: black !important;
    font-size: 20px !important;
  }

  .content-error {
    margin-top: -0.25rem !important;
    margin-bottom: 1.5rem;
  }

  .small-error-msg {
    color: red !important;
    font-size: 17px !important;
    height: 0;
    margin-top: -1.05rem;
  }

  .red-outline {
    border-color: red !important;
    border-style: solid !important;
    border-radius: 2px;
  }

  .disable-submit {
    cursor: not-allowed !important;
  }

  .disable-submit:active {
    background-color: rgb(0, 211, 0) !important;
  }

  .rating-input {
    margin-left: 1rem;
    height: 1.5rem;
    margin-top: 0.1rem;
    color: black !important;
    width: 5rem;
    text-align: center;
  }

  .r-inputs {
    justify-content: start;
  }

  .new-entry-button {
    position: relative !important;
    margin-top: 2.5rem !important;
    width: 26rem !important;
    margin-left: -7rem !important;
    margin-right: 0 !important;
    height: 6vh !important;
    font-size: 24px !important;
    align-self: center;
  }

  .rating-desc {
    margin-bottom: 0.8rem;
  }

  .confirm-desc {
    margin-left: 16px;
  }

  .content-container {
    justify-content: center;
    margin-top: 1rem;
    flex-direction: column;
    margin-left: 7rem;
    margin-right: 7rem;
  }

  .rating-container {
    color: white;
    flex-direction: column;
    margin-left: 7rem;
  }

  .diary-content {
    height: 30vh;
    background-color: rgb(32, 32, 44);
    padding: 8px;
    border-color: rgb(82, 82, 82);
    border-style: solid;
    border-radius: 2px;
  }

  .diary-content:focus {
    outline: none;
  }

  .content-desc {
    font-size: 20px !important;
    margin-bottom: 0.8rem;
  }

  input[type='date']::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    right: 0;
    top: 0;
    width: auto;
  }

  .encryption-selector {
    color: black !important;
    width: 8vw;
    margin-top: 0.8vh;
    height: 50px;
  }

  .new-entry-title {
    font-size: 36px !important;
    color: rgb(0, 255, 0) !important;
    text-align: center;
  }

  .settings {
    width: 36rem;
    display: flex;
    margin-top: -1.2vh;
    margin-left: auto;
    margin-right: auto;
  }

  .settings-wider {
    width: 80rem !important;
  }

  .date-desc {
    margin-left: 0.6rem;
  }

  .date-selector {
    color: black !important;
    height: 40px;
    margin-top: 1vh;
    margin-right: 4rem;
  }

  .ds-key-ac {
    margin-right: 1rem;
  }

  .desc {
    font-size: 20px !important;
    margin-right: 16px;
  }

  .fields {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .create-button {
    position: fixed;
    margin-top: 6vh;
    width: 12vw;
    margin-right: 8vw;
    height: 5vh;
    background-color: rgb(0, 211, 0);
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .create-button:active {
    background-color: rgb(2, 172, 2);
  }

  .starbox {
    font-size: 0;
    align-self: center;
  }

  .star {
    font-size: 30px;
    margin-right: 0.2vw;
  }

  .filledstar {
    color: orange;
  }

  .roboto {
    color: white;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
