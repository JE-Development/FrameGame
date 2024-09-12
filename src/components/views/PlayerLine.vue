<style>

.name-line{
  margin-left: 5px;
  margin-right: 5px;
  display: inline-block;
  background-color: rgb(224, 224, 224);
  border-radius: 100px;
  margin-bottom: 10px;
}

.line-selected{
  background-color: rgb(155, 255, 130);
}

</style>

<template>

<div class="center-horizontal name-line" :class="selected ? 'line-selected' : ''">
  <div class="center">
    <img :src="pb" class="pb" style="width: 30px" />
  <h2 style="margin-top: 0px; margin-bottom: 0px; margin-left: 10px; margin-right: 10px;" class="black">{{ name }}</h2>
  </div>
</div>

</template>


<script>
export default {
    name: "PlayerLine",
    data() {
        return {
          pb: ""
        };
    },

    props:{
      selected: Boolean,
      name: String,
      img: String
    },

  created() {

    },
    mounted() {
      this.pb = "../../src/assets/pb/" + this.img + ".png"
    },
    methods: {


        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>