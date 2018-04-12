<template>
<div class="dropbox">
  <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="input-file">
  <p v-if="isInitial">
    Drag your file(s) here to begin<br> or click to browse
  </p>
  <p v-if="isSaving">
    Uploading {{ fileCount }} files...
  </p>
</div>
</template>

<script>
	export default {
		name: "showcase",
    data () {
		  return {
		    fullScreen: false
      }
    },
    methods: {
		  clickToFullScreen () {
		    let vm = this
        vm.fullScreen = true
      }
    }
	}
</script>

<style scoped>
  .fullScreen {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 50%;
    top: 50%;
    margin: auto
  }
</style>
