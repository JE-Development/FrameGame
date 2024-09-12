

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
                      @keyup.enter="addTextClicked"
                      ref="text"
                      :placeholder="lang.game.addTextPlaceholder"
                      class="google-search-input shadow"/>
                </div>

                <div style="height: 20px"></div>

                <div class="center-horizontal">
                  <UIButton :title="lang.game.addButton" @click="addTextClicked" color="prim-color-background"/>
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
  name: "AddTextPopup",
  components: {UIButton},

  props: {
    show: Boolean,
  },
  data(){
    return{
      lang: langEN,
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

    addTextClicked(){
      this.$emit("text", this.$refs.text.value)
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