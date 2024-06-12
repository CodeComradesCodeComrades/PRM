<script lang="ts">
  let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<section id="dashboard-navbar" class="fixed z-[900] h-[var(--navbar-height)] w-screen text-sm">
  <div
    class="grid h-full grid-cols-[theme(spacing.18)_auto] items-center border-b bg-prm-bg py-2 md:grid-cols-[theme(spacing.64)_auto]"
  >
    <h1 class="font-bold text-4xl ml-2">PRM</h1>
    <div class="flex justify-between gap-16 pr-6">

      <section class="flex place-items-center justify-end gap-4 max-sm:w-full">
      </section>
    </div>
  </div>
</section>
