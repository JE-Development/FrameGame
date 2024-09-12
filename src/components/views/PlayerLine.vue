<style>

.name-line{
  width: 200px;
  background-color: rgb(224, 224, 224);
  border-bottom-left-radius: 100px;
  border-top-left-radius: 100px;
  margin-bottom: 10px;
}

.line-selected{
  background-color: white;
}

</style>

<template>

<div class="center-horizontal name-line" :class="selected ? 'line-selected' : ''">
  <h2 style="margin-top: 0px; margin-bottom: 0px;" class="black">{{ name }}</h2>
</div>

</template>


<script>
export default {
    name: "PlayerLine",
    data() {
        return {
        };
    },

    props:{
      selected: Boolean,
      name: String
    },

  created() {

    },
    mounted() {
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