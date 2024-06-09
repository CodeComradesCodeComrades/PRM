<script>
  export let value = '';
  export let label = '';
  export let id = '';
</script>

<div class="flex flex-col gap-2">
  <label for={id} class="prm-form-label">{label}</label>
  <input bind:value {id} {...$$props} class="prm-form-input" />
</div>
