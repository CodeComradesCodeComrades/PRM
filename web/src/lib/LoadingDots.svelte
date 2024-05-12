<!-- NOTE: LoadingDots always need to be in a div -->

<span class="pulse"></span>
<span class="pulse"></span>
<span class="pulse"></span>

<style>
  .pulse {
    position: absolute;
    top: 50%;
    left: calc(50% - 15px);
    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius: 50%;
    animation: pulseAnimation 1s infinite;
  }

  .pulse:nth-child(2) {
    left: calc(50%);
  }

  .pulse:nth-child(3) {
    left: calc(50% + 15px);
  }

  @keyframes pulseAnimation {
    0% {
      transform: scale(0.1);
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
</style>
