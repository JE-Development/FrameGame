<template>

  <div class="layer-size">
    <div class="layer-background parent-size round-corner scroll" v-if="!hidden">
      <LayerElement
          v-for="(dat) in images"
          :img="dat.img"
          @up="onUp(dat.index)"
          @down="onDown(dat.index)"
      />
    </div>
  </div>

</template>


<script>

import LayerElement from "@/components/views/LayerElement.vue";
import {nextTick} from "vue";

export default {
    name: "LayerEditor",
  components: {LayerElement},
    data() {
        return {
          images: [],
          hidden: false
        };
    },

    props:{
      sampler: Boolean,
      layers: Array
    },

    created() {

    },

    mounted() {
      this.hidden = this.sampler
      this.images = []
      for(let i = 0; i < this.layers.length; i++){
        let dat = {
          img: this.layers[i],
          index: i
        }
        this.images.push(dat)
      }
      this.images = this.images.reverse()
    },

  methods: {

      onUp(index){
        this.$emit("up", index)
      },

      onDown(index){
        this.$emit("down", index)
      },


        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>