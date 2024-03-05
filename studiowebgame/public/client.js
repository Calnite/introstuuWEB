const { createApp, ref, onMounted } = Vue

createApp({
  setup() {
    const acceleration = ref({ x: 0, y: 0, z: 0 })
    const orientation = ref({ alpha: 0, beta: 0, gamma: 0 })
    const shakeCounter = ref(0)

    function deviceMotionHandler(event) {
      acceleration.value.x = Math.round(event.acceleration.x * 10) / 10;
      acceleration.value.y = Math.round(event.acceleration.y * 10) / 10;
      acceleration.value.z = Math.round(event.acceleration.z * 10) / 10;
    }

    function deviceOrientationHandler(event) {
      orientation.value.alpha = Math.round(event.alpha * 10) / 10;
      orientation.value.beta = Math.round(event.beta * 10) / 10;
      orientation.value.gamma = Math.round(event.gamma * 10) / 10;
    }

    function handleShake(event) {
      shakeCounter.value++;
    }

    function handleClick() {
      window.navigator.vibrate([200, 100, 200]);
    }

    onMounted(() => {
      // https://developers.google.com/web/fundamentals/native-hardware/device-orientation/
      // https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMotionHandler.bind(this));
      } else {
        console.log("DeviceMotionEvent not supported")
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', deviceOrientationHandler.bind(this));
      } else {
        console.log("DeviceOrientationEvent not supported")
      }

      let myShakeEvent = new Shake({
        threshold: 8, // optional shake strength threshold
        timeout: 500 // optional, determines the frequency of event generation
      });

      myShakeEvent.start();

      window.addEventListener('shake', handleShake.bind(this), false);

    })

    return {
      acceleration,
      orientation,
      shakeCounter,
      deviceMotionHandler,
      deviceOrientationHandler,
      handleShake,
      handleClick

    }
  }

}).mount('#app')