<template>
  <div>
    <div id="cy"></div>
  </div>
</template>

<style scoped>
#cy {
  width: 100%;
  height: 800px;
  background-color: rgb(255, 246, 232);
  padding: 50px;
}

#popup > div {
  display: grid;
  grid-template-columns: auto auto;
  gap: 20px;
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
    async fetchDataAndPopulateNodes() {
      try {
        const charactersData = await this.retrieveData();
        this.charactersData = charactersData;
        //console.log(charactersData);
        const cyData = this.formatDataForCytoscape(charactersData);
        console.log(cyData);
        this.populateCytoscapeGraph(cyData);
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
    populateCytoscapeGraph(cyData) {
      var cy = cytoscape({
        container: document.getElementById("cy"),
        elements: {
          nodes: cyData.nodes,
          edges: cyData.edges,
        },

        layout: {
          name: "fcose",
          nodeRepulsion: 10000,
          randomize: true,
          idealEdgeLength: 50,
          numIter: 30000,
          nestingFactor: 1000,
          componentSpacing: 1000,
          nodeOverlap: 1000,
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
                return info.icona !== null ? "transparent" : "rgb(0, 87, 9)";
              },

              width: "40px",
              height: "40px",
              label: "data(id)", // This will set the label of each node to be its ID
              "text-valign": "center", // Align the label vertically in the center
              "text-halign": "center",
              color: "#ffffff",
              "font-size": "12px",
            },
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "rgb(0, 87, 9)",
              "target-arrow-color": "rgb(0, 87, 9)",
              "target-arrow-shape": "triangle",
            },
          },
        ],
        minZoom: 0.25,
        maxZoom: 2,
        pan: { x: 0, y: 0 },
        boxSelectionEnabled: false,
      });

      // Disable built-in panning
      cy.userPanningEnabled(false);

      // Define variables for custom panning
      let isPanning = false;
      let initialPointerPosition = { x: 0, y: 0 };

      // Add mouse event listeners for custom panning
      const cyContainer = document.getElementById("cy");

      cyContainer.addEventListener("mousedown", (event) => {
        console.log("X: ", event.clientX, "Y: ", event.clientY);
        if (event.target && event.target.isNode && event.target.isNode()) {
          isPanning = false;
          console.log("Node being dragged");
        } else {
          console.log("Panning");
          isPanning = true;
          initialPointerPosition = { x: event.clientX, y: event.clientY };
        }
      });

      cyContainer.addEventListener("mousemove", (event) => {
        if (isPanning) {
          const deltaX = event.clientX - initialPointerPosition.x;
          const deltaY = event.clientY - initialPointerPosition.y;
          const currentPan = cy.pan();
          const limitedPan = {
            x: Math.min(Math.max(currentPan.x + deltaX, -300), 2400), // Adjust the panning boundaries as needed
            y: Math.min(Math.max(currentPan.y + deltaY, -300), 900),
          };
          cy.pan(limitedPan);
          initialPointerPosition = { x: event.clientX, y: event.clientY };
        }
      });

      cyContainer.addEventListener("mouseup", () => {
        isPanning = false;
      });

      cyContainer.addEventListener("wheel", (event) => {
        if (event.ctrlKey || event.metaKey) {
          return; // Let the default zoom behavior handle it
        }
        const zoomAmount = event.deltaY > 0 ? -0.1 : 0.1; // Change the zoom amount as needed
        const containerRect = cyContainer.getBoundingClientRect();
        const pointerPosition = {
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
        };
        const cyRelativePosition = {
          x: pointerPosition.x / cy.width(),
          y: pointerPosition.y / cy.height(),
        };

        cy.zoom({
          level: cy.zoom() + zoomAmount,
          position: cyRelativePosition,
        });
        event.preventDefault(); // Prevent default scrolling behavior
      });

      cy.ready(() => {
        cy.zoom(0.55);
      });

      var popup = document.createElement("div");
      popup.id = "popup";
      popup.style.opacity = "0";
      document.getElementById("cy").appendChild(popup);

      cy.on("click", "node", (event) => {
        var node = event.target;
        var info = node.data("info");
        this.clickedNode = node;

        this.popupInfo = info;
        this.showPopup = true;

        const imageSrc =
          info.icona !== null
            ? `http://95.110.132.24:8071/assets/${info.icona}`
            : "";
        const noteSection = info.note ? `<p>Info: ${info.note}</p>` : "";
        const fatherSection = info.padre
          ? `<p>Padre: ${this.getCharacterName(info.padre)}</p>`
          : "";
        const motherSection = info.madre
          ? `<p>Madre: ${this.getCharacterName(info.madre)}</p>`
          : "";
        const spouseSection = info.marito_moglie
          ? `<p>Marito/Moglie: ${this.getCharacterName(info.marito_moglie)}</p>`
          : "";
        const childrenSection =
          info.figli_figlie && info.figli_figlie.length > 0
            ? `<p>Figli/Figlie: ${info.figli_figlie
                .map((childId) => this.getCharacterName(childId))
                .join(", ")}</p>`
            : "";

        // Construct the popup content
        popup.innerHTML = `
        <div id="container">
          ${
            imageSrc !== ""
              ? `<img src="${imageSrc}" width="250px" alt="Icona">`
              : ""
          }
            <div id="chInfo">
              <p><i>ID: ${info.id}</i></p>  
              <p><b>${info.nome_scelto}</b></p>
                ${noteSection}
                ${fatherSection}
                ${motherSection}
                ${spouseSection}
                ${childrenSection}
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
