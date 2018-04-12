<!--suppress ALL -->
<template>
  <div>
<router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
    }
  }
}
</script>

<style lang="scss">
  @import "../node_modules/bootstrap/scss/bootstrap.scss";
  @import url('https://fonts.googleapis.com/css?family=Bungee+Hairline');
  @import url('https://fonts.googleapis.com/css?family=Montserrat');
  @import url('https://fonts.googleapis.com/earlyaccess/mplus1p.css');
  @import url(//fonts.googleapis.com/earlyaccess/notosanstc.css);
  html{
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
    position: relative;
  }
  body{
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
    scroll-behavior: smooth;
  }
  #app{
    padding-top: 60px;
  }
  ul li {
    list-style: none;
    padding: 0;
  }
  h1{
    font-family: 'Bungee Hairline', "Mplus 1p";
    font-weight: 100 !important;
  }
  h4{
    font-family:  'Bungee Hairline', "Mplus 1p";
    font-weight: 100 !important;
  }
  a {
    display: inline-block;
    font-family: 'Bungee Hairline', "Mplus 1p";
    font-weight: 100 !important;
    color: black;
    text-decoration: none;
    font-size: 1.5rem;
  }
  span {
    font-family: 'Bungee Hairline', "Mplus 1p";
    font-weight: 100 !important;
  }
  body {
    margin: 0;
    transition: .2s ease-in;
  }
  p{
    font-family: 'Montserrat', sans-serif;
  }

  .btn-circle{
    width: 2.5rem;
    height: 2.5rem;
    text-align: center;
    padding: 6px 0;
    font-size: 1.25rem;
    text-align: center;
    line-height: 1.42;
    border-radius: 1.25rem;
    position: fixed;
    right: 15%;
    bottom: 5%;
  }
  .btn-outline-info:hover {
    background-color: #42b983 !important;
    border-color: #42b983;
    animation: btnToLeft .5s ease-in;
  }
</style>
