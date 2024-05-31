<template>
  <div id="app">
    <CytoscapeExample />
  </div>
</template>

<script>
import CytoscapeExample from "./components/CytoscapeExample.vue";

export default {
  components: {
    CytoscapeExample,
  },
};
</script>

<style>
body{
  margin: 0px;
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

#aside-content .aside-subtitle{
  color: rgb(130, 6, 18);
}

/* Example styles for vue-multiselect */
.multiselect {
  width: 250px; /* Adjust the width as needed */
}

.multiselect *{
  font-family: 'Source Sans 3';
}

.multiselect .multiselect__tags {
  border: 1px solid #383838; /* Add border to the tags container */
  border-radius: 4px; /* Add border radius to the tags */
  width: 250px;
  cursor: pointer;
}

.multiselect .multiselect__tags input {
  border: none; /* Remove border from the input field */
  cursor: pointer;
  margin: 10px;
}

.multiselect .multiselect__tags input:focus {
  outline: none; /* Remove outline on focus */
}

.multiselect .multiselect__tag {
  background-color: rgb(245, 245, 245); /* Set background color for tags */
  color: rgb(120, 38, 46); /* Set text color for tags */
  border: none; /* Remove border from tags */
  cursor: pointer;
  margin: 5px;
}

.multiselect .multiselect__tag:hover {
  background-color: #e0e0e0; /* Set background color on hover */
}

.multiselect .multiselect__tag .multiselect__tag-icon {
  cursor: pointer; /* Add pointer cursor to the remove icon */
}

.multiselect .multiselect__option {
  padding: 8px 12px; /* Add padding to the options */
  cursor: pointer;
}

.multiselect .multiselect__option--highlight {
  background-color: rgb(120, 38, 46); /* Set background color for highlighted options */
  color: aliceblue
}

.multiselect .multiselect__content{
  list-style: none !important;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.multiselect .multiselect__element{
  margin-bottom: 10px;
}

.p-multiselect{
  width: 230px;
  overflow: hidden;
  z-index: 1004 !important;
}

.p-multiselect .p-multiselect-header, .p-multiselect-item-wrapper{
  z-index: 2004 !important;
}
</style>
