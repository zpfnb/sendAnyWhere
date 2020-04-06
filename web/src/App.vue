<template>
  <div id="app">
    <Send/>
  </div>
</template>

<script>
import Send from "./components/Send";

export default {
  name: "App",
  components: {
    Send
  }
};
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  left: 0;
  width: 100vw;
}
@media screen and (min-width: 500px) {
  #app{
    width: 375px;
    left: 0;
    right: 0;
    margin: auto;
    background-color: #F1F1F1;
  }
}

</style>
