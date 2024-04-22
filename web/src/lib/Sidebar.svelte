<script>
  let currentTab = "home";
</script>

<div class="roboto bar-container">
  <!--Home-Icon Start-->
  <!-- svelte-ignore a11y-interactive-supports-focus -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="bar-element {currentTab === 'home' ? 'selected' : ''}"
    on:click={() => (currentTab = "home")}
    role="button"
  >
    <svg
      alt="home-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-home"
      ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
        d="M5 12l-2 0l9 -9l9 9l-2 0"
      /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path
        d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"
      /></svg
    >
    <p class="element-name">Home</p>
  </div>
  <!--Home-Icon End-->
</div>

<style>
  .selected {
    background-color: rgba(0, 255, 0, 0.151);
    border-radius: 10px;
  }

  .bar-element {
    margin-left: 0.8vw;
    margin-top: 0.6vw;
    width: 14vw;
    display: flex;
    cursor: pointer;
  }

  .bar-element:hover {
    background-color: rgb(48, 48, 56);
    border-radius: 10px;
  }

  .element-name {
    margin-left: 10px;
    text-align: center;
  }

  .icon {
    margin-left: 6px;
    width: 32px;
    color: white;
    pointer-events: none;
  }

  .bar-container {
    background-color: rgb(32, 32, 44);
    width: 16vw;
    height: 100vh;
    position: fixed;
    left: 0px;
    border-bottom-right-radius: 16px;
    border-top-right-radius: 16px;
  }

  .roboto {
    color: white;
    font-size: 18px;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
