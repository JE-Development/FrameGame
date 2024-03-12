<template>

  <ImageSearchPopup :show="showISP" @close="closeISP"  @img="imageClicked"/>
  <AddTextPopup :show="showTextPopup" @close="closeText"  @text="addedText"/>

  <div v-if="mode === 0">
    <div class="center full-size">
      <div style="margin-bottom: 100px">
        <input
            ref="prompt"
            :placeholder="lang.game.createPromptPlaceholder"
            class="prompt-input shadow texture"/>
        <div style="height: 20px"></div>
        <div class="center-horizontal" v-if="!selfReady">
          <UIButton :title="lang.game.finishedPromptButton" @click="onClickFinish" color="prim-color-background"/>
        </div>
        <div class="center-horizontal" v-else>
          <h2>Warte bis alle Spieler bereit sind</h2>
        </div>
      </div>
    </div>
  </div>

  <div v-if="mode === 1">
    <div class="center-horizontal">
      <div :style="'width: ' + 100*progressMultiply + 'px; height: 10px'">
        <div :style="'width: ' + 100 * progressMultiply + 'px; height: 10px; background: #eeeeee'" class="absolute"></div>
        <div :style="'width: ' + progress * progressMultiply + 'px; height: 10px; background: #42b983'" class="absolute"></div>
      </div>
    </div>
    <div class="center-horizontal">
      <div class="to-draw-text round-corner">{{drawText}}</div>
    </div>
    <div v-if="!selfReady">
      <div class="center-horizontal">
        <UIButton :title="lang.game.finishedPromptButton" @click="onClickFinishImage" color="line1"/>
      </div>
      <div style="height: 20px"></div>
      <div class="center-horizontal">
        <div class="center-horizontal">
          <UIButton :title="lang.game.searchImagesButton" @click="onClickSearch" color="prim-color-background"/>
        </div>
        <div style="width: 20px"></div>
        <div class="center-horizontal">
          <UIButton :title="lang.game.addTextButton" @click="onTextClicked" color="prim-color-background"/>
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="center-horizontal" v-if="canvasRender">
      <LayerEditor :sampler="true" :layers="addedImages"/>
      <div style="width: 200px"></div>
      <div class="canvas" v-if="reloadCanvas">
        <v-stage :config="stageConfig" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" ref="stage">
          <v-layer>
            <v-image v-for="(imageUrl, index) in loadedImages" :key="index" :image="imageUrl" :config="imageConfig(index)" v-model="imageTransform[index]" @click="onImage(index)"/>
            <v-text
                v-for="(text, index) in textList"
                :config="{
            text: text.text,
            x: this.textTransform[index] === undefined ? 50 : this.textTransform[index].x,
          y: this.textTransform[index] === undefined ? 50 : this.textTransform[index].y,
            draggable: true,
            fill: 'black',
            fontSize: text.fontSize,
            onDragMove: (event) => {
              this.onText(index)
            this.textTransform[index] = {
              x: event.target.x(),
              y: event.target.y(),
            };
          },
          }"
                @click="onText(index)"
                v-model="textTransform[index]"
            />
          </v-layer>
        </v-stage>
      </div>
      <div style="width: 200px"></div>
      <LayerEditor :sampler="false" @up="onUp" @down="onDown" @delete="onDelete" :layers="addedImages" v-if="layerRender"/>
    </div>
    <div style="height: 20px"></div>
    <div class="center-horizontal" v-if="selectedImageIndex !== -1 || selectedTextIndex !== -1">
      <div class="slider" v-if="supportText">
        <div class="center-horizontal">
          <h2 class="white">{{lang.game.transformWidth}}</h2>
        </div>
        <vue-slider
            duration="0.2"
            :max="sliderMaxw"
            :min="0"
            ref="sliderw"
            @drag-start="dragStart"
            @drag-end="dragEnd"
            @click="dragEnd"
            @change="dragChangew"
            tooltip="none"
            :process-style="{ backgroundColor: '#00ff00' }"></vue-slider>
      </div>
      <div style="width: 20px"></div>
      <div class="slider" v-if="supportText">
        <div class="center-horizontal">
          <h2 class="white">{{lang.game.transformHeight}}</h2>
        </div>
        <vue-slider
            duration="0.2"
            :max="sliderMaxh"
            :min="0"
            ref="sliderh"
            @drag-start="dragStart"
            @drag-end="dragEnd"
            @click="dragEnd"
            @change="dragChangeh"
            tooltip="none"
            :process-style="{ backgroundColor: '#00ff00' }"></vue-slider>
      </div>
      <div style="width: 20px"></div>
      <div class="slider">
        <div class="center-horizontal">
          <h2 class="white">{{lang.game.transformSize}}</h2>
        </div>
        <vue-slider
            duration="0.2"
            :max="sliderMaxs"
            :min="0"
            ref="sliders"
            @drag-start="dragStart"
            @drag-end="dragEnd"
            @click="dragEnd"
            @change="dragChanges"
            tooltip="none"
            :process-style="{ backgroundColor: '#00ff00' }"></vue-slider>
        <div style="height: 10px"></div>
        <div class="center-horizontal">
          <button class="layer-button center-horizontal" @click="onTextDelete" v-if="!supportText">
            <img src="../assets/trash.png" class="layer-trash-image">
          </button>
        </div>
      </div>
      <div style="width: 20px"></div>
      <div class="slider" v-if="supportText">
        <div class="center-horizontal">
          <h2 class="white">{{lang.game.transformRotation}}</h2>
        </div>
        <vue-slider
            duration="0.2"
            :max="sliderMaxr"
            :min="0"
            ref="sliderr"
            @drag-start="dragStart"
            @drag-end="dragEnd"
            @click="dragEnd"
            @change="dragChanger"
            tooltip="none"
            :process-style="{ backgroundColor: '#00ff00' }"></vue-slider>
      </div>
    </div>
  </div>

  <div v-if="mode === 2">
    <div class="center-horizontal" v-if="canvasRender">
      <div class="canvas" v-if="reloadCanvas">
        <v-stage :config="stageConfig" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" ref="stage">
          <v-layer>
            <v-image v-for="(imageUrl, index) in loadedImages" :key="index" :image="imageUrl" :config="imageConfigForView(index)" v-model="imageTransform[index]" @click="onImage(index)"/>
            <v-text
                v-for="(text, index) in textList"
                :config="{
            text: text.text,
            x: this.textTransform[index] === undefined ? 50 : this.textTransform[index].x,
          y: this.textTransform[index] === undefined ? 50 : this.textTransform[index].y,
            draggable: false,
            fill: 'black',
            fontSize: text.fontSize,
            onDragMove: (event) => {
              this.onText(index)
            this.textTransform[index] = {
              x: event.target.x(),
              y: event.target.y(),
            };
          },
          }"
                @click="onText(index)"
                v-model="textTransform[index]"
            />
          </v-layer>
        </v-stage>
      </div>
    </div>
    <div class="center-horizontal">
      <div>
        <div style="height: 20px"></div>
        <input
            ref="promptRating"
            :placeholder="lang.game.createPromptPlaceholder"
            class="prompt-input shadow texture"/>
        <div style="height: 20px"></div>
        <div class="center-horizontal" v-if="!selfReady">
          <UIButton :title="lang.game.finishedPromptButton" @click="onClickFinishRating" color="prim-color-background"/>
        </div>
        <div class="center-horizontal" v-else>
          <h2>Warte bis alle Spieler bereit sind</h2>
        </div>
      </div>
    </div>
  </div>

