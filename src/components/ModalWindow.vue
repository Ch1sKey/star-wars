<template>
  <div class="modal" @keyup.esc = "$emit('close')">
    <div @click="$emit('close')" class="modal__shade"></div>
    <div ref = "modalCard" tabindex="0" aria-modal="true" class="modalCard">
      <div class="modalCard__part modalCard__part_top">
        <div class="modalCard__mainData">
          <div :style="{ backgroundColor: color }" class="modalCard__avatar">{{ character.name[0] }}</div>
          <div class="modalCard__name">{{ character.name }}</div>
        </div>
      </div>
      <LoaderFalcon v-if="!dataReady" :radius="50" />
      <div v-if="dataReady" class="modalCard__part modalCard__part_bottom">
        <ul class="modalCard__part__dataSide">
          <li class="modalCard__part__dataSide__item">
            <div class="modalCard__part__dataSide__item__label">
              <img
                alt="Year Icon"
                class="modalCard__part__dataSide__item__label__image"
                src="@/assets/images/labels/birth-year.svg"
              />
              <div class="modalCard__part__dataSide__item__label__text">Birth Year</div>
            </div>
            <div class="modalCard__part__dataSide__item__value">{{ character.birth_year }}</div>
          </li>
          <li class="modalCard__part__dataSide__item">
            <div class="modalCard__part__dataSide__item__label">
              <img
                alt="Species Icon"
                class="modalCard__part__dataSide__item__label__image"
                src="@/assets/images/labels/species.svg"
              />
              <div class="modalCard__part__dataSide__item__label__text">Species</div>
            </div>
            <div class="modalCard__part__dataSide__item__value">{{ character.species[0] }}</div>
          </li>
          <li class="modalCard__part__dataSide__item">
            <div class="modalCard__part__dataSide__item__label">
              <img
                alt="Gender Icon"
                class="modalCard__part__dataSide__item__label__image"
                src="@/assets/images/labels/gender.svg"
              />
              <div class="modalCard__part__dataSide__item__label__text">Gender</div>
            </div>
            <div class="modalCard__part__dataSide__item__value">{{ character.gender }}</div>
          </li>
        </ul>
        <ul class="modalCard__part__dataSide">
          <li class="modalCard__part__dataSide__item">
            <div class="modalCard__part__dataSide__item__label">
              <img
                alt="Homeworld Icon"
                class="modalCard__part__dataSide__item__label__image"
                src="@/assets/images/labels/homeworld.svg"
              />
              <div class="modalCard__part__dataSide__item__label__text">Homeworld</div>
            </div>
            <div class="modalCard__part__dataSide__item__value">{{ character.homeworld }}</div>
          </li>
          <li class="modalCard__part__dataSide__item">
            <div class="modalCard__part__dataSide__item__label">
              <img
                alt="Films Icon"
                class="modalCard__part__dataSide__item__label__image"
                src="@/assets/images/labels/films.svg"
              />
              <div class="modalCard__part__dataSide__item__label__text">Films</div>
            </div>
            <ul
              class="modalCard__part__dataSide__item__value modalCard__part__dataSide__item__value_list"
            >
              <li
                v-for="(film, i) in character.films"
                :key="i"
                class="modalCard__part__dataSide__item__value_list__item"
              >"{{ film }}"</li>
            </ul>
          </li>
        </ul>
      </div>
      <button tabindex="0" @click="$emit('close')" class="modalCard__close">
        <img src="@/assets/images/close.svg" alt="Close Sign" />
      </button>
    </div>
  </div>
</template>
<script>
import hashColor from "@/mixins/hashColor.js";

import LoaderFalcon from "@/components/LoaderFalcon.vue";

