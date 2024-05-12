<script>
  import Navbar from "$lib/Navbar.svelte";
  import Sidebar from "$lib/Sidebar.svelte";
</script>

<Navbar />
<Sidebar />

<div class="page-content">
  <slot />
</div>

<style>
  .page-content {
    position: absolute;
    margin-top: 7vh;
    margin-left: 16vw;
  }

  @media (min-width: 2400px) {
    .page-content {
      margin-top: 6vh;
    }
  }
</style>
