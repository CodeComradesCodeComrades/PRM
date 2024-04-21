<script>
  import home_icon from "$lib/assets/home_icon.svg";
</script>

<div class="roboto bar-container">
  <div class="bar-element" role="button">
    <img src={home_icon} alt="home-icon" class="icon" />
    <p class="element-name">Home</p>
  </div>
</div>

<style>
  .bar-element {
    margin-left: 0.8vw;
    margin-top: 0.6vw;
    display: flex;
    cursor: pointer;
  }

  .element-name {
    margin-left: 10px;
    text-align: center;
  }

  .icon {
    width: 32px;
    color: white;
    pointer-events: none;
  }

  .bar-container {
    background-color: rgb(32, 32, 44);
    width: 16vw;
    height: 100vh;
    position: fixed;
    left: 0px;
    border-bottom-right-radius: 16px;
    border-top-right-radius: 16px;
  }

  .roboto {
    color: white;
    font-size: 18px;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-style: normal;
  }
</style>
