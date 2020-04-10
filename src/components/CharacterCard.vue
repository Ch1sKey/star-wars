<template>
  <button class="card">
    <div class="card__data">
      <div
        tabindex="-1"
        :style=" { backgroundColor: color } "
        class="card__data__avatar"
      >{{ character.name[0] }}</div>
      <div class="card__data__name">{{ character.name }}</div>
      <div class="card__data__species" v-if="showSpecies">{{ character.species[0] }}</div>
      <div class="card__data__species__preloader" v-if="!showSpecies">
        <div class="card__data__species__preloader__wrapper">
          <div class="card__data__species__preloader__item"></div>
          <div class="card__data__species__preloader__item"></div>
          <div class="card__data__species__preloader__item"></div>
        </div>
      </div>
    </div>
  </button>
</template>
<script>
import hashColor from "@/mixins/hashColor.js";

export default {
  name: "CharacterCard",
  mixins: [hashColor],
  props: {
    character: {
      name: String,
      species: [String]
    }
  },
  data: function() {
    return {
      showSpecies: false
    };
  },
  beforeMount() {
    let isLink = str => str.match(/swapi/gim);
    let loadSpecies = Promise.all(
      this.character.species.map(species => {
        if (isLink(species)) {
          return fetch(species, { method: "GET" })
            .then(stream => stream.json())
            .then(data => data.name);
        } else {
          return Promise.resolve(species);
        }
      })
    );
    loadSpecies
      .then(species => {
        setTimeout(() => {
          this.character.species = species;
          if (species.length === 0) {
            this.character.species = ["Human"];
          }
          this.showSpecies = true;
        }, 2000); // Искусственная задержка, чтобы продемонстрировать лоадеры
      })
      .catch(console.error);
  },
  computed: {
    color() {
      return this.getHashColor(this.character.name);
    }
  }
};
</script>
<style lang="scss">
@keyframes cardFadeIn {
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes dottedPrelaoder {
  to {
    opacity: 1;
  }
}

.card {
  display: flex;
  transform: translate(0, 40px);
  animation: 0.4s ease-in cardFadeIn forwards;
  opacity: 0.1;
  animation-iteration-count: 1;
  justify-content: center;
  align-items: center;
  min-width: 272px;
  width: 40%;
  padding: 92px 20px;
  background: $black;
  margin: 16px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.4);
  transition: 0.3s;
  // width: 600px;
}

.card__data {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card__data__name {
  margin-bottom: 10px;
  font-size: 18px;
}

.card__data__species {
  font-size: 13px;
  color: $grey;
}

.card__data__avatar {
  width: 80px;
  height: 80px;
  display: flex;
  font-size: 48px;
  border-radius: 50%;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
}

.card__data__avatar:focus {
  outline: none;
}

.card__data__species__preloader__wrapper {
  display: flex;
}

.card__data__species__preloader {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: $grey;
  height: 15px;
}

.card__data__species__preloader__item {
  animation: 0.8s ease-in dottedPrelaoder;
  animation-iteration-count: infinite;
  opacity: 0;
  margin: 0 5px;
  height: 0.3em;
  width: 0.3em;
  border-radius: 50%;
  background-color: $grey;
  font-weight: bold;
  // font-size: 3em;
}

.card__data__species__preloader__item:nth-child(1) {
  animation-delay: 0.1s;
}

.card__data__species__preloader__item:nth-child(2) {
  animation-delay: 0.2s;
}

.card__data__species__preloader__item:nth-child(3) {
  animation-delay: 0.3s;
}

.card:hover {
  box-shadow: 0px 10px 40px rgba(37, 136, 167, 0.38);
}
</style>