export default {
  name: "ModalWindow",
  mixins: [hashColor],
  props: {
    character: {
      name: String,
      species: [],
      films: [],
      birth_year: String,
      gender: String,
      homeworld: String
    }
  },
  components: {
    LoaderFalcon
  },
  data: function() {
    return {
      dataReady: false
    };
  },
  computed: {
    color() {
      return this.getHashColor(this.character.name);
    }
  },
  beforeMount() {
    let isLink = str => str.match(/swapi/gm);

    let loadProperty = property => {
      if (Array.isArray(property)) {
        return Promise.all(
          property.map(item => {
            if (isLink(item)) {
              return fetch(item).then(stream => stream.json());
            } else {
              return Promise.resolve(item);
            }
          })
        );
      } else {
        if(isLink(property)){
          return fetch(property).then(stream => stream.json());
        } else {
          return Promise.resolve(property)
        }
      }
    };
    let prepareData = async () => {
      let filmsData, speciesData, homeworldData;
      try {
        filmsData = await loadProperty(this.character.films);
        speciesData = await loadProperty(this.character.species);
        homeworldData = await loadProperty(this.character.homeworld);
      } catch (error) {
        console.error(error);
        return;
      }
      this.character.films = filmsData.map(x => x.title || x) ;
      this.character.species = speciesData.map(x =>
        typeof x === "string" ? x : x.name
      );
      this.character.homeworld = homeworldData.name || homeworldData;
    };

    prepareData().then(() => {
      setTimeout(() => {
        this.dataReady = true;
      }, 1500)
    });
  },
  mounted() {
    this.$nextTick(()=>{ 
      this.$refs.modalCard.focus()
     })
  }
};
</script>
<style lang="scss">
@keyframes blur {
  to {
    backdrop-filter: blur(10px);
  }
}

@keyframes blurFallback {
  to {
    background-color: $light-black;
    opacity: .9;
  }
}

@keyframes cardFadeIn {
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
}

.modal {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  left: 0;
  top: 0;
  padding-top: 40px;
  padding-bottom: 40px;
  width: 100vw;
  height: 100vh;
}

.modal__shade {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  left: 0;
  top: 0;
  cursor: pointer;
  animation: 0.1s linear blur forwards;
  // backdrop-filter: blur(0px);
  // padding-top: 40px;
  // padding-bottom: 40px;
  width: 100vw;
  height: 100vh;
}

@supports not (backdrop-filter: blur(10px)) {
  .modal__shade {
    animation: 0.3s linear blurFallback forwards;
    // background-color: $light-black;
    // opacity: 0.9;
  }
}



.modalCard {
  width: 640px;
  cursor: default;
  transform: translate(0, 40px);
  opacity: 0.1;
  animation: 0.3s ease-in cardFadeIn forwards;
  background-color: $black;
  border-radius: 8px;
  padding: 80px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.4);
}

.modalCard:focus {
  outline: none;
}


.modalCard__close {
  cursor: pointer;
  width: 24px;
  height: 24px;
  position: absolute;
  right: 16px;
  top: 16px;
}

.modalCard__part_top {
  font-size: 24px;
  font-weight: bold;
  padding-bottom: 80px;
  margin-bottom: 10px;
  border-bottom: 2px solid $grey;
}

.modalCard__part_bottom {
  display: flex;
  padding-top: 70px;
}

.modalCard__mainData {
  display: flex;
  align-items: center;
}

.modalCard__part__dataSide:nth-child(1)
  .modalCard__part__dataSide__item__label {
  width: 120px;
}

.modalCard__part__dataSide:nth-child(2)
  .modalCard__part__dataSide__item__label {
  width: 140px;
}

.modalCard__part__dataSide__item {
  display: flex;
  flex-basis: 50%;
  align-items: center;
  // justify-content: space-evenly;
  margin-bottom: 20px;
}

.modalCard__part__dataSide__item__label {
  display: flex;
  align-items: center;
  // justify-self: baseline;
  align-self: flex-start;
  font-size: 18px;
}

.modalCard__part__dataSide__item__label__text {
  color: $grey;
}

.modalCard__part__dataSide__item__value {
  font-weight: bold;
  justify-self: end;
}

.modalCard__part__dataSide__item__value_list {
  list-style: none;
}

.modalCard__part__dataSide__item__value_list__item {
  font-weight: normal;
  font-style: italic;
  margin-bottom: 10px;
}

.modalCard__part__dataSide__item__label__image {
  margin-right: 10px;
  width: 18px;
  height: 20px;
}

.modalCard__part__dataSide:nth-child(1) {
  margin-right: 80px;
}

.modalCard__avatar {
  width: 80px;
  height: 80px;
  display: flex;
  font-size: 48px;
  border-radius: 50%;
  margin-right: 15px;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .modal {
    padding: 0;
  }
  .modalCard {
    width: 100%;
    height: 100vh;
    padding: 50px 25px;
  }
  .modalCard__part_top{
    padding-bottom: 50px;
  }
  .modalCard__part_bottom {
    padding-top: 40px;
    flex-direction: column;
  }

  .modalCard__part__dataSide {
    margin: 0;
  }
}


</style>