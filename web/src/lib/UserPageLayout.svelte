<script lang="ts">
  import Sidebar from '$lib/Sidebar.svelte';
  import Navbar from '$lib/Navbar.svelte';

  export let hideNavbar = false;
</script>

<header>
  {#if !hideNavbar}
    <Navbar />
  {/if}

  <slot name="header" />
</header>
<main
  tabindex="-1"
  class="relative grid h-screen grid-cols-[theme(spacing.18)_auto] overflow-hidden bg-prm-bg pt-[var(--navbar-height)] md:grid-cols-[theme(spacing.64)_auto]"
>
  <slot name="sidebar">
    <Sidebar />
  </slot>

  <section class="relative">
    <slot />
  </section>
</main>
