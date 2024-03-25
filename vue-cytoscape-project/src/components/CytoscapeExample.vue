<template>
  <div id="banner">
    <img src="../assets/vidimus_r.png" alt="" height="100px" />
    <div id="title">VIdiMUS - <i>Le Virtuose di musica</i></div>
  </div>
  <hr />
  <div id="nav-container">
    <ul id="nav">
      <li>
        <button class="nav-button" @click="displayGraph()">
          <img src="../assets/network_149181.png" alt="" width="40px" />
          <div class="btn-text">LE VIRTUOSE</div>
        </button>
      </li>
      <li>
        <button class="nav-button" @click="displayEvents()">
          <img src="../assets/calendar_2838779.png" alt="" width="40px" />
          <div class="btn-text">EVENTI</div>
        </button>
      </li>
      <li>
        <button class="nav-button">
          <img src="../assets/searching_6898982.png" alt="" width="40px" />
          <div class="btn-text">FONTI</div>
        </button>
      </li>
      <li>
        <button class="nav-button">
          <img src="../assets/guitar_96421.png" alt="" width="40px" />
          <div class="btn-text">REPERTORIO</div>
        </button>
      </li>
    </ul>
  </div>
  <hr />
  <div v-show="showCytoscape">
    <!-- <select class="select" v-model="filter" @change="toggleFilter" id="filter">
      <option value="family">La rete della famiglia</option>
      <option value="work">La rete dei maestri e dei mecenati</option>
      <option value="all">Il network</option>
    </select> -->
    <div id="nav-container">
      <ul id="nav">
        <li>
          <button class="nav-button" @click="toggleFilter('family')">
            <div class="btn-text filters">Famiglia</div>
          </button>
        </li>
        <li>
          <button class="nav-button" @click="toggleFilter('work')">
            <div class="btn-text filters">Lavoro</div>
          </button>
        </li>
        <li>
          <button class="nav-button" @click="toggleFilter('all')">
            <div class="btn-text filters">Network</div>
          </button>
        </li>
        <li>
          <div class="dropdown">
            <button class="nav-button dropbtn btn-text filters" @click="toggleDropdown">{{ dropdownLabel }}</button>
            <div class="dropdown-content btn-text filters" v-show="showDropdown">
              <button class="nav-button dd-content btn-text filters" v-for="event in eventsData" :key="event.id" @click="selectEvent(event)">
                <div class="btn-text filters">{{ event.data }}, {{ event.luogo }}</div>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- <select
      class="select"
      v-model="selectedEvent"
      @change="filterGraph"
      id="filters"
      v-show="eventFilter"
    >
      <option value="" selected>Filtrare per eventi</option>
      <option v-for="event in eventsData" :key="event.id" :value="event.id">
        {{ event.data }}, {{ event.luogo }}
      </option>
    </select> -->
    <div id="container">
      <div id="cy"></div>
    </div>
  </div>
  <div id="events" v-show="showEventList">
    <h1>Eventi</h1>
    <div v-for="event in eventsData" :key="event.id" :value="event.id">
      <div id="event">
        <h2>{{ event.data }}, {{ event.luogo }}</h2>
        <p v-if="event.note !== null">{{ event.note }}</p>
        <hr />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@400..800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montaga&display=swap");

* {
  margin: 0;
  padding: 0;
}

body {
  min-width: 100vh;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
}

hr {
  width: 100%;
  margin-bottom: 20px;
  border: none;
  height: 3px;
  background-color: rgb(120, 38, 46);
}

#banner {
  display: flex;
  min-height: 170px;
  text-align: center;
  background-color: rgb(255, 255, 255);
  color: rgb(120, 38, 46);
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 100%;
}

#title {
  font-family: Montaga;
  font-size: 28px;
  margin-top: 70px;
}

#banner > img {
  left: 30px;
  position: absolute;
}

#circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: none;
  border: solid 2px red;
}

#nav-container {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
}