</template>


<script>

import ProfilePopup from "@/components/views/ProfilePopup.vue";
import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"
import LangSelection from "@/components/views/LangSelection.vue";
import UIButton from "@/components/views/UIButton.vue";
import ImageSearchPopup from "@/components/views/ImageSearchPopup.vue";
import {nextTick} from "vue";
import AddTextPopup from "@/components/views/AddTextPopup.vue";
import LayerEditor from "@/components/views/LayerEditor.vue";
import {HttpRequest} from "@/components/code/HttpRequest";


export default {
    name: "GamePage",
  components: {LayerEditor, AddTextPopup, ImageSearchPopup, UIButton},
    data() {
        return {
          lang: langEN,
          mode: 0,
          selfReady: false,
          showISP: false,
          stageConfig: {
            width: 800,
            height: 600,
          },
          addedImages: [],
          reloadCanvas: true,
          loadedImages: [],
          imageTransform: [],
          textTransform: [],
          selectedImageIndex: -1,
          selectedTextIndex: -1,
          sliderMaxw: 200,
          sliderMaxh: 200,
          sliderMaxs: 200,
          sliderMaxr: 200,
          valW: 0,
          valH: 0,
          valR: 0,
          valT: 50,
          listening: true,
          linePoints: [],
          lineColor: 'black',
          lineWidth: 5,
          backgroundColor: 'black',
          drawingMode: false,
          showTextPopup: false,
          textList: [],
          supportText: true,
          einmal: true,
          layerRender: true,
          canvasRender: true,
          progressMultiply: 5,
          progress: 0,
          progressTime: 1000,
          drawText: ""
        };
    },

    created() {
    },

    beforeUnmount() {
        window.removeEventListener('beforeunload', this.eventClose);
    },


    unmounted() {
        this.socket.close()
    },

    mounted() {
      this.increaseProgress()

      //this.loadImage(this.image, this.imageConfig);
      this.loadImages()

      if(this.getCookies("lang") === null || this.getCookies("lang") === "en"){
        this.lang = langEN
      }else{
        this.lang = langDE
      }

        window.addEventListener('beforeunload', this.eventClose);

        this.socket = new WebSocket(import.meta.env.VITE_SERVER_URL);

        this.socket.addEventListener('open', (event) => {
          this.unableMessage = ""

          let dat = {
            type: "register",
            func: "replaceClient",
            player: this.getCookies("username"),
            rc: this.getCookies("rc")
          };
          this.send(dat);

        });

      this.socket.addEventListener('error', (event) => {
        this.unableMessage = this.lang.register.serverDown

      });


        this.socket.addEventListener('message', (event) => {

          const message = JSON.parse(event.data)

          console.log(message)
          if(message.func === "error"){
            console.error(message.text)
          }else if(message.func === "ready"){
            this.mode = 1
            this.selfReady = false
          }else if(message.func === "readyImage"){
            this.mode = 2
            this.selfReady = false
          }else if(message.func === "base64"){
            let b64 = message.base
            let http = new HttpRequest()
            http.httpRequestPost("http://jasonbackend.de:8000/upload", "image", b64).then((json) => {
              console.log(json)
            })
          }else if(message.func === "dataForPrompt"){
            if(message.toPlayer === this.getCookies("username")){
              this.selfReady = false
              this.canvasRender = false
              let canvas = message.playerData
              this.addedImages = canvas.images
              this.imageTransform = canvas.imageTransform
              this.textList = canvas.text
              this.textTransform = canvas.textTransform
              this.loadedImages = []
              for(let i = 0; i < this.addedImages.length; i++){
                this.loadedImages.push(null)
              }
              nextTick(() => {
                this.canvasRender = true
                this.loadImages()
              })
            }
          }else if(message.func === "dataForImage"){
            if(message.toPlayer === this.getCookies("username")){
              this.drawText = message.playerData
            }
          }
        });

    },

    methods: {

      onClickFinish(){
        this.selfReady = true
        let dat = {
          type: "engine",
          func: "readyPrompt",
          args: [this.$refs.prompt.value, this.getCookies("username")]
        }
        this.send(dat)
      },

      onClickFinishRating(){
        this.selfReady = true
        let dat = {
          type: "engine",
          func: "readyPrompt",
          args: [this.$refs.promptRating.value, this.getCookies("username")]
        }
        this.send(dat)
      },

      onClickFinishImage(){
        this.selfReady = true
        let dat = {
          type: "engine",
          func: "readyImage",
          args: [this.getCookies("username"), {
            images: this.addedImages,
            imageTransform: this.imageTransform,
            text: this.textList,
            textTransform: this.textTransform
          }]
        }
        this.send(dat)
      },

      loadSliderSettings(){
        if(this.einmal){
          this.einmal = false
          this.listening = false
          nextTick(() => {
            if(this.supportText){
              this.$refs.sliderw.setValue(this.sliderMaxw/2)
              this.$refs.sliderh.setValue(this.sliderMaxh/2)
              this.$refs.sliderr.setValue(this.sliderMaxr/2)
            }
            this.$refs.sliders.setValue(this.sliderMaxs/2)
            this.listening = true
          })
        }
      },

      closeISP(){
        this.showISP = false
      },

      onClickSearch(){
        this.showISP = true
      },



      imageConfig(index) {
        if(this.imageTransform[index] === undefined){
          this.imageTransform[index] = {
            width: 200,
            height: 200,
            rotation: 0,
          };
        }
        return {
          x: this.imageTransform[index] === undefined ? 100 : this.imageTransform[index].x,
          y: this.imageTransform[index] === undefined ? 100 : this.imageTransform[index].y,
          width: this.imageTransform[index].width,
          height: this.imageTransform[index].height,
          rotation: this.imageTransform[index].rotation,
          draggable: true,
          onDragMove: (event) => {
            this.onImage(index)
            this.imageTransform[index] = {
              x: event.target.x(),
              y: event.target.y(),
              width: this.imageTransform[index].width,
              height: this.imageTransform[index].height,
              rotation: this.imageTransform[index].rotation
            };
          },
        };
      },

      imageConfigForView(index) {
        if(this.imageTransform[index] === undefined){
          this.imageTransform[index] = {
            width: 200,
            height: 200,
            rotation: 0,
          };
        }
        return {
          x: this.imageTransform[index] === undefined ? 100 : this.imageTransform[index].x,
          y: this.imageTransform[index] === undefined ? 100 : this.imageTransform[index].y,
          width: this.imageTransform[index].width,
          height: this.imageTransform[index].height,
          rotation: this.imageTransform[index].rotation,
          draggable: false,
          onDragMove: (event) => {
            this.onImage(index)
            this.imageTransform[index] = {
              x: event.target.x(),
              y: event.target.y(),
              width: this.imageTransform[index].width,
              height: this.imageTransform[index].height,
              rotation: this.imageTransform[index].rotation
            };
          },
        };
      },

      increaseProgress(){
        if(this.progress < 100){
          this.progress++
          setTimeout(() => {
            this.increaseProgress()
          }, this.progressTime
          )
        }else{
          this.selfReady = true
        }
      },



      handleMouseDown() {

      },
      handleMouseMove() {

      },
      handleMouseUp() {

      },

      loadImages() {
        // Iteriere durch die Bild-URLs und lade jedes Bild
        this.addedImages.forEach((imageUrl, index) => {
          const img = new Image();
          img.onload = () => {
            // Füge das vollständig geladene Bild zum Array hinzu
            this.loadedImages[index] = img;
            // Überprüfe, ob alle Bilder geladen sind, bevor du mit dem Zeichnen beginnst
            if (this.loadedImages.length === this.addedImages.length) {
              //this.drawImages();
            }
          };
          img.src = imageUrl;
        });
      },

      onUp(index){
        if(index !== this.addedImages.length-1){
          let ui = index++
          this.changeIndex(index, ui)
        }
      },

      onDown(index){
        if(index !== 0){
          let oi = index--
          this.changeIndex(index, oi)
        }
      },

      onDelete(index){
        this.addedImages = this.deleteIndex(this.addedImages, index)
        this.loadedImages = this.deleteIndex(this.loadedImages, index)
        this.imageTransform = this.deleteIndex(this.imageTransform, index)

        this.canvasRender = false
        nextTick(() => {
          this.canvasRender = true
        })

        this.layerRender = false
        nextTick(() => {
          this.layerRender = true
        })
      },

      onTextDelete(){
        let index = this.selectedTextIndex
        this.textList = this.deleteIndex(this.textList, index)
        this.textTransform = this.deleteIndex(this.textTransform, index)

        this.canvasRender = false
        nextTick(() => {
          this.canvasRender = true
        })

        this.layerRender = false
        nextTick(() => {
          this.layerRender = true
        })
      },


      deleteIndex(array, index){
        let updated = []
        for(let i = 0; i < array.length; i++){
          if(i !== index){
            updated.push(array[i])
          }
        }
        return updated
      },

      imageClicked(img){
        this.addedImages.push(img)
        this.selectedImageIndex = this.addedImages.length -1
        this.showISP = false
        this.reloadCanvas = false
        nextTick().then(() =>{
          this.reloadCanvas = true
        })
        this.loadImages()
        this.onSetDefault()

        this.layerRender = false
        nextTick(() => {
          this.layerRender = true
        })
      },

      onImage(index){
        this.selectedImageIndex = index;
        this.selectedTextIndex = -1;
        this.supportText = true
        this.loadSliderSettings()
      },

      onText(index){
        this.selectedTextIndex = index;
        this.selectedImageIndex = -1;
        this.supportText = false
        this.loadSliderSettings()
      },

      dragStart(){
        this.onSetDefault()
      },

      onSetDefault(){
        if(this.supportText){
          this.valW = this.imageTransform[this.selectedImageIndex] === undefined ? 200 : this.imageTransform[this.selectedImageIndex].width
          this.valH = this.imageTransform[this.selectedImageIndex] === undefined ? 200 : this.imageTransform[this.selectedImageIndex].height
          this.valR = this.imageTransform[this.selectedImageIndex] === undefined ? 200 : this.imageTransform[this.selectedImageIndex].rotation
        }else{
          this.valT = this.textList[this.selectedTextIndex] === undefined ? 200 : this.textList[this.selectedTextIndex].fontSize
        }
      },

      dragEnd(){
        this.listening = false
        if(this.supportText){
          this.$refs.sliderw.setValue(this.sliderMaxw/2)
          this.$refs.sliderh.setValue(this.sliderMaxh/2)
          this.$refs.sliders.setValue(this.sliderMaxs/2)
          this.$refs.sliderr.setValue(this.sliderMaxr/2)
        }else{
          this.$refs.sliders.setValue(this.sliderMaxs/2)
        }
        this.listening = true
        this.onSetDefault()
      },

      dragChangew(value){
        if(this.listening && this.selectedImageIndex !== -1){
          if(this.imageTransform[this.selectedImageIndex] !== undefined){
            let val = value - (this.sliderMaxw / 2)
            this.imageTransform[this.selectedImageIndex].width = val + this.valW
            this.reloadCanvas = false
            nextTick().then(() =>{
              this.reloadCanvas = true
            })
            this.loadImages()
          }
        }
      },

      dragChangeh(value){
        if(this.listening && this.selectedImageIndex !== -1){
          if(this.imageTransform[this.selectedImageIndex] !== undefined){
            let val = value - (this.sliderMaxh / 2)
            this.imageTransform[this.selectedImageIndex].height = val + this.valH
            this.reloadCanvas = false
            nextTick().then(() =>{
              this.reloadCanvas = true
            })
            this.loadImages()
          }
        }
      },

      dragChanges(value){
        if(this.listening){
          if(this.selectedImageIndex !== -1){
            if(this.imageTransform[this.selectedImageIndex] !== undefined){
              let val = value - (this.sliderMaxw / 2)
              this.imageTransform[this.selectedImageIndex].width = val + this.valW
              this.imageTransform[this.selectedImageIndex].height = val + this.valH
              this.reloadCanvas = false
              nextTick().then(() =>{
                this.reloadCanvas = true
              })
              this.loadImages()
            }
          }else{
            if(this.textList[this.selectedTextIndex] !== undefined){
              let val = value - (this.sliderMaxs / 2)
              this.textList[this.selectedTextIndex].fontSize = val + this.valT
              this.reloadCanvas = false
              nextTick().then(() =>{
                this.reloadCanvas = true
              })
              this.loadImages()
            }
          }
        }
      },

      dragChanger(value){
        if(this.listening && this.selectedImageIndex !== -1){
          if(this.imageTransform[this.selectedImageIndex] !== undefined){
            let val = value - (this.sliderMaxr / 2)
            this.imageTransform[this.selectedImageIndex].rotation = val + this.valR
            this.reloadCanvas = false
            nextTick().then(() =>{
              this.reloadCanvas = true
            })
            this.loadImages()
          }
        }
      },

      getImageAsBase64() {

        let data = {
          type: "util",
          func: "imageToBase64",
          args: [this.addedImages[this.selectedImageIndex]]
        }
        this.send(data)

        /*
        const imageUrl = this.loadedImages[this.selectedImageIndex]

        this.imageToBase64(imageUrl)
            .then((base64) => {
              let http = new HttpRequest()
              let b64 = String(base64).split(",")[1]
              console.log(b64)
              http.httpRequestPost("http://jasonbackend.de:8000/upload", "image", b64)
            })
            .catch((error) => {
              console.error('Error loading image:', error);
            });*/
      },

      imageToBase64(url) {
        return new Promise((resolve, reject) => {
          // Lade das Bild in einen Blob
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
              resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
          };
          xhr.onerror = reject;
          xhr.responseType = 'blob';
          xhr.open('GET', url);
          xhr.send();
        });
      },

      closeText(){
        this.showTextPopup = false
      },

      addedText(text){
        let dat = {
          text: text,
          fontSize: this.valT
        }
        this.textList.push(dat)
        this.selectedTextIndex = this.addedImages.length -1
        this.reloadCanvas = false
        nextTick().then(() =>{
          this.reloadCanvas = true
        })
        this.loadImages()
        this.closeText()
        this.onSetDefault()

        this.layerRender = false
        nextTick(() => {
          this.layerRender = true
        })
      },

      onTextClicked(){
        this.showTextPopup = true
      },


      changeIndex(indexA, indexB) {
        this.addedImages = this.indexCustomChange(this.addedImages, indexA, indexB)
        this.loadedImages = this.indexCustomChange(this.loadedImages, indexA, indexB)
        this.imageTransform = this.indexCustomChange(this.imageTransform, indexA, indexB)

        this.canvasRender = false
        nextTick(() => {
          this.canvasRender = true
        })

        this.layerRender = false
        nextTick(() => {
          this.layerRender = true
        })
      },

      indexCustomChange(array1, indexA, indexB) {
        let array = array1
        if (indexA < 0 || indexA >= array.length || indexB < 0 || indexB >= array.length) {
          console.log("invalid index")
          return;
        }
        let temp = array[indexA];
        array[indexA] = array[indexB];
        array[indexB] = temp;
        return array
      },




      send(data){
        data.rc = this.getCookies("rc")
        this.socket.send(JSON.stringify(data))
      },

        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },
        eventClose(){
            this.socket.close()
        },
    }
}
</script>

<style scoped>
.image-container {
  display: inline-block;
  margin: 10px;
}

.dragged-image {
  width: 150px;
  height: auto;
  border: 1px solid #ddd;
}

.progress-bar-container{
  width: 100%;
  position: fixed;
}
.progress-bar{
  height: 100%;
  background-color: #76ceff;
  transition: 0.1s ease;
}
.progress-bar--small{
  height: 5px;
}
.progress-bar--medium{
  height: 7px;
}
.progress-bar--big{
  height: 10px;
}
.progress-bar--rounded{
  border-radius: 5px;
}
</style>