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
import fcose from 'cytoscape-fcose';
import cola from 'cytoscape-cola';
import springy from 'cytoscape-springy';
import coseBilkent from 'cytoscape-cose-bilkent';

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
      console.log(charactersData);
      const cyData = this.formatDataForCytoscape(charactersData);
      this.populateCytoscapeGraph(cyData);
    },
    async retrieveData() {
      const response = await fetch('http://95.110.132.24:8071/items/Virtuose/?limit=-1');
      const responseData = await response.json();
      const data = responseData.data;
      console.log(data);
      return data;
    },
    getCharacterName(id) {
      const character = this.charactersData.find(char => char.id === id);
      return character ? character.nome_scelto : 'Unknown';
    },
    formatDataForCytoscape(charactersData) {
      const nodes = charactersData.map(character => ({
        data: {
          id: character.id,
          label: character.nome_scelto,
          info: character
        }
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
      charactersData.forEach(character => {
        const relatives = this.extractRelatives(character);
        relatives.forEach(relativeId => {
          const sourceExists = charactersData.some(char => char.id === character.id);
          const targetExists = charactersData.some(char => char.id === relativeId);
          if (sourceExists && targetExists) {
            edges.push({ data: { id: `${character.id}-${relativeId}`, source: character.id, target: relativeId } });
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
          edges: cyData.edges
        },


        layout: {
          name: 'fcose',
          nodeRepulsion: 10000,
          randomize: true,
          idealEdgeLength: 75,
          numIter: 25000,
          nestingFactor: 500,
          componentSpacing: 500,
          nodeOverlap: 500,
        },

        /*
         layout: {
           name: 'springy',
           nodeDistance: 400,
           iterations: 1000,
           randomize: true,
           springCoeff: 0.0008,
           springLength: 350,
           stiffness: 1,
         },
         */

        /*
         layout: {
           name: 'cose-bilkent',
           nodeRepulsion: 500,
           idealEdgeLength: 200,
           nestingFactor: 0,
           gravity: 2,
           numIter: 15000,
           randomize: true,
         },
         */

        style: [
          {
            selector: "node",
            style: {
              "background-color": "rgb(0, 87, 9)",
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
      });

      cy.ready(() => {
        cy.zoom(0.55);
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

        // Check if the character has an image reference
        const imageSrc = info.icona ? `http://95.110.132.24:8071/assets/${info.icona}` : 'placeholder-image-url';
        // Check if the character has a note
        const noteSection = info.note ? `<p>Info: ${info.note}</p>` : '';
        // Check if the character has a father
        const fatherSection = info.padre ? this.getCharacterName(info.padre) : '';
        // Check if the character has a mother
        const motherSection = info.madre ? this.getCharacterName(info.madre) : '';
        // Check if the character has a spouse
        const spouseSection = info.marito_moglie ? this.getCharacterName(info.marito_moglie) : '';
        // Check if the character has children
        const childrenSection = info.figli_figlie && info.figli_figlie.length > 0 ?
          `<p>Figli/Figlie: ${info.figli_figlie.map(childId => this.getCharacterName(childId)).join(', ')}</p>` : '';

        // Construct the popup content
        popup.innerHTML = `
        <div>
            <img src="${imageSrc}" alt="Icona">
            <div>
              <p>Id: ${info.id}</p>  
              <p><b>${info.nome_scelto}</b></p>
                ${noteSection}
                ${fatherSection}
                ${motherSection}
                ${spouseSection}
                ${childrenSection}
            </div>
        </div>
    `;


        /*
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
        */

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
