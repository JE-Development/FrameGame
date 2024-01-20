<template>

  <div class="layer-element-base round-corner layer-element-margin">
    <div class="center-horizontal parent-height">
      <div class="parent-size layer-image-size">
        <img :src="img" class="layer-thumb"/>
      </div>
      <div class="parent-height">
        <div class="center-horizontal parent-height">
          <div class="parent-height center-vertical">
            <div>
              <button class="layer-button center-horizontal" @click="onUp">
                <img src="../../assets/up.png" class="layer-arrow-image">
              </button>

              <div style="height: 10px"></div>

              <button class="layer-button center-horizontal" @click="onDown">
                <img src="../../assets/down.png" class="layer-arrow-image">
              </button>
            </div>
          </div>
          <div class="parent-height center-vertical">
            <div>
              <button class="layer-button center-horizontal" @click="onDelete">
                <img src="../../assets/trash.png" class="layer-trash-image">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script>

export default {
    name: "LayerElement",
    data() {
        return {
        };
    },

    props:{
      img: String
    },

    created() {
    },

    mounted() {
    },


    methods: {

      onUp(){
        this.$emit("up")
      },

      onDown(){
        this.$emit("down")
      },

      onDelete(){
        this.$emit("delete")
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