<script lang="ts">
  import LoadingDots from '$lib/animations/LoadingDots.svelte';
  import { goto } from '$app/navigation';
  import { AppRoute } from '$lib/constants';

  const hosturl = '';

  let animateLoginButton = false;
  let loginState = 'idle';

  let username = '';
  let password = '';

  /* Info: Login-States
  processing = login currently happening
  internal_error = server HTTP/500
  timeout = cannot connect to server
  inv_name = invalid username/mail
  inv_pass = wrong password
  */

  async function handleLogin() {
    animateLoginButton = true;
    loginState = 'processing';

    var loginbody;

    if (validateEmail(username)) {
      loginbody = JSON.stringify({
        email: username,
        password: password,
      });
    } else {
      loginbody = JSON.stringify({
        username: username,
        password: password,
      });
    }

    const loginres = await fetch(hosturl + '/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: loginbody,
    });

    if (loginres.ok) {
      void goto(AppRoute.MAIN_PAGE);
    } else {
      const loginresjson = await loginres.json();

      if (
        loginresjson.message[0] == 'email must be an email' ||
        loginresjson.message[0] == 'email should not be empty' ||
        loginresjson.message[0] == 'name should not be empty'
      ) {
        loginState = 'inv_name';
      } else if (
        loginresjson.message[0] == 'password should not be empty' ||
        loginresjson.message == 'Incorrect login details'
      ) {
        loginState = 'inv_pass';
      } else if (loginres.status == 500) {
        loginState = 'internal_error';
      }

      username = '';
      password = '';
    }

    resetButton();
  }

  function resetButton() {
    setTimeout(() => {
      animateLoginButton = false;
    }, 1000);
  }

  function validateEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
</script>

<main>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" />
  <div class="loginbox">
    <div>
      <p class="login-header roboto">Log in</p>
    </div>

    <div class="user-box">
      <div class="feedback-head">
        <p class="login-name roboto">Email or Username</p>
      </div>
      {#if loginState == 'inv_name'}
        <p class="user-feedback roboto">Invalid Email or Username</p>
        <i class="red user-icon fas fa-user"></i>
      {:else}
        <i class="user-icon fas fa-user"></i>
      {/if}
      <input
        type="text"
        id="userfield"
        name="userfield"
        placeholder="Email or Username"
        class="form-field user-field roboto"
        bind:value={username}
      />
    </div>

    <div class="pw-box">
      <div class="feedback-head">
        <p class="pw-name roboto">Password</p>
        {#if loginState == 'inv_pass'}
          <p class="pass-feedback roboto">Invalid Password</p>
        {/if}
      </div>
      {#if loginState == 'inv_pass'}
        <p class="pass-feedback roboto">Invalid Password</p>
        <i class="red pw-icon fas fa-lock"></i>
      {:else}
        <i class="pw-icon fas fa-lock"></i>
      {/if}
      <input
        type="password"
        id="pwfield"
        name="pwfield"
        placeholder="Password"
        class="form-field pw-field roboto"
        bind:value={password}
      />
    </div>
    {#if animateLoginButton}
      <button class="hide-text login-button roboto">Login</button>
      <div class="login-loader"><LoadingDots /></div>
    {:else}
      <button class="login-button roboto" on:click={handleLogin}>Login</button>
    {/if}

    <div>
      {#if loginState == 'internal_error'}
        <p class="error-msg roboto">Oops... something went wrong /:</p>
      {:else if loginState == 'timeout'}
        <p class="error-msg roboto">Connection to the Server timed out</p>
      {/if}
    </div>

    <p class="credits roboto">Made by DaFeist & Fllooo</p>
  </div>
</main>

<style>
  .credits {
    color: white;
    text-align: right;
    margin-right: 0.6vw;
    margin-top: 25vh;
  }

  .red {
    color: red;
  }

  .user-feedback {
    width: 12vw;
    margin-left: 17vw;
    color: red;
    margin-top: -2vh;
    font-size: 1.8vh;
    position: absolute;
  }

  .pass-feedback {
    width: 12vw;
    margin-left: 20.6vw;
    color: red;
    margin-top: -2vh;
    font-size: 1.8vh;
    position: absolute;
  }

  .feedback-head {
    display: block;
    position: relative;
  }

  .error-msg {
    color: red;
    font-size: 2.2vh;
    text-align: center;
    margin-top: 4vh;
  }

  .loginbox {
    background-color: rgb(32, 32, 32);
    height: 64vh;
    width: 30vw;
    margin-left: auto;
    margin-right: auto;
    margin-top: 7vh;
    border-radius: 0.6vw;
  }

  .login-loader {
    position: relative;
    height: 5vh;
    margin-top: -5.1vh;
  }

  *:focus {
    outline: none;
  }

  .hide-text {
    text-indent: -9999px;
  }

  .login-button {
    margin: 0 auto;
    display: block;
    width: 20vw;
    height: 4.6vh;
    margin-top: 4vh;
    background-color: rgb(48, 117, 255);
    border-style: none;
    border-radius: 0.3vw;
    font-size: 2vh;
    color: white;
    cursor: pointer;
    transition-duration: 0.4s;
  }

  .login-button:hover {
    background-color: rgb(30, 80, 179);
  }

  .user-box {
    display: inline-block;
    margin-top: 2.6vh;
  }

  .pw-name {
    color: white;
    font-size: 1.8vh;
    margin: 10vh 0 0 3.9vw;
  }

  .pw-box {
    margin-top: -7.4vh;
  }

  i {
    color: white;
    font-size: 1.6vw;
  }

  .user-icon {
    margin: 0.82vh 3vw 0 1.75vw;
  }

  .pw-icon {
    margin: 0.82vh -2.35vw 0 1.75vw;
  }

  .form-field {
    color: white;
    background-color: rgb(32, 32, 32);
    margin: 0 3vw 0 3vw;
    height: 4vh;
    width: 23vw;
    font-size: 1vw;
    position: absolute;
    border-style: solid;
    border-radius: 0.3vw;
    border-color: rgb(255, 102, 0);
    border-width: 0.2vw;
    padding-left: 0.4vw;
  }

  ::placeholder {
    color: rgb(92, 92, 92);
  }

  .user-field {
    margin: 0 0 0 -2.35vw;
  }

  .login-name {
    color: white;
    font-size: 1.8vh;
    margin: 10vh 0 0 3.9vw;
  }

  .login-header {
    color: white;
    font-size: 2.4vw;
    margin: 3vh 0 0 3.75vw;
    position: absolute;
  }

  .roboto {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
