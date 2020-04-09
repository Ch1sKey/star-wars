<template>
  <div id="app">
    <header>
      <HeaderBanner />
    </header>
    <main>
      <div v-if="showError && !errorAlreadyShown" @click="showError = false; errorAlreadyShown = true" class="error">
        <div
          class="error__text"
        >Запрос к API оказался неудачным. Приложение работает в Fallback режиме.</div>
        <button class="error__ok">OK</button>
      </div>
      <SearchField @search="search" v-if="showSearchBar" />
      <div ref="characters" class="characters">
        <CharacterCard
          @click.native="cardClick(character)"
          v-for="(character, i) in characters"
          :key="i"
          :character="character"
        />
      </div>
      <LoaderFalcon v-if="!charactersLoaded" :radius="90" />
      <ModalWindow ref="modal" v-if="showModal" @close="modalClose" :character="modalCharacter" />
    </main>
    <footer>
      <FooterBlock />
    </footer>
  </div>
</template>

<script>
import HeaderBanner from "@/components/HeaderBanner.vue";
import SearchField from "@/components/SearchField.vue";
import FooterBlock from "@/components/FooterBlock.vue";
import LoaderFalcon from "@/components/LoaderFalcon.vue";
import CharacterCard from "@/components/CharacterCard.vue";
import ModalWindow from "@/components/ModalWindow.vue";

import fallbackArray from "@/assets/data/fallback.json"

// TODO: Мобилка!

export default {
  name: "App",
  components: {
    HeaderBanner,
    FooterBlock,
    LoaderFalcon,
    SearchField,
    CharacterCard,
    ModalWindow
  },
  data: function() {
    return {
      baseURL: "https://swapi.co/api/people/",
      maxCharacters: 0,
      modalCharacter: {},
      characters: [],
      showSearchBar: false,
      charactersLoaded: false,
      showModal: false,
      page: 1,
      searchOptions: "",
      abortController: new AbortController(),
      showError: false,
      errorAlreadyShown: false,
    };
  },
  methods: {
    loadCharacters() {
      fetch(this.baseURL + `?search=${this.searchOptions}`, {
        signal: this.abortController.signal,
        method: "GET"
      })
        .then(stream => stream.json())
        .then(data => {
          this.maxCharacters = data.count;
          this.showSearchBar = true;
          this.characters = data.results;
          this.charactersLoaded = true;
          this.page++;
        })
        .catch(error => {
          if (error.name !== "AbortError") {
            console.error(error);
          }
          this.characters.push(...fallbackArray, ...fallbackArray);
          if(this.searchOptions !== "") {
            this.characters = this.characters.filter(x => x.name.match(new RegExp(this.searchOptions, 'gmi')) )
          }
          this.charactersLoaded = true;
          this.showSearchBar = true;
          this.showError = true;
          this.maxCharacters = 100;
          return;
        });
    },
    search(str) {
      if (!this.charactersLoaded) {
        this.abortController.abort();
      }
      this.characters = [];
      this.charactersLoaded = false;
      this.searchOptions = str;
      // this.maxCharacters = 0;
      this.page = 0;
      this.loadCharacters();
    },
    loadMoreCharacters() {
      if (this.maxCharacters < this.characters.length) return;
      this.charactersLoaded = false;
      fetch(this.baseURL + `?page=${this.page}`, { method: "GET" })
        .then(stream => stream.json())
        .then(data => data.results)
        .then(chars => {
          setTimeout(() => {
            this.characters.push(...chars);
            this.charactersLoaded = true;
            this.page++;
          }, 2000); // // Искусственная задержка, чтобы продемонстрировать лоадер
        })
        .catch(error => {
          this.characters.push(...this.characters.slice(-10));
          this.charactersLoaded = true;
          console.error(error);
          // this.loadCharacters();
        });
    },
    cardClick(character) {
      this.modalCharacter = character;
      this.showModal = true;
    },
    modalClose() {
      this.showModal = false;
    },
    scroll() {
      let charactersTable = this.$refs.characters;
      if (
        charactersTable?.scrollHeight - charactersTable?.offsetTop <
          window.pageYOffset &&
        this.charactersLoaded
      ) {
        this.loadMoreCharacters();
      }
    }
  },
  mounted() {
    document.addEventListener("scroll", this.scroll);
    setTimeout(() => {
      this.loadCharacters();
    }, 2000); // // Искусственная задержка, чтобы продемонстрировать лоадер
  }
};
</script>

<style lang = "scss">
*,
*::before,
*::after {
  background: none;
  margin: 0;
  padding: 0;
  border: 0;
} /* Не лучшая практика обнуления стилей, я знаю. Но для наших целей вполне достаточно.  */

@keyframes showError {
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}

button {
  background: transparent;
  color: inherit;
  font: inherit;
}

@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
body {
  font-family: "Roboto", sans-serif;
  background-color: $light-black;
  color: $white;
}

main {
  display: flex;
  padding: 100px 25px;
  align-items: center;
  flex-direction: column;
  min-height: 600px;
}

.characters {
  padding-top: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.error {
  position: fixed;
  transform: translate(0, 40px);
  opacity: 0;
  animation: showError 0.3s ease-in forwards;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 15px;
  width: 65%;
  padding: 20px 40px;
  border-radius: 20px;
  background: $black;
  box-shadow: 0px 10px 40px rgba(237, 36, 67, 1.98);
}

.error__ok {
  cursor: pointer;
  background-color: $grey;
  border-radius: 40px;
  padding: 10px 80px;
}

.error__text {
  margin-bottom: 40px;
}
</style>
