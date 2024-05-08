<script>
  import UserPageLayout from '$lib/UserPageLayout.svelte';
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import { DateTime } from 'luxon';
  import FullModal from '$lib/modals/FullModal.svelte';

  const hosturl = env.SERVER_URL || '';

  /**
   * @type any[];
   */
  let diaries = [];
  let showCreateDiaryModal = false;
  var today = new Date();
  var isoDate = today.toISOString().split('T')[0];

  onMount(() => {
    fetchDiaries();
  });

  async function fetchDiaries() {
    const fetchres = await fetch(hosturl + '/api/diary', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const diaryjson = await fetchres.json();
    diaries = diaryjson.diaries;

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
      {#each diaries as diary}
        <div class="diary-entry roboto">
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
          <p>{diary.content}</p>
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
    <div class="settings">
      <p class="desc roboto">Date:</p>
      <input type="date" class="date-selector roboto" bind:value={isoDate} />

      <p class="desc roboto">Encryption:</p>
      <select class="encryption-selector desc roboto">
        <option value="0">None</option>
        <option value="1">AES</option>
      </select>
    </div>
  </div>
</FullModal>

<style>
  .flex {
    display: flex;
    justify-content: space-between;
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
    width: 30vw;
    display: flex;
  }

  .date-selector {
    color: black !important;
    height: 40px;
    margin-top: 1vh;
    margin-right: 4vw;
  }

  .desc {
    font-size: 20px !important;
    margin-right: 16px;
  }

  .fields {
    display: flex;
    justify-content: center;
  }

  .create-button {
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
    padding-right: 1vw;
    background-color: rgb(32, 32, 44);
    margin-bottom: 2vh;
    border-radius: 0.2vw;
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
    margin-left: 5vw;
    margin-top: 6vh;
    margin-right: 2vw;
  }

  .roboto {
    color: white;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
