<template>
  <div>
    <div id="cy"></div>
  </div>
</template>

<style scoped>
#cy {
  width: 100%;
  height: 650px;
  background-color: rgb(255, 246, 232);
  padding: 50px;
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

<script>
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

export default {
  data() {
    return {
      showPopup: false,
      popupInfo: {},
      clickedNode: null
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
      const charactersData = await this.retrieveData();
      const cyData = this.formatDataForCytoscape(charactersData);
      this.populateCytoscapeGraph(cyData);
    },
    async retrieveData() {
      const response = await fetch('https://crm-api-url/characters');
      const data = await response.json();
      return data;
    },
    formatDataForCytoscape(charactersData) {
      const nodes = charactersData.map(character => ({
        data: { id: character.id, label: character.name }
      }));
      const edges = this.extractEdgesFromCharacters(charactersData);
      return { nodes, edges };
    },
    extractEdgesFromCharacters(charactersData) {
      const edges = [];
      charactersData.forEach(character => {
        character.relatives.forEach(relativeId => {
          edges.push({ data: { id: `${character.id}-${relativeId}`, source: character.id, target: relativeId } });
        });
      });
      return edges;
    },
    populateCytoscapeGraph(cyData) {
      var cy = cytoscape({
        container: document.getElementById("cy"),
        elements: {
          nodes: cyData.nodes,
          edges: cyData.edges
        },
        layout: {
          name: 'dagre',
          nodeSep: 100,
          rankSep: 100,
          rankDir: 'TB',
        },
        style: [
          {
            selector: "node",
            style: {
              "background-color": "rgb(0, 87, 9)",
              width: "30px",
              height: "30px",
              border: "solid 1px #ccc",
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
      });

      cy.ready(() => {
        cy.zoom(0.75);
      })

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

        popup.innerHTML = `
          <div>
            <img src="${info.picture}" alt="Profile Picture">
            <div>
              <p>Name: ${info.firstName} ${info.lastName}</p>
              <p>Email: ${info.email}</p>
              <p>Phone: ${info.phone}</p>
            </div>
          </div>
        `;

        var position = node.renderedPosition();

        var popupOffsetX = -400;
        var popupOffsetY = -600;
        var popupPositionX = position.x + popupOffsetX;
        var popupPositionY = position.y + popupOffsetY;

        popup.style.transform = `translate(${popupPositionX}px, ${popupPositionY}px)`;

        setTimeout(function () {
          // Show the popup
          popup.style.width = "400px";
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
