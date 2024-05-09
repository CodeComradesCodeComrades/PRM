<script lang="ts">
  import { AppRoute } from '$lib/constants';
  import { fade } from 'svelte/transition';
  import '$lib/tailwind.css';
</script>

<div class="outerbox" out:fade={{ duration: 150 }}>
  <div class="onboarding">
    <h1 class="roboto-medium">PRM</h1>
    <a href={AppRoute.AUTH_REGISTER} class="roboto-thin"><button>Getting started </button></a>
  </div>
</div>

<style>
  .outerbox {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .onboarding {
    text-align: center;
    margin-bottom: 4vh;
    color: bisque;
  }
  button {
    padding: 1vh;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 1.2vh;
    width: 20vh;
  }
  button:hover {
    background-color: #0056b3;
  }
</style>
