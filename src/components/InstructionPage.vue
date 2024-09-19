<style>
.ins-image {
  width: 400px;
}

.ins-image-arrow {
  width: 50px;
}

.ins-prompt {
  display: inline-block;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 100px;
  font-size: 20px;
  color: black;
  background-color: white;
}
</style>

<template>
  <LangSelection @click="langClicked" :lang="lang.langVis" />


  <div class="center-horizontal" style="text-align: center" v-if="lang.lang === 'de'">
    <div style="width: 80vw;" class="white instructions-background">
      <h1 class="prim-color">Spielanleitung</h1>
      <h2>Einführung</h2>
      <p>FrameGame ist ein Browsergame, welches sich am Prinzip von "Stille Post" bediehnt. Grundsätlich ist es von
        "Gartic Phone Inspiriert worden."
        Das Spielprinzip funktioniert so, dass ein Spieler ein kreativen Text eingibt, welcher dann ein anderer Spieler
        mir Bildern aus dem Internet
        zusammenstellen kann. Ein weiterer Spieler muss dann erraten, was der vorherige Spieler kreiert hat. Das geht
        dann immer weiter. <br>
        Kreativer text -> Bild erzeugen -> erraten was das Bild darstellen soll -> auf diesen Text ein neues Bild
        erzeugen -> erraten was das Bild darstellen soll -> auf diesen Text ein neues Bild erzeugen -> ...</p>

      <div>
        <div>
          <div class="ins-prompt">Ein Elefant hat ein Hut uns ist auf dem Mond</div>
        </div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
      </div>
      <img src="../assets/elephant1.png" class="ins-image" />

      <div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
        <div>
          <div class="ins-prompt">Im Weltall ist ein Elefant und ein Mond</div>
        </div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
      </div>
      <img src="../assets/elephant2.png" class="ins-image" />

      <div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
        <div>
          <div class="ins-prompt">Ein Elefant schwebt neben einem Mond</div>
        </div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
      </div>
      <img src="../assets/elephant3.png" class="ins-image" />

      <div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
        <div>
          <div class="ins-prompt">Ein Elefant hebt vom boden ab</div>
        </div>
      </div>


      <h2>Bilder-Engine</h2>
      <p>Die Bilder werden von folgenden Seiten bezogen:</p>
      <p>
        pngfre.com<br>
        pngimg.com<br>
        pngwing.com<br>
        oscobo.com -> image<br>
      </p>

      <div style="height: 70px"></div>
    </div>
  </div>

  <div class="center-horizontal" style="text-align: center" v-if="lang.lang === 'en'">
    <div style="width: 80vw;" class="white instructions-background">
      <h1 class="prim-color">Game Instructions</h1>
      <h2>Introduction</h2>
      <p>FrameGame is a browser game based on the concept of "Telephone". Essentially, it was inspired by "Gartic
        Phone."
        The gameplay works as follows: one player enters a creative text, which another player then assembles using
        images from the internet.
        Another player must then guess what the previous player has created. This process continues as follows: <br>
        Creative text -> Create an image -> Guess what the image represents -> Create a new image based on the guessed
        text -> Guess what the image represents -> Create a new image based on the guessed text -> ...</p>

      <div>
        <div>
          <div class="ins-prompt">An elephant is wearing a hat and is on the moon</div>
        </div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
      </div>
      <img src="../assets/elephant1.png" class="ins-image" />

      <div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
        <div>
          <div class="ins-prompt">In space, there is an elephant and a moon</div>
        </div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
      </div>
      <img src="../assets/elephant2.png" class="ins-image" />

      <div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
        <div>
          <div class="ins-prompt">An elephant is floating next to a moon</div>
        </div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
      </div>
      <img src="../assets/elephant3.png" class="ins-image" />

      <div>
        <img src="../assets/arrow_down.png" class="ins-image-arrow" />
        <div>
          <div class="ins-prompt">An elephant is taking off from the ground</div>
        </div>
      </div>

      <h2>Image Engine</h2>
      <p>The images are sourced from the following websites:</p>
      <p>
        pngfre.com<br>
        pngimg.com<br>
        pngwing.com<br>
        oscobo.com -> image<br>
      </p>

      <div style="height: 70px"></div>
    </div>
  </div>

</template>


<script>

import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"
import LangSelection from "@/components/views/LangSelection.vue";

export default {
  name: "InstructionPage",
  components: { LangSelection },
  data() {
    return {
      lang: langEN,
    };
  },

  created() {
  },

  mounted() {

    if (this.getCookies("lang") === null || this.getCookies("lang") === "en") {
      this.lang = langEN
    } else {
      this.lang = langDE
    }

  },

  methods: {

    getCookies(key) {
      return this.$cookies.get(key);
    },
    setCookies(key, value) {
      return this.$cookies.set(key, value, 2147483647);
    },

    langClicked() {
      if (this.getCookies("lang") === null || this.getCookies("lang") === "en") {
        this.setCookies("lang", "de")
        this.lang = langDE
      } else {
        this.setCookies("lang", "en")
        this.lang = langEN
      }
    }
  }
}
</script>