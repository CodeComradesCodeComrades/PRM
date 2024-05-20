<script>
  import UserPageLayout from '$lib/UserPageLayout.svelte';
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import { DateTime } from 'luxon';
  import FullModal from '$lib/modals/FullModal.svelte';

  const hosturl = env.SERVER_URL || '';
  let selectedStars = 3;

  /**
   * @type any[];
   */
  let diaries = [];
  let showCreateDiaryModal = false;
  var today = new Date();
  let enc_algo = 'None';
  let enc_key = '';
  let enc_confirm_key = '';
  let content = '';
  var isoDate = today.toISOString().split('T')[0];
  let submitState = 'idle';
  let noDiaries;
  /** SubmitStates:
   * idle: Nothing/Default
   * no_key: Key-field and/or Confirm-key-field empty
   * inv_key: Confirm-key-field invalid
   * no_content: Missing diary content
   * already_exists: An entry with this date already exists
   */

  onMount(() => {
    fetchDiaries();
  });

  function selectStars(starCount) {
    if (selectedStars === starCount - 0.5) {
      selectedStars = starCount;
    } else {
      selectedStars = starCount - 0.5;
    }
  }

  async function submitCreateDiary() {
    if (enc_algo != 'None') {
      if (!enc_key || !enc_confirm_key) {
        submitState = 'no_key';
        ratelimitSubmitNewDiary();
        return;
      } else if (enc_key != enc_confirm_key) {
        submitState = 'inv_key';
        ratelimitSubmitNewDiary();
        return;
      }
    }

    if (!content) {
      submitState = 'no_content';
      ratelimitSubmitNewDiary();
      return;
    }

    let final_enc_algo = 'none';
    if (enc_algo == 'None') {
      final_enc_algo = 'none';
    } else {
      final_enc_algo = enc_algo;
    }

    var submitBody = await JSON.stringify({
      content: content,
      date: isoDate,
      rating: selectedStars,
      encryption: final_enc_algo,
    });

    const submitfetch = await fetch(hosturl + '/api/diary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: submitBody,
    });

    const submitres = await submitfetch.json();
    if (submitres.id) {
      await fetchDiaries();
      showCreateDiaryModal = false;
    } else if (submitres.message == 'Diary entry already exists') {
      submitState = 'already_exists';
      ratelimitSubmitNewDiary();
      return;
    }
  }

  async function ratelimitSubmitNewDiary() {
    setTimeout(() => {
      submitState = 'idle';
    }, 3200);
  }

  async function fetchDiaries() {
    const fetchres = await fetch(hosturl + '/api/diary', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const diaryjson = await fetchres.json();
    diaries = diaryjson.diaries;

    if (diaries.length == 0) noDiaries = true;

    for (let i = 0; i < diaries.length; i++) {
      let date = diaries[i].date;
      let encryption = diaries[i].encryption;
      let rating = diaries[i].rating;

      diaries[i].filledstars = Math.floor(rating);
      diaries[i].halfstars = (rating % 1) * 2;
      diaries[i].unfilledstars = 10 - diaries[i].filledstars - diaries[i].halfstars;

      if (encryption == 'none') {
        diaries[i].encrypted = false;
      } else {
        diaries[i].encrypted = true;
      }

      diaries[i].datestring = DateTime.fromISO(date).toFormat('ccc, d. LLLL yyyy');
    }
  }
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

<UserPageLayout>
  <div class="flex">
    <div class="entries">
      {#if noDiaries}
        <p class="roboto">There is no Diary yet.</p>
      {/if}
      {#each diaries as diary}
        <div class="dir-flex">
          <div class="diary-entry roboto">
            <div class="a-content">
              <div class="flex">
                <p class="date">{diary.datestring}</p>
                <div class="starbox">
                  {#each { length: diary.filledstars } as filledstar}
                    <span class="fa fa-star star filledstar"></span>
                  {/each}
                  {#each { length: diary.halfstars } as halffilledstar}
                    <span class="fa fa-star-half-o star filledstar"></span>
                  {/each}
                  {#each { length: diary.unfilledstars } as unfilledstar}
                    <span class="fa fa-star star star"></span>
                  {/each}
                </div>
              </div>
              <div class="d-cont">
                <p class="prewrap">{diary.content}</p>
              </div>
            </div>
          </div>
          <div class="interactions">
            <button class="edit-button i-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
                ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                  d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
                /><path d="M13.5 6.5l4 4" /></svg
              >
            </button>
            <button class="delete-button i-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path
                  d="M14 11l0 6"
                /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path
                  d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
                /></svg
              >
            </button>
          </div>
        </div>
      {/each}
    </div>
    <div class="flex">
      <button class="create-button roboto" on:click={() => (showCreateDiaryModal = true)}>New Diary</button>
    </div>
  </div>
</UserPageLayout>

<FullModal bind:showModal={showCreateDiaryModal}>
  <p class="new-entry-title roboto">New Diary Entry</p>

  <div class="fields">
    <div class="settings" class:settings-wider={enc_algo !== 'None'}>
      <p class="date-desc desc roboto">Date:</p>
      <div>
        {#if submitState == 'already_exists'}
          <p class="small-error-msg roboto">Date already used</p>
        {/if}
        <input
          type="date"
          class="date-selector roboto"
          class:ds-key-ac={enc_algo !== 'None'}
          class:red-outline={submitState == 'already_exists'}
          bind:value={isoDate}
        />
      </div>

      <p class="desc roboto">Encryption:</p>
      <select bind:value={enc_algo} class="encryption-selector desc roboto">
        <option value="None">None</option>
        <option value="AES">AES</option>
      </select>

      {#if enc_algo !== 'None'}
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

      {#if enc_algo !== 'None'}
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
        bind:value={content}
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
              class:filledstar={star <= selectedStars || star - 0.5 === selectedStars}
              on:click={() => selectStars(star)}
            >
              {#if star - 0.5 === selectedStars}
                <i class="fa fa-star-half-o"></i>
              {:else}
                <i class="fa fa-star"></i>
              {/if}
            </span>
          {/each}
        </div>
        <input class="rating-input roboto" type="number" bind:value={selectedStars} min="0" max="10" step="0.5" />
      </div>
      <button
        on:click={submitCreateDiary}
        disabled={submitState != 'idle'}
        class="new-entry-button create-button roboto"
        class:disable-submit={submitState != 'idle'}>Create Diary Entry</button
      >
    </div>
  </div>
</FullModal>

<style>
  .flex {
    display: flex;
    justify-content: space-between;
  }

  .dir-flex {
    display: flex;
  }

  .interactions {
    align-self: center;
    width: 3rem;
    margin-top: -1rem; /* because full div has more height than expected, devided by 2 for centering*/
  }

  .i-button {
    cursor: pointer;
    border: none;
  }

  .edit-button {
    background-color: rgb(32, 250, 32);
    border-top-right-radius: 0.4rem;
  }

  .edit-button:hover {
    background-color: rgb(107, 231, 107);
  }

  .delete-button {
    background-color: red;
    border-bottom-right-radius: 0.4rem;
  }

  .delete-button:hover {
    background-color: rgb(255, 63, 63);
  }

  .a-content {
    width: 50vw;
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

  .d-cont {
    overflow-wrap: break-word;
  }

  .prewrap {
    white-space: pre-wrap;
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

  .diary-entry {
    color: white;
    padding: 0.2vw;
    padding-left: 1vw;
    background-color: rgb(32, 32, 44);
    border-radius: 0.2vw;
    margin-bottom: 2vh;
    display: flex !important;
    flex-direction: row !important;
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

  .date {
    display: flex;
    font-size: 24px;
    color: rgb(0, 255, 0);
  }

  .entries {
    width: 55vw;
    margin-left: 5vw;
    margin-top: 6vh;
    margin-right: 2vw;
    overflow: auto;
  }

  .roboto {
    color: white;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
