<template>
  <div class="header__banner">
    <div class="logo">
      <img
        alt="Star wars logo word STAR"
        src="@/assets/images/logo_star.png"
        class="logo__image logo__image_position_top"
      />
      <h1 class="logo__text">Character Encyclopedia</h1>
      <img
        alt="Star wars logo word WARS"
        src="@/assets/images/logo_wars.png"
        class="logo__image logo__image_position_bottom"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderBanner"
};
</script>

<style scoped lang = "scss">
.header__banner {
  height: 33vh;
  overflow: hidden;
  background-color: $black;
  background-image: url(~@/assets/images/banner.jpg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;

}

.logo__image{
  max-width: 406px;
  width: 100%;
}

.logo__text {
  font-weight: bold;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  text-align: center;
  font-size: 24px;
}

@media (max-width: 540px) {
  .logo__text {
    font-size: 13px;
    margin: 10px;
    letter-spacing: .1em;
  }
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px auto;
  width: 70%;
}
</style>
