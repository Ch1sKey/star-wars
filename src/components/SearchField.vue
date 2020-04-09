<template>
  <form @submit.prevent class="search">
    <div class="search__content">
      <div :class="['search__row', isActive ? 'search__row_active' : '']">
        <label class="search__content__textFieldlabel" for>
          <div class="search__placeholder">Search by name</div>
          <input
            @focus="isActive = true"
            @blur="isActive = $event.target.value.length !== 0"
            @keyup="search($event.target.value, $event)"
            class="search__input"
            type="text"
          />
        </label>
        <img src="@/assets/images/loop.svg" alt="Search Image" />
      </div>
    </div>
  </form>
</template>
<script>
export default {
  name: "SearchField",
  data: function() {
    return {
      isActive: false
    };
  },
  methods: {
    search(str, event) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (event.key === "Enter") {
        this.$emit("search", str);
        return;
      }
      this.timer = setTimeout(() => {
        this.$emit("search", str);
      }, 500);
    }
  }
};
</script>

<style lang = "scss">
.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.search__row {
  display: flex;
}

.search__content {
  position: relative;
  max-width: 800px;
  width: 100%;
  border-bottom: 1px solid $grey;
}

.search__row_active .search__placeholder {
  font-size: 13px;
  left: 0;
  top: -10px;
}

.search__placeholder {
  position: absolute;
  top: 8px;
  left: 0;
  z-index: -1;
  font-size: 18px;
  transition: 0.2s;
  color: $grey;
}

.search__content__textFieldlabel {
  width: 100%;
}

.search__input {
  outline: none;
  color: $white;
  width: 100%;
  display: block;
  font-size: 18px;
  padding: 8px 15px 8px 0;
  background-color: transparent;
}
</style>