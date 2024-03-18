<template>
  <div id="banner"><h1>Cytoscape project</h1></div>
  <hr>
  <div id="nav-container">
    <ul id="nav">
      <li><button class="nav-button">Grafico</button></li>
      <li><button class="nav-button">Eventi</button></li>
      <li><button class="nav-button">Fonti</button></li>
    </ul>
  </div>
  <div id="container">
    <!-- <button @click="saveLayout">Save Layout</button> -->
    <select v-model="selectedEvent" @change="filterGraph" id="filters">
      <option value="">All Events</option>
      <option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option>
    </select>
    <div id="cy"></div>
  </div>
</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap');

*{
    margin: 0;
    padding: 0;
}

body{
    min-width: 100vh;
    height: 100vh;
    width: 100%;
    max-width: 100vw;
}

hr{
  width: 100%;
  margin-bottom: 20px;
}

#banner{
    display: flex;
    min-height: 100px;
    text-align: left;
    background-color: rgb(255, 255, 255);
    color: rgb(84, 42, 23);
    justify-content: start;
    align-items: center;
    width: 100%;
    max-width: 100%;
}

#banner>h1{
    text-align: center;
    font-family: Syne;
    font-weight: 500;
    margin: 25px;
}

#nav-container{
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
}

#nav{
    display: flex;
    flex-direction: row;
    gap: 30px;
    list-style: none;
    list-style-type: none;
    height: 100%;
    background-color: rgb(255, 255, 255);
    margin-bottom: 20px;
}

li{
    font-family: 'Source Sans 3';
    height: 100%;
}

.nav-button{
    height: 100%;
    width: auto;
    padding: 20px;
    margin: 0;
    font-size: larger;
    border: none;
    cursor: pointer;
    background-color: rgb(255, 255, 255);
    color: rgb(134, 134, 134);
    transition: all 0.5s ease-out;
}

.nav-button:hover{
    color: rgb(84, 42, 23);
}

#filters{
  padding: 20px;
  border: none;
  border-radius: 10px;
  background-color: rgb(244, 244, 244);
  margin: 20px;
  position: absolute;
  top: 200px;
  left: 25px;
  z-index: 999;
}

#app{
    height: auto;
}
#container {
  background-color: rgb(252, 252, 252);
  display: flex;
  justify-content: center;
}

#cy {
  width: 100%;
  height: 900px;
  background-color: rgb(252, 252, 252);
}

#content {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0;
}

#popup > div > img {
  grid-row: 1 / span 2;
  border-radius: 10px;
  margin: 15px;
}

#chInfo {
  grid-column: 2;
  display: flex;
  flex-direction: column;
}

#chInfo > h4 {
  font-weight: lighter;
  font-size: small;

  color: rgb(67, 67, 67);
}

