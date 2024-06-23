<script>
  export let showModal;
  export let showCloseButton = true;
  export let classes = '';
  export let width = '80';
  export let height = '80';

  let dialog;

  $: if (dialog && showModal) {
    dialog.showModal();
  } else if (dialog && !showModal) {
    dialog.close();
  }
</script>

<dialog
  class={`dialog ${classes}`}
  bind:this={dialog}
  on:close={() => (showModal = false)}
  style={`width: ${width}vw; height: ${height}vh;`}
>
  {#if showCloseButton}
    <div class="absolute top-2 right-4">
      <button class="text-white text-2xl" on:click={() => dialog.close()}>✕</button>
    </div>
  {/if}
  <slot />
</dialog>

<style>
  .dialog {
    width: 80vw;
    height: 80vh;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(82, 82, 82);
    background-color: rgb(10, 10, 10);
    border-radius: 4px;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
</style>