#nav {
  display: flex;
  flex-direction: row;
  gap: 30px;
  list-style: none;
  list-style-type: none;
  height: 100%;
  background-color: rgb(255, 255, 255);
  margin-bottom: 20px;
}

li {
  height: 100%;
}

.nav-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: auto;
  padding: 20px;
  margin: 0;
  font-size: larger;
  border: none;
  cursor: pointer;
  background-color: rgb(255, 255, 255);
  color: rgb(76, 76, 76);
  transition: all 0.5s ease-out;
}

.filters {
  font-weight: 500 !important;
}

.nav-button:hover {
  background-color: rgb(120, 38, 46);
  color: aliceblue;
}

.nav-button:hover img {
  filter: invert(100%);
}

.nav-button:hover .btn-text {
  color: white;
}

.nav-button > img {
  margin-right: 15px;
  transition: all 0.5s ease-out;
}

.btn-text {
  font-family: Montserrat;
  font-weight: 600;
  transition: all 0.5s ease-out;
}

.dropdown{
  position: relative;
  display: inline-block;
}

.dropdown-content{
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 1000;
}

.dd-content{
  font-size: medium;
  min-width: 200px;
  text-align: center;
}

.select {
  max-width: 240px;
  padding: 10px 20px;
  border: solid 1px rgb(120, 38, 46);
  border-radius: 10px;
  background-color: rgb(244, 244, 244);
  margin: 20px;
  z-index: 999;
  overflow: visible;
}

#events {
  padding-bottom: 50px;
  padding-top: 40px;
}

#events > h1 {
  font-family: Montserrat;
  text-align: center;
  color: rgb(100, 9, 18);
}

#event {
  margin: 60px;
}

#event > h2 {
  font-family: "Source Sans 3";
  margin: 20px;
}

#event > p {
  font-family: "Source Sans 3";
  margin: 20px;
}

