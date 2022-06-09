<template>
    <v-footer blue color="light-blue lighten-2" class="footer" >
    <v-col
      class="text-center white--black"
      cols="12"
    >
      {{ new Date().getFullYear() }} — <strong>Yenis Paola Uriana Ramirez</strong>
    </v-col>
  </v-footer>
</template>

<script>
export default {
    
}
</script>
<style scoped>
.footer{
  width: 100%;
  z-index: 20;
  position: fixed;
  bottom: 0px;
  justify-content: center;
}
</style>
