<script>
  import UserPageLayout from "$lib/UserPageLayout.svelte";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { DateTime } from "luxon";

  const hosturl = env.SERVER_URL || "";

  let diaries = [];

  onMount(() => {
    fetchDiaries();
  });

  async function fetchDiaries() {
    const fetchres = await fetch(hosturl + "/api/diary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
      diaries[i].unfilledstars =
        10 - diaries[i].filledstars - diaries[i].halfstars;

      if (encryption == "none") {
        diaries[i].encrypted = false;
      } else {
        diaries[i].encrypted = true;
      }

      diaries[i].datestring =
        DateTime.fromISO(date).toFormat("ccc, d. LLLL yyyy");
    }
  }
</script>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>

<UserPageLayout>
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
</UserPageLayout>

<style>
  .flex {
    display: flex;
    justify-content: space-between;
  }

  .diary-entry {
    color: white;
    padding: 0.2vw;
    padding-left: 1vw;
    padding-right: 1vw;
    background-color: rgb(32, 32, 44);
    margin-right: 20vw;
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
  }

  .roboto {
    color: white;
    font-size: 18px;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
