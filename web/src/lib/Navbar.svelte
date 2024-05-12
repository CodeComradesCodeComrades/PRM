<script>
</script>

<div class="bar-container">
  <p class="roboto title">PRM</p>
</div>

<style>
  .bar-container {
    position: fixed;
    z-index: 1;
    left: 0px;
    bottom: 93vh;
    background-color: rgb(16, 16, 16);
    border-width: 1px;
    border-color: rgb(59, 54, 54);
    border-bottom-style: solid;
    width: 100vw;
  }

  .title {
    font-size: 4vh;
    margin-bottom: 1.2vh;
  }

  .roboto {
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-style: normal;
  }

  @media (min-width: 2400px) {
    .bar-container {
      bottom: 94vh;
    }
  }
</style>
