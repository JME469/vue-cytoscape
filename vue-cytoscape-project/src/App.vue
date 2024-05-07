<template>
  <div id="app">
    <repertorioComponent />
  </div>
</template>

<script>
import repertorioComponent from "./components/repertorioComponent.vue";

export default {
  components: {
    repertorioComponent,
  },
};
</script>

<style>
body{
  margin: 0px;
}

#cy {
  width: 100%;
  height: 600px;
  background-color: rgb(235, 235, 235);
}

#popup>div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}

#popup {
  position: relative;
  background-color: white;
  border-radius: 15px;
  border: 1px solid #ccc;
  font-family: "Source Sans 3";
  padding: 20px;
  z-index: 999;
  transition: opacity 0.4s ease, box-shadow 0.35s ease, transform 0.5s ease;
}

#popup:hover {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#popup>div>img {
  border-radius: 10px;
  margin: 15px;
}
</style>
