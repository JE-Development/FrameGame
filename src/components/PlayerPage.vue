<template>

  <BackgroundView />

  <transition name="toast">
    <Toast color="red" :text="unableMessage" v-if="showToast" style="z-index: 9999;"/>
  </transition>

  <div class="center-horizontal" v-if="isHost">
    <div class="center-horizontal">
      <div class="absolute">
        <h2 class="link-background center-horizontal black">{{ baseURI }}/code/{{ getCookies("rc") }}</h2>
      </div>
      <div style="height: 60px"></div>
    </div>
  </div>
  <div class="center-horizontal" v-if="isHost">
    <UIButton :title="lang.playerPage.kickEveryoneButton" @click="onClickRemove" color="prim-color-background" />
  </div>

  <div class="button-layout center-horizontal" v-if="!isHost">
    <UIButton :title="lang.playerPage.leaveButton" @click="onClickLeave" color="prim-color-background" />
  </div>

  <div class="center-horizontal">
    <PlayerView v-for="(dat) in names" :name="dat.name" :img="dat.pb" />
  </div>

  <div class="button-layout center-horizontal" v-if="isHost">
    <div>
      <div class="center-horizontal">
        <UIButton :title="lang.playerPage.startButton" @click="onClickStart" color="prim-color-background" />
      </div>
      <div class="center">
        <h2>{{ lang.playerPage.visibility }}</h2>
        <input type="checkbox" class="check-box" ref="vis" checked @click="visClicked">
      </div>
      <h2 class="red">{{ errorText }}</h2>
    </div>
  </div>
  <div v-else class="center-horizontal">
    <h1>{{ lang.playerPage.waitForPlayer }}</h1>
  </div>

</template>


<script>
import EventBus from "./code/EventBusEvent";
import PlayerView from "@/components/views/PlayerView.vue";
import { nextTick } from "vue";
import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"
import UIButton from "@/components/views/UIButton.vue";
import BackgroundView from "./views/BackgroundView.vue";
import Toast from "./views/Toast.vue";

export default {
  name: "PlayerPage",
  components: { UIButton, PlayerView, BackgroundView, Toast },
  data() {
    return {
      names: [],
      isHost: false,
      socket: null,
      baseURI: "",
      pb: [],
      errorText: "",
      lang: langEN,
      showToast: false,
      unableMessage: ""
    };
  },

  created() {

  },
  mounted() {
    this.baseURI = document.baseURI.split("#")[0] + "#"

    if (this.getCookies("lang") === null || this.getCookies("lang") === "en") {
      this.lang = langEN
    } else {
      this.lang = langDE
    }

    if (this.getCookies("host") === "true") {
      this.isHost = true
    }

    window.addEventListener('beforeunload', this.eventClose);

    if(this.getCookies("showPlayerStopToast") === "true"){
      this.setCookies("showPlayerStopToast", "false")
      this.unableMessage = this.lang.playerPage.closedByUser
      this.displayToast()
    }


    this.socket = new WebSocket(import.meta.env.VITE_SERVER_URL);

    this.socket.addEventListener('open', (event) => {
      console.log("socket connected")

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

      } else if (message.func === "allPlayers") {
        if (message.players.length === 0) {
          this.$router.push("/")
        } else {
          this.names = []

          let allPlayers = message.players
          for (let i = 0; i < allPlayers.length; i++) {
            let dat = {
              name: allPlayers[i].name,
              pb: allPlayers[i].pb
            }
            this.names.push(dat)
          }

          let names1 = this.names
          this.names = []
          nextTick().then(() => {
            this.names = names1
          })
        }


      } else if (message.func === "start") {
        this.startGame()

      } else if (message.func === "removed") {
        this.onClickLeave()
      } else if (message.func === "existRoom") {
        if (!message.exist) {
          this.$router.push("/")
        }
      }else if (message.func === "ping") {
        let dat = {
          type: "ping",
          func: "replyPing",
          id: message.id
        }
        this.send(dat)
      }
    });

  },

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.eventClose);
  },


  methods: {

    startGame() {
      this.$router.push('/game');
    },

    onClickStart() {
      if (this.names.length > 0) {
        let dat = {
          type: "engine",
          func: "start",
        }
        this.send(dat);
      } else {
        this.errorText = this.lang.playerPage.needMorePlayers
      }
    },

    eventClose() {
      if (this.isHost) {
        this.onClickRemove()
      } else {
        let dat = {
          type: "register",
          func: "removePlayer",
          player: this.getCookies("username"),
          pb: this.getCookies("pb")
        }
        this.send(dat);
      }
    },

    onClickLeave() {
      this.eventClose()
      window.open(document.baseURI.split("/#/")[0], '_self');
    },

    onClickRemove() {
      let dat = {
        type: "register",
        func: "kickAllPlayers"
      }
      this.send(dat);
      dat = {
        type: "register",
        func: "clearPlayer"
      }
      this.send(dat);
    },




    send(data) {
      data.rc = this.getCookies("rc")
      this.socket.send(JSON.stringify(data))
    },

    visClicked() {
      let isVis = this.$refs.vis.checked
      if (isVis) {
        this.setVis(true)
      } else {
        this.setVis(false)
      }
    },

    setVis(mode) {
      let dat = {
        type: "engine",
        func: "setVis",
        args: [mode]
      }
      this.send(dat)
    },

    displayToast() {
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 4000)
    },






    getCookies(key) {
      return this.$cookies.get(key);
    },
    setCookies(key, value) {
      return this.$cookies.set(key, value, 2147483647);
    },
  }
}
</script>