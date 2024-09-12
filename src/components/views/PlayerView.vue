<template>

  <div class="player-card center-horizontal" :class="selected ? 'player-card-selected' : ''">
    <div class="center">
      <div>
        <div class="center-horizontal">
          <img :src="pb" class="pb" style="width: 50px" v-if="!isSad" />
        </div>
        <div class="center-horizontal">
          <h3 class="white">{{ name }}</h3>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
export default {
  name: "PlayerView",
  data() {
    return {
      pb: ""
    };
  },

  props: {
    name: String,
    img: String,
    selected: Boolean
  },

  created() {

  },
  mounted() {
    this.pb = "../../src/assets/pb/" + this.img + ".png"
  },
  methods: {


    getCookies(key) {
      return this.$cookies.get(key);
    },
    setCookies(key, value) {
      return this.$cookies.set(key, value, 2147483647);
    },
  }
}
</script>