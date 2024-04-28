<script>
  import UserPageLayout from "$lib/UserPageLayout.svelte";
</script>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>

<UserPageLayout>
  <div class="entries">
    <div class="diary-entry roboto">
      <div class="flex">
        <p class="date">Mon, 28. April 2024</p>
        <div class="starbox">
          <!--unfilled stars-->
          {#each { length: 3 } as filledstar}
            <span class="fa fa-star star filledstar"></span>
          {/each}
          <!--unfilled stars-->
          <!--filled stars-->
          {#each { length: 7 } as unfilledstar}
            <span class="fa fa-star star star"></span>
          {/each}
          <!--filled stars-->
        </div>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>
    </div>
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
