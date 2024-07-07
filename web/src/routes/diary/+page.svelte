<script>
  import CryptoJS from 'crypto-js';

  import UserPageLayout from '$lib/UserPageLayout.svelte';
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import { DateTime } from 'luxon';
  import FullModal from '$lib/modals/FullModal.svelte';
  import EditDiaryModal from '$lib/modals/EditDiaryModal.svelte';
  import CustomModal from '$lib/modals/CustomModal.svelte';
  import ConfirmationPopup from '$lib/modals/ConfirmationPopup.svelte';

  const hosturl = env.SERVER_URL || '';
  let selectedStars = 3;

  /**
   * @type any[];
   */
  let diaries = [];
  let showCreateDiaryModal = false;
  let showEditDiaryModal = false;
  let showDecryptModal = false;
  var today = new Date();
  let enc_algo = 'None';
  let enc_key = '';
  let enc_confirm_key = '';
  let content = '';
  var isoDate = today.toISOString().split('T')[0];
  let submitState = 'idle';
  let noDiaries;
  let editDiary;
  let decError = false;
  let dec_key = '';
  /** SubmitStates:
   * idle: Nothing/Default
   * no_key: Key-field and/or Confirm-key-field empty
   * inv_key: Confirm-key-field invalid
   * no_content: Missing diary content
   * already_exists: An entry with this date already exists
   * inv_rating: Rating is invalid
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

    //Generate hash to validate decryption keys
    var checksum = await CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);

    var finalcontent = '';

    let final_enc_algo = 'none';

    if (enc_algo == 'None') {
      final_enc_algo = 'none';

      finalcontent = content;
    } else {
      final_enc_algo = enc_algo;

      if (final_enc_algo == 'AES') finalcontent = await encryptAES(content, enc_key);
    }

    var submitBody = await JSON.stringify({
      content: finalcontent,
      date: isoDate,
      rating: selectedStars,
      encryption: final_enc_algo,
      checksum: checksum,
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
    } else if (
      submitres.message[0] == 'rating must not be less than 0.5' ||
      submitres.message[0] == 'rating must not be greater than 10'
    ) {
      submitState = 'inv_rating';
      ratelimitSubmitNewDiary();
    }
  }

  $: {
    if (dec_key != '') {
      decError = false;
    }
  }

  function decrypt() {
    if (dec_key == '') {
      decError = true;
    } else {
      decError = false;
      //Start Decryption Attempts
      for (let i = 0; i < diaries.length; i++) {
        var decryptor = diaries[i].encryption;
        var tempcontent = '';
        if (decryptor == 'none' || !diaries[i].localencrypted) continue;
        if (decryptor == 'AES') {
          try {
            tempcontent = decryptAES(diaries[i].content, dec_key);
          } catch (err) {
            console.log(err);
            continue;
          }
        }
        if (diaries[i].checksum === CryptoJS.SHA256(tempcontent).toString(CryptoJS.enc.Hex)) {
          diaries[i].content = tempcontent;
          diaries[i].localencrypted = false;
        }
      }

      showDecryptModal = false;
    }
  }

  function encryptAES(text, passphrase) {
    const encrypted = CryptoJS.AES.encrypt(text, passphrase);
    return encrypted.toString();
  }

  function decryptAES(ciphertext, passphrase) {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, passphrase);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  function ratelimitSubmitNewDiary() {
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

    if (!diaries || diaries.length == 0) {
      noDiaries = true;
    }

    for (let i = 0; i < diaries.length; i++) {
      let date = diaries[i].date;
      let encryption = diaries[i].encryption;
      let rating = diaries[i].rating;

      diaries[i].filledstars = Math.floor(rating);
      diaries[i].halfstars = (rating % 1) * 2;
      diaries[i].unfilledstars = 10 - diaries[i].filledstars - diaries[i].halfstars;

      if (encryption == 'none') {
        diaries[i].encrypted = false;
        diaries[i].localencrypted = false;
      } else {
        diaries[i].encrypted = true;
        diaries[i].localencrypted = true;
      }

      diaries[i].datestring = DateTime.fromISO(date).toFormat('ccc, d. LLLL yyyy');
    }

    diaries.sort(function (a, b) {
      return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
    });
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
              {#if !diary.localencrypted}
                <div class="d-cont">
                  <p class="prewrap">{diary.content}</p>
                </div>
              {:else}
                <div class="encrypted-info">
                  <p class="encrypted-diary-text roboto">Decrypt to see | {diary.encryption}</p>
                </div>
              {/if}
            </div>
          </div>
          <div class="interactions">
            <button
              class="edit-button i-button"
              on:click={() => {
                if (!diary.localencrypted) {
                  showEditDiaryModal = true;
                  editDiary = diary;
                } else {
                  showDecryptModal = true;
                }
              }}
            >
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
    <div class="action-buttons">
      <button class="create-button roboto" on:click={() => (showCreateDiaryModal = true)}>New Diary</button>
      <button class="decrypt-button roboto" on:click={() => (showDecryptModal = true)}>Decrypt Diaries</button>
    </div>
  </div>
</UserPageLayout>

<CustomModal bind:showModal={showDecryptModal} width={'18'} height={'18'}>
  <div class="flex-col">
    {#if decError}
      <div class="dec-error-div">
        <p class="inv-dec-msg small-error-msg roboto">Key cannot be empty</p>
      </div>
    {/if}
    <input class="dec-key-input roboto" bind:value={dec_key} placeholder="Decryption Key" />
    <button class="dec-button roboto" on:click={decrypt}>Decrypt</button>
  </div>
</CustomModal>

<FullModal bind:showModal={showCreateDiaryModal}>
  <p class="new-entry-title roboto">New Diary Entry</p>

  <div class="fields">
    <div class="settings" class:settings-wider={enc_algo !== 'None'}>
      <p class="descriptor date-desc desc roboto">Date:</p>
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

      <p class="descriptor desc roboto">Encryption:</p>
      <select bind:value={enc_algo} class="encryption-selector desc roboto">
        <option value="None">None</option>
        <option value="AES">AES</option>
      </select>

      {#if enc_algo !== 'None'}
        <p class="descriptor desc roboto">Key:</p>
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
        <p class="descriptor confirm-desc desc roboto">Confirm Key:</p>
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
      {#if submitState == 'inv_rating'}
        <p class="inv-rating-error-msg small-error-msg roboto">Invalid rating</p>
      {/if}
      <button
        on:click={submitCreateDiary}
        disabled={submitState != 'idle'}
        class="new-entry-button create-button roboto"
        class:disable-submit={submitState != 'idle'}>Create Diary Entry</button
      >
    </div>
  </div>
</FullModal>

<EditDiaryModal bind:showEditDiaryModal bind:editDiary on:toggle={fetchDiaries} />

<style scoped>
  .flex {
    display: flex;
    justify-content: space-between;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .dir-flex {
    display: flex;
  }

  .interactions {
    align-self: center;
    gap: 0;
    display: flex;
    width: 1.5rem;
    flex-direction: column;
    margin-bottom: 2vh;
  }

  .i-button {
    cursor: pointer;
    border: none;
    gap: 0;
  }

  .edit-button {
    background-color: rgb(32, 250, 32);
    border-top-right-radius: 0.4rem;
    gap: 0;
  }

  .edit-button:hover {
    background-color: rgb(107, 231, 107);
  }

  .delete-button {
    background-color: red;
    border-bottom-right-radius: 0.4rem;
    gap: 0;
  }

  .delete-button:hover {
    background-color: rgb(255, 63, 63);
  }

  .a-content {
    width: 51vw;
  }

  .key-input {
    box-sizing: border-box;
    height: 2.5rem;
    margin-top: 0.8vh;
    color: black !important;
    font-size: 20px !important;
  }

  .content-error {
    position: relative;
    margin-left: 0.2rem;
    margin-top: 30.5vh !important;
  }

  .d-cont {
    overflow-wrap: break-word;
    line-height: 1.4rem;
  }

  .prewrap {
    white-space: pre-wrap;
  }

  .small-error-msg {
    position: absolute;
    color: red !important;
    font-size: 17px !important;
    height: 0;
    margin-top: -1rem;
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

  .inv-rating-error-msg {
    margin-top: 5.4rem;
  }

  .r-inputs {
    justify-content: start;
    margin-top: -1.2rem;
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
    margin-top: 1.2rem;
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
    box-sizing: border-box;
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
    margin-bottom: 0.5rem;
    margin-top: 1.2rem;
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
    padding-left: 0.5rem;
    height: 50px;
  }

  .new-entry-title {
    margin-top: 0.6rem;
    font-size: 36px !important;
    color: rgb(0, 255, 0) !important;
    text-align: center;
  }

  .settings {
    width: 100%;
    display: flex;
    margin-top: 1.6vh;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    justify-content: center;
  }

  .settings-wider {
    width: 100% !important;
  }

  .date-desc {
    margin-left: 0.6rem;
  }

  .date-selector {
    color: black !important;
    box-sizing: border-box;
    height: 2.5rem;
    margin-top: 1vh;
    margin-right: 1rem;
  }

  .ds-key-ac {
    margin-right: 1rem;
  }

  .desc {
    font-size: 20px !important;
    height: 2.5rem;
    margin-right: 16px;
  }

  .descriptor {
    margin-top: 0.25rem;
    height: 100%;
    align-self: center;
  }

  .fields {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .action-buttons {
    display: flex;
    margin-right: 22vw;
  }

  .create-button {
    position: fixed;
    margin-top: 6vh;
    width: 12vw;
    height: 5vh;
    background-color: rgb(0, 211, 0);
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .encrypted-info {
    height: 5.2rem;
    display: flex;
    align-items: center;
  }

  .encrypted-diary-text {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    font-size: 2rem !important;
    margin-top: -1.8rem;
    color: rgb(48, 117, 255) !important;
  }

  .decrypt-button {
    position: fixed;
    margin-top: 13vh;
    width: 12vw;
    height: 5vh;
    background-color: rgb(48, 117, 255);
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .decrypt-button:active {
    background-color: rgb(30, 80, 179);
  }

  .create-button:active {
    background-color: rgb(2, 172, 2);
  }

  .diary-entry {
    color: white;
    padding-top: 0.5vw;
    padding-bottom: 0.5vw;
    padding-left: 1vw;
    padding-right: 1vw;
    background-color: rgb(32, 32, 44);
    border-radius: 0.2vw;
    margin-bottom: 1.8rem;
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
    margin-bottom: 1rem;
    font-size: 24px;
    color: rgb(0, 255, 0);
  }

  .entries {
    width: 55vw;
    margin-left: 5vw;
    margin-top: 6vh;
    margin-right: 2vw;
    max-height: 90vh;
    overflow-y: auto;
  }

  .dec-button {
    background-color: rgb(48, 117, 255);
    width: 12.5rem;
    height: 2.5rem;
    margin-top: 0.75rem;
    margin-left: auto;
    margin-right: auto;
    border-radius: 0.5vw;
  }

  .dec-button:active {
    background-color: rgb(30, 80, 179);
  }

  .inv-dec-msg {
    margin-top: 0.65rem;
  }

  .dec-error-div {
    width: 12.5rem;
    margin-left: auto;
    margin-right: auto;
  }

  .dec-key-input {
    color: white;
    background-color: rgb(32, 32, 32);
    font-size: 1rem;
    width: 12.5rem;
    height: 2.5rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2.1rem;
    border-style: solid;
    border-radius: 0.3vw;
    border-color: rgb(48, 117, 255);
    border-width: 0.15vw;
    padding-left: 0.4vw;
  }

  .roboto {
    color: white;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