.birthPlace {
  margin: 0 0 10px 0;
  margin-left: 20px;

  font-weight: lighter;
  font-size: small;

  color: rgb(67, 67, 67);
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
</style>

<script>
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import fcose from "cytoscape-fcose";
import cola from "cytoscape-cola";
import springy from "cytoscape-springy";
import coseBilkent from "cytoscape-cose-bilkent";

cytoscape.use(dagre);
cytoscape.use(fcose);
cytoscape.use(cola);
cytoscape.use(springy);
cytoscape.use(coseBilkent);

export default {
  data() {
    return {
      showPopup: false,
      popupInfo: {},
      clickedNode: null,
      charactersData: [],
      cy: null,
      cyData: null,
    };
  },
  mounted() {
    this.fetchDataAndPopulateNodes();
    document.addEventListener("click", this.hidePopupOutside.bind(this));
  },
  methods: {
    hidePopupOutside(event) {
      var popup = document.getElementById("popup");
      if (
        popup &&
        popup.style.opacity === "1" &&
        !popup.contains(event.target) &&
        event.target !== this.clickedNode
      ) {
        popup.style.opacity = "0";
        this.clickedNode = null;
        document.removeEventListener("click", this.hidePopupOutside);
      }
    },
    saveLayout() {
      var positions = {};
      this.cy.nodes().forEach(function (node) {
        positions[node.id()] = {
          x: node.position().x,
          y: node.position().y,
        };
      });
      localStorage.setItem("savedPositions", JSON.stringify(positions));
    },
    loadLayout() {
      var savedPositions = JSON.parse(localStorage.getItem("savedPositions"));
      if(savedPositions){
        Object.entries(savedPositions).forEach(([nodeId, position]) => {
          const node = this.cy.getElementById(nodeId);
          if(node){
            node.position(position);
          }
        });
      } else{
        this.cy = cytoscape({
        container: document.getElementById("cy"),
        elements: {
          nodes: this.cyData.nodes,
          edges: this.cyData.edges,
        },

        layout: {
          name: "fcose",
          nodeRepulsion: 15000,
          randomize: true,
          idealEdgeLength: 45,
          numIter: 30000,
          nestingFactor: 1000,
          componentSpacing: 1000,
          nodeOverlap: 1000,
          animate: false,
        },

        style: [
          {
            selector: "node",
            style: {
              "background-image": (node) => {
                const info = node.data("info");
                return info.icona !== null
                  ? `url(http://95.110.132.24:8071/assets/${info.icona})`
                  : "none";
              },
              "background-fit": "cover",
              "background-color": (node) => {
                const info = node.data("info");
                if (info.icona !== null) {
                  return "transparent";
                } else {
                  return info.luogo_nascita === "Roma"
                    ? "rgb(78, 6, 105)"
                    : "rgb(0, 87, 9)";
                }
              },

              width: (node) => {
                const info = node.data("info");
                return info.virtuosa ? "55px" : "40px"; // Adjust the width based on the condition
              },
              height: (node) => {
                const info = node.data("info");
                return info.virtuosa ? "55px" : "40px"; // Adjust the height based on the condition
              },

              color: "#ffffff",
              "font-size": "12px",
            },
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": (edge) => {
                const sourceNode = edge.source();
                const targetNode = edge.target();

                const sourceInfo = sourceNode.data("info");
                const targetInfo = targetNode.data("info");

                // Check if either the source or target node is from Rome
                if (
                  sourceInfo.luogo_nascita === "Roma" ||
                  targetInfo.luogo_nascita === "Roma"
                ) {
                  return "rgb(78, 6, 105)"; // Set the line color to purple if either node is from Rome
                } else {
                  return "rgb(0, 87, 9)"; // Set a default color for edges
                }
              },
              "target-arrow-color": "rgb(0, 87, 9)",
              "target-arrow-shape": "triangle",
            },
          },
        ],
        minZoom: 0.35,
        maxZoom: 1.8,
        pan: { x: 0, y: 0 },
        boxSelectionEnabled: false,
      });
      }
    },
    async fetchDataAndPopulateNodes() {
      try {
        const charactersData = await this.retrieveData();
        this.charactersData = charactersData;
        //console.log(charactersData);
        this.cyData = this.formatDataForCytoscape(charactersData);
        //console.log(cyData);
        this.loadLayout();
        this.populateCytoscapeGraph(this.cyData);
      } catch (error) {
        console.error("Error fetching data and populating nodes: ", error);
      }
    },
    async retrieveData() {
      const response = await fetch(
        "http://95.110.132.24:8071/items/Virtuose/?limit=-1"
      );
      const responseData = await response.json();
      const data = responseData.data;
      //console.log(data);
      return data;
    },
    getCharacterName(id) {
      const character = this.charactersData.find((char) => char.id === id);
      return character ? character.nome_scelto : "Unknown";
    },
     formatDataForCytoscape(charactersData) {
      const nodes = charactersData.map((character) => ({
        data: {
          id: character.id,
          label: character.nome_scelto,
          info: character,
          relationships: { parents: [], children: [] },
        },
      }));
      const edges = this.extractEdgesFromCharacters(charactersData);
      return { nodes, edges };
    },
    extractRelatives(character) {
      const relatives = [];
      if (Array.isArray(character.figli_figlie)) {
        relatives.push(...character.figli_figlie);
      }
      if (character.madre !== null) {
        relatives.push(character.madre);
      }
      if (character.madrina !== null) {
        relatives.push(character.madrina);
      }
      if (character.marito_moglie !== null) {
        relatives.push(character.marito_moglie);
      }
      if (character.padre !== null) {
        relatives.push(character.padre);
      }
      if (character.padrino !== null) {
        relatives.push(character.padrino);
      }
      if (character.secondo_marito_moglie !== null) {
        relatives.push(character.secondo_marito_moglie);
      }
      return relatives;
    },
    extractEdgesFromCharacters(charactersData) {
      const edges = [];
      charactersData.forEach((character) => {
        const relatives = this.extractRelatives(character);
        relatives.forEach((relativeId) => {
          const sourceExists = charactersData.some(
            (char) => char.id === character.id
          );
          const targetExists = charactersData.some(
            (char) => char.id === relativeId
          );
          if (sourceExists && targetExists) {
            edges.push({
              data: {
                id: `${character.id}-${relativeId}`,
                source: character.id,
                target: relativeId,
              },
            });
          }
        });
      });
      return edges;
    },
    updateRelationships(nodes, edges) {
      edges.forEach((edge) => {
        const sourceId = edge.data.source;
        const targetId = edge.data.target;
        const sourceNode = nodes.find((node) => node.data.id === sourceId);
        const targetNode = nodes.find((node) => node.data.id === targetId);
        if (sourceNode && targetNode) {
          const sourceInfo = sourceNode.data.info;
          const targetInfo = targetNode.data.info;

          if (sourceInfo.marito_moglie === targetId) {
            // If the source is the husband of the target
            sourceNode.data.relationships.wife = targetId;
            targetNode.data.relationships.husband = sourceId;
          } else if (targetInfo.marito_moglie === sourceId) {
            // If the target is the husband of the source
            targetNode.data.relationships.wife = sourceId;
            sourceNode.data.relationships.husband = targetId;
          } else if (sourceInfo.padre === targetId) {
            // If the source is the father of the target
            sourceNode.data.relationships.children.push(targetId);
            targetNode.data.relationships.parents.push(sourceId);
          } else if (targetInfo.padre === sourceId) {
            // If the target is the father of the source
            targetNode.data.relationships.children.push(sourceId);
            sourceNode.data.relationships.parents.push(targetId);
          }
        }
      });
    },
    populateCytoscapeGraph() {

      // Disable built-in panning

      this.cy.userPanningEnabled(false);

      // Define variables for custom panning
      let isPanning = false;
      let initialPointerPosition = { x: 0, y: 0 };

      var nodeClicked = false;

      // Add mouse event listeners for custom panning
      const cyContainer = document.getElementById("cy");

      cyContainer.addEventListener("mousedown", (event) => {
        // Check if the click occurred outside of nodes
        //const target = cy.$(event.target);
        if (nodeClicked) {
          isPanning = false;
        } else {
          isPanning = true;
          initialPointerPosition = { x: event.clientX, y: event.clientY };
        }
      });

      this.cy.on("grab", "node", (event) => {
        nodeClicked = true;
        isPanning = false;

        // Prevent event propagation to the DOM
        event.stopPropagation();
      });

      cyContainer.addEventListener("mousemove", (event) => {
        if (isPanning === true) {
          var deltaX = event.clientX - initialPointerPosition.x;
          var deltaY = event.clientY - initialPointerPosition.y;
          var currentPan = this.cy.pan();

          const maxX = cyContainer.offsetWidth;
          const maxY = cyContainer.offsetHeight;
          const minX = -cyContainer.offsetWidth * 0.5;
          const minY = -cyContainer.offsetHeight * 0.5;

          const limitedPan = {
            x: Math.min(Math.max(currentPan.x + deltaX, minX), maxX), // Adjust the panning boundaries as needed
            y: Math.min(Math.max(currentPan.y + deltaY, minY), maxY),
          };

          this.cy.pan(limitedPan);
          initialPointerPosition = { x: event.clientX, y: event.clientY };
        }
      });

      cyContainer.addEventListener("mouseup", () => {
        if (nodeClicked) {
          nodeClicked = false;
        }
        isPanning = false;
      });

      cyContainer.addEventListener("wheel", (event) => {
        let cursorX = event.clientX;
        let cursorY = event.clientY;
        const containerRect = cyContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        if (event.ctrlKey || event.metaKey) {
          return; // Let the default zoom behavior handle it
        }
        const zoomAmount = event.deltaY > 0 ? -0.1 : 0.1; // Change the zoom amount as needed
        //const containerRect = cyContainer.getBoundingClientRect();

        let cyRelativePosition = {
          x: cursorX - containerWidth / 2,
          y: cursorY - containerHeight / 2,
        };

        console.log(cyRelativePosition);

        this.cy.zoom({
          level: this.cy.zoom() + zoomAmount,
          position: cyRelativePosition,
        });
        event.preventDefault(); // Prevent default scrolling behavior
      });

      this.cy.ready(() => {
        this.cy.zoom(0.55);
      });

      var popup = document.createElement("div");
      popup.id = "popup";
      popup.style.opacity = "0";
      document.getElementById("cy").appendChild(popup);

      this.cy.on("click", "node", (event) => {
        var node = event.target;
        var info = node.data("info");
        this.clickedNode = node;

        this.popupInfo = info;
        this.showPopup = true;

        const imageSrc =
          info.icona !== null
            ? `http://95.110.132.24:8071/assets/${info.icona}`
            : "";
        const noteSection = info.note ? `<p><b>Info:</b> ${info.note}</p>` : "";
        const birthPlace =
          info.luogo_nascita === "Roma" || info.luogo_nascita === "Firenze"
            ? `${info.luogo_nascita}`
            : "";
        const fatherSection = info.padre
          ? `<p><b>Padre:</b> ${this.getCharacterName(info.padre)}</p>`
          : "";
        const motherSection = info.madre
          ? `<p><b>Madre:</b> ${this.getCharacterName(info.madre)}</p>`
          : "";
        const spouseSection = info.marito_moglie
          ? `<p><b>Marito/Moglie:</b> ${this.getCharacterName(
              info.marito_moglie
            )}</p>`
          : "";
        const childrenSection =
          info.figli_figlie && info.figli_figlie.length > 0
            ? `<p><b>Figli/Figlie:</b> ${info.figli_figlie
                .map((childId) => this.getCharacterName(childId))
                .join(", ")}</p>`
            : "";

        // Construct the popup content
        popup.innerHTML = `
        <div id="content">
          ${
            imageSrc !== ""
              ? `<img src="${imageSrc}" style="max-width:250px;max-height:300px;" alt="Icona">`
              : ""
          }
            <div id="chInfo">
              <h3 style="margin-left:10px"><b><i>${
                info.nome_scelto
              }</i></b></h3>
              <h4 class="birthPlace" style="margin:-3px 0 0 9px;font-weight:400;"><i>${birthPlace}</i></h4>
                ${fatherSection}
                ${motherSection}
                ${spouseSection}
                ${childrenSection}
                ${noteSection}
            </div>
        </div>
    `;
        var position = event.target.renderedPosition();
        var cyContainer = document.getElementById("cy");

        var popupOffsetX = -550;
        var popupOffsetY = -800;
        var popupPositionX = Math.min(
          position.x + popupOffsetX,
          cyContainer.offsetWidth - popup.offsetWidth
        );
        var popupPositionY = Math.min(
          position.y + popupOffsetY,
          cyContainer.offsetHeight - popup.offsetHeight
        );

        popup.style.transform = `translate(${popupPositionX}px, ${popupPositionY}px)`;

        setTimeout(function () {
          // Show the popup
          popup.style.width = "500px";
          popup.style.height = "auto";
          popup.style.opacity = "1";

          // Add event listener to hide the popup when clicking outside of it
          document.addEventListener("click", this.hidePopupOutside);
        }, 200);

        event.stopPropagation();
      });
    },
  },
};
</script>
