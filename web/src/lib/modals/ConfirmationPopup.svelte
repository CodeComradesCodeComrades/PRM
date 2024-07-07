<script>
  export let showPopup = true;
  export let showCloseButton = true;

  export let description = '';

  let popup;

  $: if (popup && showPopup) {
    popup.showModal();
  } else if (popup && !showPopup) {
    popup.close();
  }
</script>

<dialog class={`popup`} bind:this={popup} on:close={() => (showPopup = false)} style={`width: 20vw; height: 21vh;`}>
  <div class="info">
    <p class="title roboto">Confirm action</p>
    <hr class="hr" />
  </div>
  <div class="cont flex">
    {#if showCloseButton}
      <div class="close">
        <button class="text-white text-2xl" on:click={() => popup.close()}>✕</button>
      </div>
    {/if}
    <slot />
    <div>
      <p class="desc-text roboto">{description}</p>
      <div class="buttons">
        <button class="cancel-button roboto">Cancel</button>
        <button class="confirm-button roboto">Confirm</button>
      </div>
    </div>
  </div>
</dialog>

<style>
  .title {
    margin-left: auto;
    margin-right: auto;
    font-size: 1.4rem;
    color: rgb(0, 255, 0);
  }

  .info {
    align-items: center;
    padding: 0.2rem;
    display: flex;
    height: 5vh;
    background-color: rgb(17, 17, 17);
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    border-style: solid;
    border-top-color: gold;
    border-left-color: gold;
    border-right-color: gold;
    border-width: 1px;
    border-bottom: transparent;
  }

  .close {
    position: absolute;
    right: 0.35rem;
  }

  .cont {
    height: 16vh;
    flex-direction: row;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(54, 53, 53);
    background-color: rgb(10, 10, 10);
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    border-top-color: rgba(238, 255, 0, 0.068);
  }

  .popup {
    background-color: transparent;
  }

  .confirm-button {
    width: 8vw;
    height: 4.6vh;
    background-color: rgb(48, 117, 255);
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .confirm-button:active {
    background-color: rgb(30, 80, 179);
  }

  .cancel-button {
    width: 8vw;
    height: 4.6vh;
    background-color: red;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .cancel-button:active {
    background-color: rgb(175, 0, 0);
  }

  .buttons {
    position: absolute;
    margin-right: auto;
    right: 1vw;
    left: 1vw;
    margin-bottom: 1.25vh;
    margin-left: auto;
    justify-content: space-between;
    width: 17.5vw;
    display: flex;
    flex-direction: row;
    bottom: 0.2rem;
  }

  .desc-text {
    font-size: 1.2rem;
    margin-left: 0.6rem;
    margin-top: 0.2rem;
    margin-right: 2rem;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
</style>
