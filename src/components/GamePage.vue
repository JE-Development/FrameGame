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
      <div class="center-horizontal">
        <UIButton :title="lang.game.searchImagesButton" @click="onClickSearch" color="prim-color-background"/>
      </div>
      <div style="width: 20px"></div>
      <div class="center-horizontal">
        <UIButton :title="lang.game.addTextButton" @click="onTextClicked" color="prim-color-background"/>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="center-horizontal">
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
export default {
    name: "GamePage",
  components: {AddTextPopup, ImageSearchPopup, UIButton},
    data() {
        return {
          lang: langEN,
          mode: 1,
          selfReady: false,
          showISP: false,
          stageConfig: {
            width: 800,
            height: 600,
          },
          //addedImages: ["https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg", "https://image.capital.de/33433586/t/8s/v1/w1440/r1.3333/-/tiny-house-manufaktur.jpg"],
          addedImages: [],
          reloadCanvas: true,
          loadedImages: [],
          imageTransform: [],
          textTransform: [],
          imageSize: [],
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
          einmal: true
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
          }
        });

    },

    methods: {

      onClickFinish(){
        this.selfReady = true
        let dat = {
          type: "engine",
          func: "readyPrompt",
          args: [this.$refs.prompt, this.getCookies("username")]
        }
        this.send(dat)
      },

      loadSliderSettings(){
        if(this.einmal){
          this.einmal = false
          this.listening = false
          nextTick(() => {
            this.$refs.sliderw.setValue(this.sliderMaxw/2)
            this.$refs.sliderh.setValue(this.sliderMaxh/2)
            this.$refs.sliders.setValue(this.sliderMaxs/2)
            this.$refs.sliderr.setValue(this.sliderMaxr/2)
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

      imageClicked(img){
        this.addedImages.push(img)
        this.showISP = false
        this.reloadCanvas = false
        nextTick().then(() =>{
          this.reloadCanvas = true
        })
        this.loadImages()
      },

      onClickTransform(){
        this.imageTransform[this.selectedImageIndex].width += 50
        this.imageTransform[this.selectedImageIndex].height += 50
        this.reloadCanvas = false
        nextTick().then(() =>{
          this.reloadCanvas = true
        })
        this.loadImages()
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

      },

      onSetDefault(){
        if(this.supportText){
          this.valW = this.imageTransform[this.selectedImageIndex].width
          this.valH = this.imageTransform[this.selectedImageIndex].height
          this.valR = this.imageTransform[this.selectedImageIndex].rotation
        }
        this.valT = this.textList[this.selectedTextIndex].fontSize
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
              let val = value - (this.sliderMaxw / 2)
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

      closeText(){
        this.showTextPopup = false
      },

      addedText(text){
        let dat = {
          text: text,
          fontSize: this.valT
        }
        this.textList.push(dat)
        this.reloadCanvas = false
        nextTick().then(() =>{
          this.reloadCanvas = true
        })
        this.loadImages()
        this.closeText()
      },

      onTextClicked(){
        this.showTextPopup = true
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