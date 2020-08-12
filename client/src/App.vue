<template>
  <div id="container">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="MYAPP" />
    <p>{{datum}}</p>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data: function(){
    return  {
      datum: ''
    }
  },
  async created(){
    // var response = await fetch("http://127.0.0.1:3000/api/animal")
    var response = await fetch("https://api.npms.io/v2/search?q=vue"); //example url
    var result = await response.json()
    this.datum = result.results;
  }
}
</script>

<style>
#container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
