

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask-saved">
      <div class="modal-wrapper-saved">
        <div>
          <div style="justify-content: center">
            <div class="center-horizontal" style="margin-top: 20px">
              <div>


                <div style="height: 20px"></div>

                <div class="center-horizontal">
                  <UIButton :title="lang.misc.closeButton" @click="onClose" color="fourth-color-background"/>
                </div>

                <div style="height: 20px"></div>

                <div class="center-horizontal">
                  <input
                      @keyup.enter="onSearch"
                      ref="search"
                      :placeholder="lang.game.imageSearchPlaceholder"
                      class="google-search-input shadow texture"/>
                </div>

                <div class="center-horizontal">
                  <p class="white">{{lang.misc.searchLangInfo}}</p>
                </div>


                <div class="center-horizontal">
                  <UIButton :title="lang.game.searchButton" @click="onSearch" color="prim-color-background"/>
                </div>

                <div class="center-horizontal" v-if="inSearch">
                  <div>
                    <div style="height: 150px"></div>
                    <img src="../../assets/loading.gif" style="width: 100px; height: 100px"/>
                  </div>
                </div>

                <div class="scroll grid">
                  <img
                      v-for="(dat) in images"
                      :src="dat"
                      class="search-image pointer"
                      @click="imageClicked(dat)"
                    />
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>



<script>

import UIButton from "@/components/views/UIButton.vue";
import langDE from "../../assets/langDE.json"
import langEN from "../../assets/langEN.json"
import {HttpRequest} from "../code/HttpRequest";

export default {
  name: "ImageSearchPopup",
  components: {UIButton},

  props: {
    show: Boolean,
  },
  data(){
    return{
      lang: langEN,
      images: [],
      inSearch: false
    }
  },


  created() {

  },

  mounted() {
    if(this.getCookies("lang") === null || this.getCookies("lang") === "en"){
      this.lang = langEN
    }else{
      this.lang = langDE
    }
  },

  methods: {
    onClose(){
      this.$emit("close")
    },


    async onSearch(){
      this.inSearch = true
      this.images = []
      let http = new HttpRequest()
      /*for(let i = 0; i < 5; i++){
        let json = await http.httpRequest("https://www.googleapis.com/customsearch/v1?q=" + this.$refs.search.value + "&key=AIzaSyBsIIXPf7H7s9ctuwQAimiAbvueJnRS-IA&cx=c2a9783feea9c40f5&searchType=image&start=" + i*10)

        for(let i = 0; i < json.items.length; i++){
          this.images.push(json.items[i])
        }
      }*/
      let img1 = await this.oscoboImageSearch()
      let img2 = await this.pngWingSearch()
      let img3 = await this.pngimgSearch()
      let img4 = await this.pngfreSearch()
      this.sorting(img1, img2, img3, img4)
      this.inSearch = false
    },


    async oscoboImageSearch(){
      let imgs = []
      let html = await fetch("https://intercra-backend.jason-apps.workers.dev/html/data/oscobo_image/" + this.$refs.search.value);
      let text = await html.text();
      const parser = new DOMParser();
      const document = parser.parseFromString(text, "text/html");
      const content = document.getElementsByClassName("item");

      for(let i = 0; i < content.length; i++){
        const elem = content[i];
        const image = elem.getElementsByTagName("img")[0];
        let imgUrl = image.getAttribute("src")
        imgs.push(imgUrl)
      }
      return imgs
    },

    async pngWingSearch(){
      let imgs = []
      let html = await fetch("https://intercra-backend.jason-apps.workers.dev/html/data/pngwing/" + this.$refs.search.value)
      let text = await html.text();
      const parser = new DOMParser();
      const document = parser.parseFromString(text, "text/html");

      const content = document.getElementsByTagName("li");

      for(let i = 0; i < content.length; i++){
        const elem = content[i];
        if(elem.getAttribute("itemprop") === "associatedMedia"){

          const image = elem.getElementsByTagName("img")[0];
          let imgUrl = image.getAttribute("data-src")
          imgs.push(imgUrl)
        }
      }
      return imgs
    },

    async pngimgSearch(){
      let imgs = []
      let html = await fetch("https://intercra-backend.jason-apps.workers.dev/html/data/pngimg/" + this.$refs.search.value)
      let text = await html.text();
      const parser = new DOMParser();
      const document = parser.parseFromString(text, "text/html");

      const content = document.getElementsByClassName("png_png");

      for(let i = 0; i < content.length; i++){
        const elem = content[i];
        const image = elem.getElementsByTagName("img")[0];
        let imgUrl = image.getAttribute("src")
        imgs.push(imgUrl)
      }
      return imgs
    },

    async pngfreSearch(){
      let imgs = []
      let html = await fetch("https://intercra-backend.jason-apps.workers.dev/html/data/pngfre/" + this.$refs.search.value)
      let text = await html.text();
      const parser = new DOMParser();
      const document = parser.parseFromString(text, "text/html");

      const content = document.getElementsByTagName("figure");

      for(let i = 0; i < content.length; i++){
        const elem = content[i];
        const image = elem.getElementsByTagName("img")[0];
        let imgUrl = image.getAttribute("src")
        imgs.push(imgUrl)
      }
      return imgs
    },

    sorting(img1, img2, img3, img4){
      const resultArray = [];

      const maxLength = Math.max(Math.max(Math.max(img1.length, img2.length), img3.length), img4.length);

      for (let i = 0; i < maxLength; i++) {
        if (i < img1.length) {
          resultArray.push(img1[i]);
        }
        if (i < img2.length) {
          resultArray.push(img2[i]);
        }
        if (i < img3.length) {
          resultArray.push(img3[i]);
        }
        if (i < img4.length) {
          resultArray.push(img3[i]);
        }
      }
      this.images = resultArray
    },

    imageClicked(img){
      this.$emit("img", img)
    },


    getCookies(key){
      return this.$cookies.get(key);
    },
    setCookies(key, value){
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