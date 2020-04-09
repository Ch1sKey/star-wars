<template>
  <div class="footer__content">
    <div class="footer__copyright">STAR WARS CHARACTER Encyclopedia, 2020</div>
    <div class="footer__copyright footer__copyright_small">
      Powered by
      <a target="_blank" href="https://swapi.co">swapi.co</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterBlock",
  components: {}
};
</script>

<style lang = "scss">
.footer__content {
  padding: 50px 0;
  background-color: $black;
}

.footer__copyright {
  width: 100%;
  text-transform: uppercase;
  font-size: 18px;
  text-align: center;
}

.footer__copyright_small {
  margin-top: 10px;
  text-transform: none;
  text-decoration: none;
  color: $grey;
  font-size: 13px;
}
</style>
