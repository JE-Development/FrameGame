<style>
.corner-img {
  width: 100px;
  height: 100px;
}
</style>

<template>

  <div>
    <div class="full-size absolute on-bottom">
      <img src="../../assets/corner1.png" class="corner-img" />
    </div>
    <div class="full-size absolute on-bottom flex" style="justify-content: end;">
      <img src="../../assets/corner2.png" class="corner-img"/>
    </div>
    <div class="full-size absolute on-bottom flex" style="align-items: end; justify-content: end;">
      <img src="../../assets/corner3.png" class="corner-img" />
    </div>
    <div class="full-size absolute on-bottom flex" style="align-items: end;">
      <img src="../../assets/corner4.png" class="corner-img" />
    </div>
  </div>

</template>


<script>
export default {
  name: "BackgroundView",
  data() {
    return {
    };
  },

  props: {
  },

  created() {

  },
  mounted() {
  },
  methods: {

  }
}
</script>