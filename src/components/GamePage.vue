<template>

  <BackgroundView />

  <ImageSearchPopup :show="showISP" @close="closeISP" @img="imageClicked" />
  <AddTextPopup :show="showTextPopup" @close="closeText" @text="addedText" />

  <div class="center-horizontal" v-if="mode !== 3">
    <div style="width: 80%;">
      <PlayerLine v-for="dat in names" :name="dat.name" :img="dat.pb" :selected="dat.ready" />
    </div>
  </div>
  <div v-if="isHost && mode === 3">
    <div class="center-horizontal">
      <UIButton :title="lang.game.restartGame" @click="onClickRestart" color="line1" />
    </div>
  </div>

  <div v-if="mode === 0">
    <div class="center full-size">
      <div style="margin-bottom: 100px">
        <input ref="prompt" :placeholder="lang.game.createPromptPlaceholder" class="prompt-input shadow"
          @keyup.enter="onClickFinish" />
        <div style="height: 20px"></div>
        <div class="center-horizontal" v-if="!selfReady">
          <UIButton :title="lang.game.finishedPromptButton" @click="onClickFinish" color="prim-color-background" />
        </div>
        <div class="center-horizontal" v-else>
          <h2 class="white">Warte bis alle Spieler bereit sind</h2>
        </div>
      </div>
    </div>
  </div>

  <div v-if="mode === 1">
    <!--<div class="center-horizontal">
      <div :style="'width: ' + 100 * progressMultiply + 'px; height: 10px'">
        <div :style="'width: ' + 100 * progressMultiply + 'px; height: 10px; background: #eeeeee'" class="absolute">
        </div>
        <div :style="'width: ' + progress * progressMultiply + 'px; height: 10px; background: #42b983'"
          class="absolute"></div>
      </div>
    </div>
  -->
    <div class="center-horizontal">
      <div class="to-draw-text round-corner">{{ drawText }}</div>
    </div>
    <div v-if="!selfReady">
      <div class="center-horizontal">
        <UIButton :title="lang.game.finishedPromptButton" @click="onClickFinishImage" :disabled="selfReady"
          color="line1" />
      </div>
      <!--<div class="center-horizontal">
        <UIButton :title="'img to png'" @click="getImageAsBase64" color="line3" />
      </div>
    -->
      <div style="height: 20px"></div>
      <div class="center-horizontal">
        <div class="center-horizontal">
          <UIButton :title="lang.game.searchImagesButton" @click="onClickSearch" :disabled="selfReady"
            color="prim-color-background" />
        </div>
        <div style="width: 20px"></div>
        <div class="center-horizontal">
          <UIButton :title="lang.game.addTextButton" @click="onTextClicked" :disabled="selfReady"
            color="prim-color-background" />
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="center-horizontal" v-if="canvasRender">
      <LayerEditor :sampler="true" :layers="addedImages" />
      <div style="width: 200px"></div>
      <div class="canvas relative" v-if="reloadCanvas">

        <div v-for="(imageUrl, index) in addedImages">
          <img class="absolute" :class="'target' + index" :src="imageUrl" v-if="layerRender"
            @click="onImageFocus(index)" :style="{ transform: imageTransform[index] }" />
          <Moveable v-if="selectedImageIndex === index && !selfReady" className="moveable"
            v-bind:target="['.target' + index]" v-bind:draggable="true" v-bind:scalable="true" v-bind:rotatable="true"
            @drag="onDrag($event, index)" @scale="onScale($event, index)" @rotate="onRotate($event, index)" />
        </div>

        <div v-for="(text, index) in textList">
          <div class="absolute" :class="'targettext' + index" @click="onTextFocus(index)" style="font-size: 50px;"
            :style="{ transform: textTransform[index] }">{{ text.text }}
          </div>
          <Moveable v-if="selectedTextIndex === index && !selfReady" className="moveable"
            v-bind:target="['.targettext' + index]" v-bind:draggable="true" v-bind:scalable="true"
            v-bind:rotatable="true" @drag="onDragText($event, index)" @scale="onScaleText($event, index)"
            @rotate="onRotateText($event, index)" />
        </div>

        <!--
            <div v-for="(imageUrl, index) in loadImages" v-if="layerRender">
          <img class="target" ref="target" :src="imageUrl"/>
          <Moveable className="moveable" v-bind:target="['.target']" v-bind:draggable="true" v-bind:scalable="true"
            v-bind:rotatable="true" @drag="onDrag" @scale="onScale" @rotate="onRotate" />
        </div>
        <v-stage :config="stageConfig" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
          @mouseup="handleMouseUp" ref="stage">
          <v-layer>
            <v-image v-for="(imageUrl, index) in loadedImages" :key="index" :image="imageUrl"
              :config="imageConfig(index)" v-model="imageTransform[index]" @click="onImage(index)" />
            <v-text v-for="(text, index) in textList" :config="{
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
            }" @click="onText(index)" v-model="textTransform[index]" />
          </v-layer>
        </v-stage>
      -->
      </div>
      <div style="width: 200px"></div>
      <LayerEditor :sampler="false" @up="onUp" @down="onDown" @delete="onDelete" :layers="addedImages"
        v-if="layerRender && !selfReady" />
      <LayerEditor :sampler="true" @up="onUp" @down="onDown" @delete="onDelete" :layers="addedImages" v-else />
    </div>
    <div style="height: 20px"></div>
    <div class="center-horizontal" v-if="this.selectedTextIndex > -1">
      <button class="layer-button center-horizontal" @click="onTextDelete">
        <img src="../assets/trash.png" class="layer-trash-image">
      </button>
    </div>
  </div>

  <div v-if="mode === 2">
    <div class="center-horizontal" v-if="canvasRender">
      <div class="canvas relative" v-if="reloadCanvas">
        <div v-for="(imageUrl, index) in addedImages">
          <img class="absolute" :class="'target' + index" :src="imageUrl" v-if="layerRender"
            :style="{ transform: imageTransform[index] }" />
        </div>
        <div v-for="(text, index) in textList">
          <div class="absolute" :class="'targettext' + index" style="display: inline-block; font-size: 50px;"
            :style="{ transform: textTransform[index] }">{{ text.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="center-horizontal">
      <div>
        <div style="height: 20px"></div>
        <input ref="promptRating" :placeholder="lang.game.createPromptPlaceholder" class="prompt-input shadow"
          @keyup.enter="onClickFinishRating" />
        <div style="height: 20px"></div>
        <div class="center-horizontal" v-if="!selfReady">
          <UIButton :title="lang.game.finishedPromptButton" @click="onClickFinishRating"
            color="prim-color-background" />
        </div>
        <div class="center-horizontal" v-else>
          <h2>Warte bis alle Spieler bereit sind</h2>
        </div>
      </div>
    </div>
  </div>
  <div v-if="mode === 3">
    <div class="center-horizontal">
      <div>
        <PlayerView v-for="dat in revealLine" :name="dat[0]" :img="dat[1]"
          :selected="dat[0] === this.currentRevealPlayer" />
      </div>
      <div class="scroll" ref="scroll">
        <div v-for="(dat, index) in revealData" v-if="canvasRender">

          <CanvasView :stageConfig="stageConfig" :loadedImages="dat.image?.images"
            :imageConfig="dat.image?.imageTransform" :textList="dat.image?.text"
            :textTransform="dat.image?.textTransform" :prompt="dat.prompt" />
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
import { nextTick } from "vue";
import AddTextPopup from "@/components/views/AddTextPopup.vue";
import LayerEditor from "@/components/views/LayerEditor.vue";
import { HttpRequest } from "@/components/code/HttpRequest";
import CanvasView from "./views/CanvasView.vue";
import PlayerLine from "./views/PlayerLine.vue";
import Moveable from "vue3-moveable";
import { transform } from "typescript";
import BackgroundView from "./views/BackgroundView.vue";
import PlayerView from "./views/PlayerView.vue";


export default {
  name: "GamePage",
  components: { LayerEditor, AddTextPopup, ImageSearchPopup, UIButton, CanvasView, PlayerLine, Moveable, BackgroundView, PlayerView },
  data() {
    return {
      lang: langEN,
      mode: 0,
      names: [],
      selfReady: false,
      showISP: false,
      stageConfig: {
        width: 800,
        height: 600,
      },
      isHost: false,
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
      drawText: "",
      revealData: [],
      loadedRevealImage: [],
      revealLine: [],
      currentRevealPlayer: [],
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

    /*
      [ 'Jason', 'Marcel', 'Enns' ],
      [ 'Marcel', 'Enns', 'Jason' ],
      [ 'Enns', 'Jason', 'Marcel' ]
    */


    //this.increaseProgress()

    //this.setRevealContent()

    //this.loadImage(this.image, this.imageConfig);

    if (this.getCookies("host") === "true") {
      this.isHost = true
    }

    if (this.getCookies("lang") === null || this.getCookies("lang") === "en") {
      this.lang = langEN
    } else {
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

      dat = {
        type: "ping",
        func: "getPlayers"
      };
      this.send(dat);

      dat = {
        type: "ping",
        func: "existRoom"
      };
      this.send(dat);

    });

    this.socket.addEventListener('error', (event) => {
      this.$router.push("/")
    });


    this.socket.addEventListener('message', (event) => {

      const message = JSON.parse(event.data)

      console.log(message)
      if (message.func === "error") {
        console.error(message.text)
      } else if (message.func === "ready") {
        this.mode = 1
        this.selfReady = false
      } else if (message.func === "readyImage") {
        this.mode = 2
        this.selfReady = false
      } else if (message.func === "playerIsReady") {
        for (let i = 0; i < this.names.length; i++) {
          if (this.names[i].name === message.player) {
            this.names[i].ready = true
          }
        }
      } else if (message.func === "everyoneUnready") {
        for (let i = 0; i < this.names.length; i++) {
          this.names[i].ready = false
        }
      } else if (message.func === "finished") {
        console.log("finished: ")
        console.log(message)
        this.revealLine = message.line
        this.setRevealContent(message)

      } else if (message.func === "base64") {
        let b64 = message.base
        let http = new HttpRequest()
        http.httpRequestPost("https://inforgeserver.de:8000/upload", "image", b64).then((json) => {
          console.log(json)
        })
      } else if (message.func === "clearGame") {
        this.mode = 0
        this.selfReady = false
        this.addedImages = []
        this.imageTransform = []
        this.textList = []
        this.textTransform = []
        this.progress = 0
        let dat = {
          type: "ping",
          func: "getPlayers"
        };
        this.send(dat);
      } else if (message.func === "dataForPrompt") {
        if (message.toPlayer === this.getCookies("username")) {
          this.selfReady = false
          this.canvasRender = false
          let canvas = message.playerData
          this.addedImages = canvas.images
          this.imageTransform = canvas.imageTransform
          this.textList = canvas.text
          this.textTransform = canvas.textTransform
          this.loadedImages = []
          nextTick(() => {
            this.canvasRender = true
          })
        }
      } else if (message.func === "dataForImage") {
        if (message.toPlayer === this.getCookies("username")) {
          this.drawText = message.playerData
          this.addedImages = []
          this.imageTransform = []
          this.textList = []
          this.textTransform = []
          this.loadedImages = []
          this.progress = 0
        }
      } else if (message.func === "existRoom") {
        if (!message.exist) {
          this.$router.push("/")
        }
      } else if (message.func === "allPlayers") {
        if (message.players.length === 0) {
          this.$router.push("/")
        } else {
          this.names = []

          let allPlayers = message.players
          for (let i = 0; i < allPlayers.length; i++) {
            let dat = {
              name: allPlayers[i].name,
              pb: allPlayers[i].pb,
              ready: false
            }
            this.names.push(dat)
          }

          let names1 = this.names
          this.names = []
          nextTick().then(() => {
            this.names = names1
          })
        }


      }
    });

  },

  methods: {

    onClickFinish() {
      this.selfReady = true
      let dat = {
        type: "engine",
        func: "readyPrompt",
        args: [this.$refs.prompt.value, this.getCookies("username")]
      }
      this.send(dat)
    },

    onClickRestart() {
      this.mode = 0
      let dat = {
        type: "engine",
        func: "restartGame"
      }
      this.send(dat)
    },

    onDrag({ transform }, index) {
      this.imageTransform[index] = transform
    },
    onScale({ drag }, index) {
      this.imageTransform[index] = drag.transform
    },
    onRotate({ drag }, index) {
      this.imageTransform[index] = drag.transform
    },

    onDragText({ transform }, index) {
      this.textTransform[index] = transform
    },
    onScaleText({ drag }, index) {
      this.textTransform[index] = drag.transform
    },
    onRotateText({ drag }, index) {
      this.textTransform[index] = drag.transform
    },

    onClickFinishRating() {
      this.selfReady = true
      let dat = {
        type: "engine",
        func: "readyPrompt",
        args: [this.$refs.promptRating.value, this.getCookies("username")]
      }
      this.send(dat)
    },

    onImageFocus(index) {
      console.log("image focus")
      this.selectedImageIndex = index
      this.selectedTextIndex = -1
    },

    onTextFocus(index) {
      console.log("text focus")
      this.selectedTextIndex = index
      this.selectedImageIndex = -1
      console.log(this.selectedTextIndex)
    },

    onClickFinishImage() {
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

    imageClicked(img) {
      this.imageTransform.push("")
      this.addedImages.push(img)
      this.onImageFocus(this.addedImages.length - 1)
      this.showISP = false
      this.reloadCanvas = false
      nextTick().then(() => {
        this.reloadCanvas = true
      })
      //this.onSetDefault()

      this.layerRender = false
      nextTick(() => {
        this.layerRender = true
      })
    },


    async setRevealContent(message1) {
      this.canvasRender = false

      this.mode = 3
      this.selfReady = false

      let comb = {}
      let arr = []




      let message = {"func":"finished","line":[["Jason","squid"],["Marcel","sigma"]],"sessionData":[[{"player":"Jason","content":"tisch"},{"player":"Jason","content":{"images":["https://w7.pngwing.com/pngs/631/788/png-transparent-table-wood-tables-orange-table-illustration-angle-furniture-rectangle-thumbnail.png"],"imageTransform":[" translate(235px, 182px) "],"text":[],"textTransform":[]}}],[{"player":"Marcel","content":"stuhl"},{"player":"Marcel","content":{"images":["https://w7.pngwing.com/pngs/986/34/png-transparent-office-desk-chairs-swivel-chair-chair-angle-furniture-office-thumbnail.png"],"imageTransform":[" translate(231px, 135px) "],"text":[],"textTransform":[]}}]]}
      message = message1


      for (let k = 0; k < message.sessionData.length; k++) {
        let sessionData = message.sessionData[k]
        arr = []
        console.log(sessionData)
        for (let i = 0; i < sessionData.length; i++) {
          this.canvasRender = false
          let isImage = (i % 2) > 0
          this.currentRevealPlayer = sessionData[i].player
          if (isImage) {
            comb.image = sessionData[i].content
            arr.push(comb)
          } else {
            comb.prompt = sessionData[i].content
            arr.push(comb)
          }
          comb.player = sessionData[i].player
          comb = {}
          this.revealData = arr
          console.log(this.revealData)
          nextTick(() => {
            this.canvasRender = true
            nextTick(() => {
              let scroll = this.$refs.scroll;
              scroll.scrollTop = scroll.scrollHeight;
            })
          })
          await this.delay(4000)
        }



        console.log(arr)

        nextTick(() => {
          this.canvasRender = true
        })
      }
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },


    closeISP() {
      this.showISP = false
    },

    onClickSearch() {
      this.showISP = true
    },


    increaseProgress() {
      if (this.progress < 100) {
        this.progress++
        setTimeout(() => {
          this.increaseProgress()
        }, this.progressTime
        )
      } else {
        this.selfReady = true
      }
    },



    onUp(index) {
      if (index !== this.addedImages.length - 1) {
        let ui = index++
        this.changeIndex(index, ui)
      }
    },

    onDown(index) {
      if (index !== 0) {
        let oi = index--
        this.changeIndex(index, oi)
      }
    },

    onDelete(index) {
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

    onTextDelete() {
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
      this.selectedTextIndex = -1
    },


    deleteIndex(array, index) {
      let updated = []
      for (let i = 0; i < array.length; i++) {
        if (i !== index) {
          updated.push(array[i])
        }
      }
      return updated
    },

    getImageAsBase64() {

      let data = {
        type: "util",
        func: "imageToBase64",
        args: [this.addedImages[this.selectedImageIndex]]
      }
      this.send(data)
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

    closeText() {
      this.showTextPopup = false
    },

    addedText(text) {
      let dat = {
        text: text,
        fontSize: this.valT
      }
      this.textList.push(dat)
      this.onTextFocus(this.textList.length - 1)
      this.reloadCanvas = false
      nextTick().then(() => {
        this.reloadCanvas = true
      })
      this.closeText()

      this.layerRender = false
      nextTick(() => {
        this.layerRender = true
      })
    },

    onTextClicked() {
      this.showTextPopup = true
    },


    changeIndex(indexA, indexB) {
      this.addedImages = this.indexCustomChange(this.addedImages, indexA, indexB)
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




    send(data) {
      data.rc = this.getCookies("rc")
      this.socket.send(JSON.stringify(data))
    },

    getCookies(key) {
      return this.$cookies.get(key);
    },
    setCookies(key, value) {
      return this.$cookies.set(key, value, 2147483647);
    },
    eventClose() {
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

.progress-bar-container {
  width: 100%;
  position: fixed;
}

.progress-bar {
  height: 100%;
  background-color: #76ceff;
  transition: 0.1s ease;
}

.progress-bar--small {
  height: 5px;
}

.progress-bar--medium {
  height: 7px;
}

.progress-bar--big {
  height: 10px;
}

.progress-bar--rounded {
  border-radius: 5px;
}
</style>