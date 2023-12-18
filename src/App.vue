<script>

import MainPage from "@/components/MainPage.vue";

export default {
  //npm run dev | npm run build
  name: "App",
  components: {MainPage, WebSocket},

  created() {
  },

  mounted() {

  },
  data() {
    return {
    }
  },

  updated() {
  },

  methods: {


  }
}
</script>

<template>
  <notifications />

  <main>
      <router-view />
  </main>
</template>

<style scoped>
</style>
