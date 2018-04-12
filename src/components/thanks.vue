<template>
  <b-container>
    <div class="square-block">
      <h1>感謝，一日順心。</h1>
    </div>
  </b-container>
</template>

<script>
  export default {
    name: "thanks"
  }
</script>

<style scoped>
  .square-block {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 5rem;
    width: 60%;
    transform: translate(-50%,-50%);
    background-color: #000;
  }
  h1 {
    margin-top: 5rem;
  }
</style>
