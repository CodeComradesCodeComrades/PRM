<script>
  export let showModal;

  let dialog;

  $: if (dialog && showModal) {
    dialog.showModal();
  } else if (dialog && !showModal) {
    dialog.close();
  }
</script>

<dialog class="dialog" bind:this={dialog} on:close={() => (showModal = false)}>
  <div class="close-div">
    <button class="close-button" on:click={() => dialog.close()}>✕</button>
  </div>
  <slot />
</dialog>

<style>
  .dialog {
    border-style: solid;
    border-width: 1px;
    border-color: rgb(82, 82, 82);
    width: 80vw;
    height: 80vh;
    background-color: rgb(10, 10, 10);
    border-radius: 4px;
  }

  .close-div {
    position: absolute;
    float: right;
    right: 18px;
    margin-top: -4px;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  .close-button {
    cursor: pointer;
    border: none;
    background: none;
    color: white;
    font-size: 30px;
    float: right;
  }
</style>
