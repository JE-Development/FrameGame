<template>
  <div class="reveal-canvas relative" v-if="prompt === undefined">
    <div v-for="(imageUrl, index) in loadedImages">
      <img class="absolute" :class="'target' + index" :src="imageUrl" :style="{ transform: imageConfig[index] }" />
    </div>
    <div v-for="(text, index) in textList">
      <div class="absolute" :class="'targettext' + index" style="display: inline-block; font-size: 50px;"
        :style="{ transform: textTransform[index] }">{{ text.text }}
      </div>
    </div>
  </div>
  <div class="center white-background" style="width: 800px;" v-else>
    <h2 class="text-center black" style="margin-top: 5px; margin-bottom: 5px">{{ prompt }}</h2>
    </div>
</template>



<script>

import langDE from "../../assets/langDE.json"
import langEN from "../../assets/langEN.json"

export default {
  name: "CanvasView",
  components: {},

  props: {
    stageConfig: Object,
    loadedImages: Array,
    imageConfig: Object,
    textList: Array,
    textTransform: Array,
    prompt: String,
    loadedIndex: String
  },
  data() {
    return {
      sortedLoaded: []
    }
  },


  created() {

  },

  mounted() {
    this.sortedLoaded = this.loadedImages
    this.showContent()
  },

  methods: {

    showContent() {
      console.log("stageConfig", this.stageConfig)
      console.log("loadedImages", this.loadedImages)
      console.log("imageConfig", this.imageConfig)
      console.log("textList", this.textList)
      console.log("textTransform", this.textTransform)
    },

    getCookies(key) {
      return this.$cookies.get(key);
    },
    setCookies(key, value) {
      return this.$cookies.set(key, value, 2147483647);
    },
  },

}
</script>

<style>
.modal-mask-saved {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper-saved {
  display: table-cell;
}

.modal-container-saved {
  display: block;
  margin: 0px auto;
  padding: 5px 5px;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}


@media (max-width: 740px) {
  /*
  .modal-container-saved{
    width: 90vw;
  }*/

}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}


.modal-enter-from .modal-container-saved,
.modal-leave-to .modal-container-saved {
  opacity: 0;
}
</style>