#app {
  height: auto;
}
#container {
  margin-top: 50px;
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
  text-align: center;
  justify-content: center;
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
      showCytoscape: true,
      showEventList: false,
      showPopup: false,

      isPanning: false,
      initialPointerPosition: { x: 0, y: 0 },
      nodeClicked: false,
      popupInfo: {},
      clickedNode: null,

      charactersData: [],
      relationsData: [],
      maestroRelations: [],
      mecenatiRelations: [],
      eventsData: [],

      cy: null,
      cyData: null,
      filter: "family",
      eventFilter: false,
      layout1: {
        name: "fcose",
        nodeRepulsion: 35000,
        randomize: true,
        idealEdgeLength: 50,
        numIter: 30000,
        nestingFactor: 1000,
        componentSpacing: 1000,
        nodeOverlap: 10000,
        animate: false,
      },
      layout2: {
        name: "fcose",
        nodeRepulsion: 100000,
        randomize: true,
        idealEdgeLength: 45,
        numIter: 300000,
        nestingFactor: 10000,
        componentSpacing: 1000,
        nodeOverlap: 100,
        animate: false,
      },
      layoutConfig: null,

      baseUrl: window.location.origin,

      showDropdown: false,
      dropdownLabel: 'Eventi', 
      selectedEvent: null,
    };
  },
  mounted() {
    this.fetchDataAndPopulateNodes();
    document.addEventListener("click", this.hidePopupOutside.bind(this));
  },
  methods: {
    displayGraph() {
      this.showEventList = false;
      this.showCytoscape = true;
    },
    displayEvents() {
      this.showCytoscape = false;
      this.showEventList = true;
    },
    async toggleFilter(filterValue) {
      if (this.filter !== filterValue) {
        this.filter = filterValue;
        await this.fetchDataAndPopulateNodes();
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown; // Toggle the dropdown menu
    },
    selectEvent(event) {
      this.selectedEvent = event.id; // Set the selected event
      this.toggleDropdown(); // Hide the dropdown after selecting an event
      this.filterGraph(); // You can call your filterGraph method here or perform any other action
    },
    hidePopupOutside(event) {
      var popup = document.getElementById("popup");
      if (
        popup &&
        popup.style.opacity === "1" &&
        !popup.contains(event.target) &&
        event.target !== this.clickedNode
      ) {
        popup.style.opacity = "0";
        popup.style.zIndex = "-999";
        this.clickedNode = null;
        document.removeEventListener("click", this.hidePopupOutside);
      }
    },
    getNodeSize(node) {
      const connections = node.connectedEdges().length;
      const baseSize = 35;
      const sizeIncrement = 5;
      const maxSize = 65;

      // Calculate the size based on connections
      let size = baseSize + connections * sizeIncrement;

      // Limit the size to the maximum allowed size
      size = Math.min(size, maxSize);

      return size;
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
      if (savedPositions) {
        Object.entries(savedPositions).forEach(([nodeId, position]) => {
          const node = this.cy.getElementById(nodeId);
          if (node) {
            node.position(position);
          }
        });
      } else {
        if (this.filter === "all") {
          this.layoutConfig = this.layout2;
        } else {
          this.layoutConfig = this.layout1;
        }
        this.cy = cytoscape({
          container: document.getElementById("cy"),
          elements: {
            nodes: this.cyData.nodes,
            edges: this.cyData.edges,
          },

          layout: this.layoutConfig,

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
                // "background-color": (node) => {
                //   const info = node.data("info");
                //   if (info.icona !== null) {
                //     return "transparent";
                //   } else {
                //     return info.luogo_nascita === "Roma"
                //       ? "rgb(78, 6, 105)"
                //       : "rgb(36, 68, 196)";
                //   }
                // },
                "background-color": "#96b8d2",

                "border-width": (node) => {
                  const info = node.data("info");
                  return info.virtuosa ? "6px" : "0";
                },
                "border-color": (node) => {
                  const info = node.data("info");
                  return info.virtuosa ? "rgb(120, 38, 46)" : "transparent";
                },

                //label: "data(id)",
                "text-valign": "center",
                "text-halign": "center",

                width: "45px",
                height: "45px",

                color: "#ffffff",
                "font-size": "12px",
              },
            },
            {
              selector: "edge",
              style: {
                width: 3,
                "line-color": (edge) => {
                  const relation = edge.data();
                  if (relation.type === "work") {
                    return "red"; // Set the line color to purple if either node is from Rome
                  } else {
                    return "#96b8d2"; // Set a default color for edges
                  }
                },
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
    // kkkkkkkk
    async fetchDataAndPopulateNodes() {
      try {
        const charactersData = await this.retrieveData();
        this.charactersData = charactersData;

        const eventsData = await this.retrieveEvents();
        this.eventsData = eventsData;

        if (this.filter === "family" || this.filter === "all") {
          this.eventFilter = false;
          const relationsData = await this.retrieveRelations();
          this.relationsData = relationsData;
        }

        if (this.filter === "work" || this.filter === "all") {
          this.eventFilter = true;

          const maestroRelations = await this.retrieveMaestroRelations();
          this.maestroRelations = maestroRelations;
          const mecenatiRelations = await this.retrieveMecenatiRelations();
          this.mecenatiRelations = mecenatiRelations;

          const maestroData = await this.retrieveMaestroData();
          const mecenatiData = await this.retrieveMecenatiData();

          const combinedMaestroData = this.combineMaestroData(
            maestroRelations,
            maestroData
          );
          const combinedMecenatiData = this.combineMecenatiData(
            mecenatiRelations,
            mecenatiData
          );

          this.updateCharacterMaestroRelations(combinedMaestroData);
          this.updateCharacterMecenatiRelations(combinedMecenatiData);
        }

        this.combineData();

        this.cyData = this.formatDataForCytoscape(
          charactersData,
          this.maestroRelations,
          this.mecenatiRelations
        );

        //console.log(cyData);
        this.loadLayout();
        this.populateCytoscapeGraph();
        this.addCytoscapeEventListeners();
      } catch (error) {
        console.error("Error fetching data and populating nodes: ", error);
      }
    },
    async retrieveData() {
      const response = await fetch(
        "http://95.110.132.24:8071/items/Virtuose?filter[pubblicato][_eq]=1"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveRelations() {
      const response = await fetch(
        "http://95.110.132.24:8071/items/Virtuose_Virtuose"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveEvents() {
      try {
        const response = await fetch("http://95.110.132.24:8071/items/eventi");
        const eventData = await response.json();
        const events = eventData.data;
        return events;
      } catch (error) {
        console.error("Error fetching events: ", error);
        throw error;
      }
    },
    async retrieveEventRelations() {
      try {
        const response = await fetch(
          "http://95.110.132.24:8071/items/Virtuose_eventi"
        );
        const responseData = await response.json();
        const data = responseData.data;
        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },
    async retrieveMaestroRelations() {
      try {
        const response = await fetch(
          "http://95.110.132.24:8071/items/Virtuose_maestro"
        );
        const responseData = await response.json();
        const maestroRelations = responseData.data;

        return maestroRelations;
      } catch (error) {
        console.error("Error fetching maestro relations data: ", error);
        throw error;
      }
    },
    async retrieveMaestroData() {
      try {
        const response = await fetch("http://95.110.132.24:8071/items/maestro");
        const responseData = await response.json();
        const maestroData = responseData.data;

        return maestroData;
      } catch (error) {
        console.error("Error fetching maestro relations data: ", error);
        throw error;
      }
    },
    async retrieveMecenatiRelations() {
      try {
        const response = await fetch(
          "http://95.110.132.24:8071/items/Virtuose_mecenati"
        );
        const responseData = await response.json();
        const data = responseData.data;

        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },
    async retrieveMecenatiData() {
      try {
        const response = await fetch(
          "http://95.110.132.24:8071/items/mecenati"
        );
        const responseData = await response.json();
        const data = responseData.data;

        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },
    combineData() {
      // Merge relationships data with characters data
      this.charactersData.forEach((character) => {
        const figliFiglieIds = character.figli_figlie;
        const relatedCharacters = this.relationsData.filter((relation) =>
          figliFiglieIds.includes(relation.id)
        );
        // Replace figli_figlie IDs with related character IDs
        character.figli_figlie = relatedCharacters.map(
          (relation) => relation.related_Virtuose_id
        );
      });
    },
    combineMaestroData(maestroRelations, maestroData) {
      return maestroRelations.map((relation) => {
        const maestro = maestroData.find(
          (maestro) => maestro.id === relation.maestro_id
        );
        return {
          relation,
          maestro,
        };
      });
    },
    combineMecenatiData(mecenatiRelations, mecenatiData) {
      return mecenatiRelations.map((relation) => {
        const mecenati = mecenatiData.find(
          (mecenati) => mecenati.id === relation.mecenati_id
        );
        return {
          relation,
          mecenati,
        };
      });
    },
    // Function to update character data with maestro relations
    updateCharacterMaestroRelations(combinedMaestroData) {
      combinedMaestroData.forEach(({ relation, maestro }) => {
        const character = this.charactersData.find(
          (char) => char.id === relation.Virtuose_id
        );
        if (character) {
          // Update character's maestro relations
          if (!character.maestro) {
            character.maestro = [];
          }
          character.maestro.push(maestro.id);
        }
      });
    },
    updateCharacterMecenatiRelations(combinedMecenatiData) {
      combinedMecenatiData.forEach(({ relation, mecenati }) => {
        const character = this.charactersData.find(
          (char) => char.id === relation.Virtuose_id
        );
        if (character) {
          // Update character's maestro relations
          if (!character.mecenati) {
            character.mecenati = [];
          }
          character.mecenati.push(mecenati.id);
        }
      });
    },
    getCharacterName(id) {
      const character = this.charactersData.find((char) => char.id === id);
      return character ? character.nome_scelto : "Non conosciuto";
    },
    formatDataForCytoscape(
      charactersData,
      maestroRelations,
      mecenatiRelations
    ) {
      const nodes = charactersData.map((character) => ({
        data: {
          id: character.id,
          label: character.nome_scelto,
          info: character,
          relationships: {
            mother: null,
            father: null,
            children: [],
            spouse: null,
            maestro: [],
            mecenati: [],
          },
        },
      }));

      maestroRelations.forEach((relation) => {
        const node = nodes.find(
          (node) => node.data.id === relation.Virtuose_id
        );
        if (node) {
          node.data.relationships.maestro.push(relation.maestro_id);
        }
      });

      mecenatiRelations.forEach((relation) => {
        const node = nodes.find(
          (node) => node.data.id === relation.Virtuose_id
        );
        if (node) {
          node.data.relationships.mecenati.push(relation.mecenati_id);
        }
      });

      const edges = this.extractEdgesFromCharacters(
        charactersData,
        maestroRelations,
        mecenatiRelations
      );
      this.updateRelationships(nodes, edges);
      return { nodes, edges };
    },
    extractRelatives(character, maestroRelations, mecenatiRelations) {
      const relatives = [];
      if (this.filter === "family" || this.filter === "all") {
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
      }
      if (this.filter === "work" || this.filter === "all") {
        maestroRelations.forEach((relation) => {
          if (relation.Virtuose_id === character.id) {
            relatives.push(relation.maestro_id);
          }
        });
        mecenatiRelations.forEach((relation) => {
          if (relation.Virtuose_id === character.id) {
            relatives.push(relation.mecenati_id);
          }
        });
      }
      return relatives;
    },
    extractEdgesFromCharacters(
      charactersData,
      maestroRelations,
      mecenatiRelations
    ) {
      const edges = [];
      charactersData.forEach((character) => {
        const relatives = this.extractRelatives(
          character,
          maestroRelations,
          mecenatiRelations
        );
        relatives.forEach((relativeId) => {
          const sourceExists = charactersData.some(
            (char) => char.id === character.id
          );
          const targetExists = charactersData.some(
            (char) => char.id === relativeId
          );
          if (sourceExists && targetExists) {
            let relationType = "family";
            if (
              maestroRelations.some(
                (relation) =>
                  relation.Virtuose_id === character.id &&
                  relation.maestro_id === relativeId
              )
            ) {
              relationType = "work";
            } else if (
              mecenatiRelations.some(
                (relation) =>
                  relation.Virtuose_id === character.id &&
                  relation.mecenati_id === relativeId
              )
            ) {
              relationType = "work";
            }
            edges.push({
              data: {
                id: `${character.id}-${relativeId}`,
                source: character.id,
                target: relativeId,
                type: relationType,
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
            // If the source is the spouse of the target
            sourceNode.data.relationships.spouse = targetId;
            targetNode.data.relationships.spouse = sourceId;
          }
          if (targetInfo.marito_moglie === sourceId) {
            // If the target is the spouse of the source
            targetNode.data.relationships.spouse = sourceId;
            sourceNode.data.relationships.spouse = targetId;
          }
          if (sourceInfo.padre === targetId) {
            // If the source is the father of the target
            if (!targetNode.data.relationships.children.includes(sourceId)) {
              targetNode.data.relationships.children.push(sourceId);
            }
            sourceNode.data.relationships.father = targetId;
          }
          if (targetInfo.padre === sourceId) {
            // If the target is the father of the source
            if (!sourceNode.data.relationships.children.includes(targetId)) {
              sourceNode.data.relationships.children.push(targetId);
            }
            targetNode.data.relationships.father = sourceId;
          }
          if (sourceInfo.madre === targetId) {
            // If the target is the mother of the source
            if (!targetNode.data.relationships.children.includes(sourceId)) {
              targetNode.data.relationships.children.push(sourceId);
            }
            sourceNode.data.relationships.mother = targetId;
          }
          if (targetInfo.madre === sourceId) {
            // If the target is the mother of the source
            if (!sourceNode.data.relationships.children.includes(targetId)) {
              sourceNode.data.relationships.children.push(targetId);
            }
            targetNode.data.relationships.mother = sourceId;
          }
          // Update child relationship data
          const sourceChildren = sourceInfo.figli_figlie;
          const targetChildren = targetInfo.figli_figlie;

          if (sourceChildren && sourceChildren.includes(targetId)) {
            if (!sourceNode.data.relationships.children.includes(targetId)) {
              sourceNode.data.relationships.children.push(targetId);
            }
            if (sourceNode.data.info.sesso === "M") {
              targetNode.data.relationships.father = sourceId;
            } else if (sourceNode.data.info.sesso === "F") {
              targetNode.data.relationships.mother = sourceId;
            }
          }

          if (targetChildren && targetChildren.includes(sourceId)) {
            if (!targetNode.data.relationships.children.includes(sourceId)) {
              targetNode.data.relationships.children.push(sourceId);
            }
            if (targetNode.data.info.sesso === "M") {
              sourceNode.data.relationships.father = targetId;
            } else if (sourceNode.data.info.sesso === "F") {
              sourceNode.data.relationships.mother = targetId;
            }
          }
        }
      });
    },
    removeCytoscapeEventListeners() {
      const cyContainer = document.getElementById("cy");

      cyContainer.removeEventListener("mousedown", this.handleMouseDown);
      cyContainer.removeEventListener("mousemove", this.handleMouseMove);
      cyContainer.removeEventListener("mouseup", this.handleMouseUp);
      cyContainer.removeEventListener("wheel", this.handleWheel);

      this.cy.off("click", "node", this.handleNodeClick);
      this.cy.off("grab", "node", this.handleNodeGrab);
    },
    handleMouseDown(event) {
      if (this.nodeClicked) {
        this.isPanning = false;
      } else {
        this.isPanning = true;
        this.initialPointerPosition = { x: event.clientX, y: event.clientY };
      }
    },
    handleMouseMove(event) {
      const cyContainer = document.getElementById("cy");
      if (this.isPanning === true) {
        var deltaX = event.clientX - this.initialPointerPosition.x;
        var deltaY = event.clientY - this.initialPointerPosition.y;
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
        this.initialPointerPosition = { x: event.clientX, y: event.clientY };
      }
    },
    handleMouseUp() {
      if (this.nodeClicked) {
        this.nodeClicked = false;
      }
      this.isPanning = false;
    },
    handleWheel(event) {
      const cyContainer = document.getElementById("cy");
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

      // console.log(cyRelativePosition);

      this.cy.zoom({
        level: this.cy.zoom() + zoomAmount,
        position: cyRelativePosition,
      });
      event.preventDefault();
    },
    handleNodeClick(event) {
      const popup = document.getElementById("popup");

      var node = event.target;
      var info = node.data("info");
      var relations = node.data("relationships");
      // console.log(relations);
      this.clickedNode = node;

      this.popupInfo = info;
      this.showPopup = true;

      const imageSrc =
        info.icona !== null
          ? `http://95.110.132.24:8071/assets/${info.icona}`
          : "";
      // const virtuoseLogo = info.virtuosa
      //   ? `${this.baseUrl}/assets/logo_r.png`
      //   : "";

      const noteSection = info.note ? `<p><b>Info:</b> ${info.note}</p>` : "";
      // const birthPlace =
      //   info.luogo_nascita === "Roma" || info.luogo_nascita === "Firenze"
      //     ? `${info.luogo_nascita}`
      //     : "";
      const fatherSection =
        relations.father !== null
          ? `<p><b>Padre:</b> ${this.getCharacterName(relations.father)}</p>`
          : "";
      const motherSection =
        relations.mother !== null
          ? `<p><b>Madre:</b> ${this.getCharacterName(relations.mother)}</p>`
          : "";
      const spouseSection =
        relations.spouse !== null
          ? `<p><b>Marito/Moglie:</b> ${this.getCharacterName(
              relations.spouse
            )}</p>`
          : "";
      const childrenSection =
        relations.children && relations.children.length > 0
          ? `<p><b>Figli/Figlie:</b> ${relations.children
              .map((childId) => this.getCharacterName(childId))
              .join(", ")}</p>`
          : "";
      const maestroSection =
        relations.maestro && relations.maestro.length > 0
          ? `<p><b>Maestro:</b> ${relations.maestro
              .map((maestroId) => this.getCharacterName(maestroId))
              .join(", ")}</p>`
          : "";
      const mecenatiSection =
        relations.mecenati && relations.mecenati.length > 0
          ? `<p><b>Mecenati:</b> ${relations.mecenati
              .map((mecenatiId) => this.getCharacterName(mecenatiId))
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
              <h3 style="margin-left:10px"><b><i>${info.nome_scelto}, ${
        info.id
      }</i></b></h3><br>
                ${fatherSection}
                ${motherSection}
                ${spouseSection}
                ${childrenSection}
                ${noteSection}

                ${maestroSection}
                ${mecenatiSection}
            </div>
        </div>
    `;
      var position = event.target.renderedPosition();
      // console.log("Position: ", position);
      var cyContainer = document.getElementById("cy");
      var popupHeight = popup.offsetHeight;
      var popupWidth = popup.offsetWidth;

      var popupOffsetX = -550;
      var popupOffsetY = -900;
      if (position.y > 750) {
        popupOffsetY = popupOffsetY - popupHeight;
      }
      if (position.x < 500) {
        popupOffsetX = popupOffsetX + popupWidth;
      }
      var popupPositionX = Math.min(
        position.x + popupOffsetX,
        cyContainer.offsetWidth - popup.offsetWidth
      );
      var popupPositionY = Math.min(
        position.y + popupOffsetY,
        cyContainer.offsetHeight - popup.offsetHeight
      );

      popup.style.transform = `translate(${popupPositionX}px, ${popupPositionY}px)`;

      setTimeout(() => {
        // Show the popup
        popup.style.width = "500px";
        popup.style.height = "auto";
        popup.style.opacity = "1";
        popup.style.zIndex = "999";

        // Add event listener to hide the popup when clicking outside of it
        document.addEventListener("click", this.hidePopupOutside);
      }, 200);

      event.stopPropagation();
    },
    handleNodeGrab(event) {
      this.nodeClicked = true;
      this.isPanning = false;

      // Prevent event propagation to the DOM
      event.stopPropagation();
    },
    addCytoscapeEventListeners() {
      const cyContainer = document.getElementById("cy");

      cyContainer.addEventListener("mousedown", this.handleMouseDown);
      cyContainer.addEventListener("mousemove", this.handleMouseMove);
      cyContainer.addEventListener("mouseup", this.handleMouseUp);
      cyContainer.addEventListener("wheel", this.handleWheel);

      this.cy.on("grab", "node", this.handleNodeGrab);
      this.cy.on("click", "node", this.handleNodeClick);
    },
    populateCytoscapeGraph() {
      var popup = document.createElement("div");
      popup.id = "popup";
      popup.style.opacity = "0";
      document.getElementById("cy").appendChild(popup);

      this.cy.nodes().forEach((node) => {
        if (node.connectedEdges().length === 0) {
          node.hide();
        } else {
          const size = this.getNodeSize(node);
          node.style("width", size);
          node.style("height", size);
        }
      });

      // Disable built-in panning

      this.cy.userPanningEnabled(false);

      // Add mouse event listeners for custom panning

      this.cy.ready(() => {
        this.cy.zoom(0.55);
      });
    },
  },
};
</script>
