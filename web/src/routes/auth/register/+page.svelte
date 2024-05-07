<script lang="ts">
  import FullscreenContainer from '$lib/components/shared-components/fullscreen-container.svelte';
  import Input from '$lib/components/shared-components/input.svelte';
  import { createFirstAdmin } from '@prm/sdk';
  import NeonButton from '$lib/components/elements/buttons/neon-button.svelte';
  import { AppRoute } from '$lib/constants';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let name = '';

  let errorMessage = '';
  let canRegister = false;

  $: {
    if (password !== confirmPassword && confirmPassword.length > 0) {
      errorMessage = 'Password does not match';
      canRegister = false;
    } else {
      errorMessage = '';
      canRegister = true;
    }
  }

  async function registerAdmin() {
    if (canRegister) {
      errorMessage = '';

      try {
        await createFirstAdmin({
          createUserDto: {
            email: email,
            name: name,
            password: password,
            username: username,
          },
        });
        await goto(AppRoute.AUTH_LOGIN);
      } catch {
        errorMessage = 'Error create admin account';
      }
    }
  }
</script>

<FullscreenContainer title="Register">
  <p slot="message">This is a test!</p>
  {#if errorMessage}
    <p class="text-red-400" transition:fade>{errorMessage}</p>
  {/if}
  <form on:submit|preventDefault={registerAdmin} method="post" class="flex flex-col gap-5">
    <Input
      label="Username"
      id="username"
      type="username"
      autocomplete="username"
      placeholder="Username"
      required
      bind:value={username}
    />
    <Input
      label="Full name"
      id="name"
      type="name"
      autocomplete="name"
      placeholder="Full name"
      required
      bind:value={name}
    />
    <Input label="Email" id="email" type="email" autocomplete="email" placeholder="Email" required bind:value={email} />
    <Input
      label="Password"
      id="password"
      type="password"
      autocomplete="password"
      placeholder="Password"
      required
      bind:value={password}
    />
    <Input
      label="Confirm password"
      id="confirmpassword"
      type="password"
      autocomplete="password"
      placeholder="Confirm password"
      required
      bind:value={confirmPassword}
    />
    <div class="w-full flex flex-col my-7">
      <NeonButton>
        <p1>Sign up!</p1>
      </NeonButton>
    </div>
  </form>
</FullscreenContainer>
