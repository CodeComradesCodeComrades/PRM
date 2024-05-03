<script lang="ts">
  export let title = '';
</script>

<section class="min-w-screen flex min-h-screen place-content-center place-items-center p-4">
  <div class="flex w-full max-w-lg flex-col gap-4 rounded-3xl bg-prm-primary p-8 shadow-sm">
    <div class="flex flex-col place-content-center place-items-center gap-4 py-4">
      <h1 class="text-2xl font-medium text-white">
        {title}
      </h1>
    </div>
    {#if $$slots.message}
      <div class="w-full rounded-sm p-2 font-medium border-2 text-xs text-white border-gray-600">
        <slot name="message" />
      </div>
    {/if}
    <slot />
  </div>
</section>
