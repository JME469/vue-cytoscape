<template>
  <div id="outer-container">
    <!-- EVENTS PAGE -->
    <div id="logo-container">
      <img v-show="loading" id="loading" src="/wordpress/wp-content/themes/astra/assets/dist/img/vidimus_r.png" alt="Logo vidimus" width="500px">
    </div>
    <div id="events" v-show="showEventList">
      <h1>Eventi</h1>
      <div v-for="(event, index) in eventsData" :key="event.id" :value="event.id" :class="[index % 2 === 0 ? 'light-grey' : 'white']">
        <div class="event">
          <h2>{{ event.data }}, {{ event.luogo }}</h2>
          <div class="event-info">
            <p v-if="event.note !== null">{{ event.note }}</p>
            <div class="characters">
              <p
                  v-for="character in getCharactersForEvent(event.id)"
                  :key="character.id"
                >
                  {{ character.nome_scelto }}
                </p>
            </div>
          </div>
        </div>
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

@keyframes loading {
  0% {
    opacity: 0%;
  }
  50% {
    opacity: 100%
  }
  100% {
    opacity: 0%;
  }
}

#loading {
  animation: loading 1.75s ease-in-out infinite;
}

#logo-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

li {
  height: 100%;
}

#events {
  padding-bottom: 50px;
  padding-top: 40px;
}

#events > h1 {
  text-align: center;
  margin: 20px;
}

.event {
  position: relative;
  left: 25%;
  margin: 60px;
  max-width: 75%;
}

.event > h2 {
  margin: 20px;
}

.event-info > p {
  font-family: "Source Sans 3";
  max-width: 50%;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
}

.characters{
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.characters p{
  font-weight: bold;
}

#app {
  height: auto;
}

.light-grey {
  background-color: #f5f5f5;
  color: black;
  padding: 10px;
}

.white {
  background-color: white;
  color: black;
  padding: 10px;
}

.color {
  color: rgb(177, 80, 80);
  background-color: rgb(45, 116, 59);
}

#container {
  margin-top: 50px;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
}

</style>

<script>
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";

cytoscape.use(fcose);

export default {
  data() {
    return {
      showCytoscape: false,
      showEventList: false,
      showPopup: false,
      loading: true,

      isPanning: false,
      initialPointerPosition: { x: 0, y: 0 },
      nodeClicked: false,
      popupInfo: {},
      clickedNode: null,
      hoverTimeout: null,

      charactersData: [],
      relationsData: [],
      maestroRelations: [],
      mecenatiRelations: [],
      maestroData: [],
      mecenatiData: [],
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
      dropdownLabel: "Eventi",
      selectedEvent: null,
      selectedFilter: "family",
      searchQuery: "",
      showAutocomplete: false,
      accordionState: {},
      showAside: false,
    };
  },
  mounted() {
    this.fetchDataAndPopulateNodes();
  },
  computed: {
    filteredCharacters() {
      const query = this.searchQuery.toLowerCase().trim();
      return this.charactersData
        .filter((character) =>
          character.nome_scelto.toLowerCase().includes(query)
        )
        .sort((a, b) => {
          return a.nome_scelto.localeCompare(b.nome_scelto); // Sort alphabetically by character name
        });
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    /* EVENT FILTERING LOGIC */

    hasCharactersForEvent(eventId) {
      const characters = this.charactersData.filter(function (character) {
        return character.eventi.includes(eventId);
      });
      return characters.length > 0;
    },
    // Get the list of characters related to the given event
    getCharactersForEvent(eventId) {
      const characters = this.charactersData.filter((character) =>
        character.eventi.includes(eventId)
      );
      return characters;
    },
    // Toggle the visibility of the accordion for the given event
    toggleAccordion(eventId) {
      if (this.isAccordionOpen(eventId)) {
        this.accordionState[eventId] = false;
      } else {
        this.accordionState[eventId] = true;
      }
    },
    // Check if the accordion for the given event is open
    isAccordionOpen(eventId) {
      return !!this.accordionState[eventId];
    },
    selectEvent(event) {
      this.selectedEvent = event.id;
      this.toggleDropdown();
      this.filterGraphByEvent();
    },
    isNodeRelatedToEvent(node, selectedEventId) {
      return node.data().info.eventi.includes(selectedEventId);
    },
    filterGraphByEvent() {
      this.showAllNodes();
      this.cy.nodes().forEach((node) => {
        const related = this.isNodeRelatedToEvent(node, this.selectedEvent);
        if (!related) {
          node.hide();
        }
      });
      const relatedNodes = this.cy.nodes().filter((node) => {
        return this.isNodeRelatedToEvent(node, this.selectedEvent);
      });
      if (relatedNodes.length > 0) {
        this.cy.fit(relatedNodes, 420);
      }
    },

    /* CHARACTER SEARCH LOGIC */

    //Shows the searched character and related nodes
    filterGraph(character) {
      const characterId = character.id;

      this.cy.elements().hide();

      // Show the selected character node and its edges
      const characterNode = this.cy.getElementById(characterId);
      if (characterNode.length > 0) {
        characterNode.show();

        // Show related nodes and their edges
        this.cy.edges().forEach((edge) => {
          const sourceId = edge.source().id();
          const targetId = edge.target().id();

          if (sourceId == characterId || targetId == characterId) {
            edge.show();

            // Show source and target nodes of the edge
            this.cy.getElementById(sourceId).show();
            this.cy.getElementById(targetId).show();
          }
        });
        this.cy.fit(characterNode, 420);
      }
    },
    updateAutocomplete() {
      if (this.searchQuery == "") {
        this.showAutocomplete = false;
      } else {
        const matchingCharacters = this.getMatchingCharacters();
        this.showAutocomplete = matchingCharacters.length > 0;
      }
    },
    getMatchingCharacters() {
      const query = this.searchQuery.toLowerCase().trim();
      return this.charactersData.filter((character) =>
        character.nome_scelto.toLowerCase().includes(query)
      );
    },
    selectCharacter(character) {
      this.searchQuery = character.nome_scelto;
      this.showAutocomplete = false;
    },
    searchCharacter() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        this.showAllNodes();
        return;
      }
      const character = this.charactersData.find((char) =>
        char.nome_scelto.toLowerCase().includes(query)
      );
      if (character) {
        // If the character is found, filter the graph to show only the selected character and its related nodes
        this.filterGraph(character);
      } else {
        // If the character is not found, clear the graph display
        this.clearGraph();
      }
    },
    showAllNodes() {
      // Show all nodes in the graph
      this.cy.nodes().forEach((node) => {
        if (node.connectedEdges().length !== 0) {
          node.show();
        }
      });
      this.cy.edges().show();
    },

    /* Extra functionalities */
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

    /* CREATE CYTOSCAPE GRAPH */
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
                  if (relation.type === "maestro") {
                    return "rgb(177, 80, 80)"; // Maestro relations
                  } else if (relation.type === "mecenati") {
                    return "rgb(45, 116, 59)"; // Mecenati relations
                  } else {
                    return "#96b8d2";
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

    /* MAIN FUNCTION */
    //It calls the relevant functions in order to retrieve data and create the graph
    async fetchDataAndPopulateNodes() {
      try {
        const charactersData = await this.retrieveData();
        this.charactersData = charactersData;

        const eventsData = await this.retrieveEvents();
        this.eventsData = eventsData;

        const relationsData = await this.retrieveRelations();
        this.relationsData = relationsData;

        const maestroRelations = await this.retrieveMaestroRelations();
        this.maestroRelations = maestroRelations;
        const mecenatiRelations = await this.retrieveMecenatiRelations();
        this.mecenatiRelations = mecenatiRelations;

        const maestroData = await this.retrieveMaestroData();
        this.maestroData = maestroData;
        const mecenatiData = await this.retrieveMecenatiData();
        this.mecenatiData = mecenatiData;

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

        this.updateCharacterEvents(
          charactersData,
          await this.retrieveEventRelations()
        );

        this.combineData();

        this.cyData = this.formatDataForCytoscape(
          charactersData,
          this.maestroRelations,
          this.mecenatiRelations,
          this.maestroData,
          this.mecenatiData
        );

        //console.log(cyData);
        //this.loadLayout();
        //this.populateCytoscapeGraph();
        //this.addCytoscapeEventListeners();
        setTimeout(this.showEventList = true, 150);
        this.loading = false;
      } catch (error) {
        console.error("Error fetching data and populating nodes: ", error);
      }
    },

    /* DATA RETRIEVING */
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

    /* DATA HANDLING */
    //They translate the references to the corresponding characters
    combineData() {
      // Merge relationships data with characters data
      this.charactersData.forEach((character) => {
        const figliFiglieIds = character.figli_figlie;
        const relatedCharacters = this.relationsData.filter((relation) =>
          figliFiglieIds.includes(relation.id)
        );
        // Replace figli_figlie relation IDs with corresponding character IDs
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
          maestro: maestro.maestro,
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
          mecenati: mecenati.mecenate,
        };
      });
    },
    updateCharacterEvents(charactersData, eventRelationsData) {
      charactersData.forEach((character) => {
        character.eventi = character.eventi
          .map((relationId) => {
            const eventRelation = eventRelationsData.find(
              (rel) => rel.id === relationId
            );
            return eventRelation ? eventRelation.eventi_id : null;
          })
          .filter((eventId) => eventId !== null);
      });
    },
    updateCharacterMaestroRelations(combinedMaestroData) {
      this.charactersData.forEach((character) => {
        character.maestro = [];
      });
      combinedMaestroData.forEach(({ relation, maestro }) => {
        const character = this.charactersData.find(
          (char) => char.id === relation.Virtuose_id
        );
        if (character) {
          if (!character.maestro) {
            character.maestro = [];
          }

          character.maestro.push(maestro);
        }
      });
    },
    updateCharacterMecenatiRelations(combinedMecenatiData) {
      this.charactersData.forEach((character) => {
        character.mecenati = [];
      });
      combinedMecenatiData.forEach(({ relation, mecenati }) => {
        const character = this.charactersData.find(
          (char) => char.id === relation.Virtuose_id
        );
        if (character) {
          // Update character's maestro relations
          if (!character.mecenati) {
            character.mecenati = [];
          }
          character.mecenati.push(mecenati);
        }
      });
    },
    getCharacterName(id) {
      const character = this.charactersData.find((char) => char.id === id);
      return character ? character.nome_scelto : `"Non conosciuto"`;
    },

    //Transforms characters data into cytoscape format
    formatDataForCytoscape(
      charactersData,
      maestroRelations,
      mecenatiRelations,
      maestroData,
      mecenatiData
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
        mecenatiRelations,
        maestroData,
        mecenatiData
      );
      this.updateRelationships(nodes, edges);
      return { nodes, edges };
    },

    //Organizes all relations
    extractRelatives(
      character,
      maestroRelations,
      mecenatiRelations,
      maestroData,
      mecenatiData
    ) {
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
            const maestro = maestroData.find(
              (m) => m.id === relation.maestro_id
            );
            if (maestro) {
              relatives.push(maestro.maestro);
            }
          }
        });
        mecenatiRelations.forEach((relation) => {
          if (relation.Virtuose_id === character.id) {
            const mecenati = mecenatiData.find(
              (m) => m.id === relation.mecenati_id
            );
            if (mecenati) {
              relatives.push(mecenati.mecenate);
            }
          }
        });
      }
      return relatives;
    },
    //Creates edges from the organized relations
    extractEdgesFromCharacters(
      charactersData,
      maestroRelations,
      mecenatiRelations,
      maestroData,
      mecenatiData
    ) {
      const edges = [];
      charactersData.forEach((character) => {
        const relatives = this.extractRelatives(
          character,
          maestroRelations,
          mecenatiRelations,
          maestroData,
          mecenatiData
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

            const maestro = maestroData.find((m) => m.maestro === relativeId);
            if (maestro) {
              if (
                maestroRelations.some(
                  (relation) =>
                    relation.Virtuose_id === character.id &&
                    maestro.maestro === relativeId
                )
              ) {
                relationType = "maestro";
              }
            } else {
              const mecenati = mecenatiData.find(
                (m) => m.mecenate === relativeId
              );
              if (mecenati) {
                if (
                  mecenatiRelations.some(
                    (relation) =>
                      relation.Virtuose_id === character.id &&
                      mecenati.mecenate === relativeId
                  )
                ) {
                  relationType = "mecenati";
                }
              }
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
    //Ables bi-directional relations info
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

    /* GRAPH ACTIONS HANDLING */
    //Such as zoom, dragging, node interacion, etc.
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
    //Info popup handling
    handleNodeHover(event) {
      this.hoverTimeout = setTimeout(() => {
        const popup = document.getElementById("popup");

        var node = event.target;
        var info = node.data("info");
        var relations = node.data("relationships");
        // console.log(relations);
        this.clickedNode = node;

        this.popupInfo = info;
        this.showPopup = true;

        const logoSrc = info.virtuosa
          ? `/wordpress/wp-content/themes/astra/assets/dist/img/logo_r.png`
          : "";
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
        const pseudonimo =
          info.pseudonimo !== null ? `<p><i>${info.pseudonimo}</i></p>` : "";
        const nascita =
          info.data_nascita !== null
            ? `<p><b>Data di nascita: </b>${info.data_nascita}</p>`
            : "";
        const morte =
          info.data_morte !== null
            ? `<p><b>Data di morte: </b>${info.data_morte}</p>`
            : "";
        const fatherSection =
          relations.father !== null
            ? `<p><b>Padre:</b> ${this.getCharacterName(relations.father)}</p>`
            : "";
        const motherSection =
          relations.mother !== null
            ? `<p><b>Madre:</b> ${this.getCharacterName(relations.mother)}</p>`
            : "";
        // const padrinoSection =
        //   info.padrino !== null
        //     ? `<p><b>Padrino:</b> ${this.getCharacterName(info.padrino)}</p>`
        //     : "";
        // const madrinaSection =
        //   info.padrino !== null
        //     ? `<p><b>Madrina:</b> ${this.getCharacterName(info.madrina)}</p>`
        //     : "";
        // const spouseSection =
        //   relations.spouse !== null
        //     ? `<p><b>Marito/Moglie:</b> ${this.getCharacterName(
        //         relations.spouse
        //       )}</p>`
        //     : "";
        // const childrenSection =
        //   relations.children && relations.children.length > 0
        //     ? `<p><b>Figli/Figlie:</b> ${relations.children
        //         .map((childId) => this.getCharacterName(childId))
        //         .join(", ")}</p>`
        //     : "";
        // const maestroSection =
        //   info.maestro && info.maestro.length > 0
        //     ? `<p><b>Maestro:</b> ${info.maestro
        //         .map((maestroId) => this.getCharacterName(maestroId))
        //         .join(", ")}</p>`
        //     : "";
        // const mecenatiSection =
        //   info.mecenati && info.mecenati.length > 0
        //     ? `<p><b>Mecenati:</b> ${info.mecenati
        //         .map((mecenatiId) => this.getCharacterName(mecenatiId))
        //         .join(", ")}</p>`
        //     : "";

        // Construct the popup content
        popup.innerHTML = `
        <div id="content">
          
          ${
            imageSrc !== ""
              ? `<img src="${imageSrc}" style="max-width:250px;max-height:300px;" alt="Icona" id="picture">`
              : ""
          }
          
            <div id="chInfo">
              <h3 style="margin-left:10px"><b><i>${info.nome_scelto}</i></b>${
          logoSrc !== ""
            ? `<img src="${logoSrc}" style="max-width:25px;margin-left:10px" alt="Logo" class="logo">`
            : ""
        }</h3>
        <h4 style="margin-left:10px">${pseudonimo}</h4>
        <br>
                ${nascita}
                ${morte}        
                ${fatherSection}
                ${motherSection}
                ${noteSection}

            </div>
        </div>
    `;
        // ${spouseSection}
        // ${childrenSection}
        // ${padrinoSection}
        // ${madrinaSection}
        // ${maestroSection}
        // ${mecenatiSection}

        var position = event.target.renderedPosition();
        // console.log("Position: ", position);
        var cyContainer = document.getElementById("cy");
        var popupHeight = popup.offsetHeight;
        var popupWidth = popup.offsetWidth;

        var popupOffsetX = -550;
        var popupOffsetY = -1100;
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
          if (info.virtuosa) {
            popup.style.border = "solid 2px rgb(120, 38, 46)";
          } else {
            popup.style.border = "solid 1px grey";
          }
          popup.style.width = "550px";
          popup.style.height = "auto";
          popup.style.opacity = "1";
          popup.style.zIndex = "999";

          // Add event listener to hide the popup when clicking outside of it
          document.addEventListener("click", this.hidePopupOutside);
        }, 200);

        event.stopPropagation();
      }, 750);
    },
    closeAside() {
      document
        .getElementById("aside")
        .removeEventListener("click", this.closeAside);
      this.showAside = false;
    },
    handleNodeLeave() {
      // Clear the timeout if the mouse leaves the node before the delay
      clearTimeout(this.hoverTimeout);
    },
    handleNodeClick(event) {
      // Show detailed info about the clicked node in the aside section
      const node = event.target;
      const info = node.data("info");
      const relations = node.data("relationships");

      const content = document.getElementById("aside-content");

      const logoSrc = info.virtuosa
        ? `/wordpress/wp-content/themes/astra/assets/dist/img/logo_r.png`
        : "";
      const imageSrc =
        info.icona !== null
          ? `http://95.110.132.24:8071/assets/${info.icona}`
          : "";

      // Construct the content for the aside section
      content.innerHTML = `
    <div id="content"><br>
      ${
        imageSrc !== ""
          ? `<img src="${imageSrc}" style="max-width:250px;max-height:300px;margin-bottom:15px" alt="Icona" id="picture">`
          : ""
      }
      <div id="chInfo">
        <h3 style="margin-left:10px"><b><i>${info.nome_scelto}</i></b>${
        logoSrc !== ""
          ? `<img src="${logoSrc}" style="max-width:25px;margin-left:10px" alt="Logo" class="logo">`
          : ""
      }</h3>
        <h4 style="margin-left:10px">${
          info.pseudonimo !== null ? `<p><i>${info.pseudonimo}</i></p>` : ""
        }</h4>
        <br>
        ${
          info.data_nascita !== null
            ? `<p><b>Data di nascita: </b>${info.data_nascita}</p>`
            : ""
        }
        ${
          info.data_morte !== null
            ? `<p><b>Data di morte: </b>${info.data_morte}</p>`
            : ""
        }
        ${
          relations.father !== null
            ? `<p><b>Padre:</b> ${this.getCharacterName(relations.father)}</p>`
            : ""
        }
        ${
          relations.mother !== null
            ? `<p><b>Madre:</b> ${this.getCharacterName(relations.mother)}</p>`
            : ""
        }
        ${
          relations.spouse !== null
            ? `<p><b>Marito/Moglie:</b> ${this.getCharacterName(
                relations.spouse
              )}</p>`
            : ""
        }
        ${
          relations.children && relations.children.length > 0
            ? `<p><b>Figli/Figlie:</b> ${relations.children
                .map((childId) => this.getCharacterName(childId))
                .join(", ")}</p>`
            : ""
        }
        ${
          info.padrino !== null
            ? `<p><b>Padrino:</b> ${this.getCharacterName(info.padrino)}</p>`
            : ""
        }
        ${
          info.madrina !== null
            ? `<p><b>Madrina:</b> ${this.getCharacterName(info.madrina)}</p>`
            : ""
        }<br><br>
        ${
          info.maestro && info.maestro.length > 0
            ? `<p><b>Maestro:</b> ${info.maestro
                .map((maestroId) => this.getCharacterName(maestroId))
                .join(", ")}</p>`
            : ""
        }
        ${
          info.mecenati && info.mecenati.length > 0
            ? `<p><b>Mecenati:</b> ${info.mecenati
                .map((mecenatiId) => this.getCharacterName(mecenatiId))
                .join(", ")}</p>`
            : ""
        }<br>
        ${
          info.eventi && info.eventi.length > 0
            ? `<p><b>Eventi:</b> ${info.eventi
                .map((eventId) => {
                  const event = this.eventsData.find(
                    (event) => event.id === eventId
                  );
                  return event ? `${event.data} - ${event.luogo}` : "";
                })
                .join(" | ")}</p>`
            : ""
        }
        ${info.note ? `<p><b>Info:</b> ${info.note}</p>` : ""}
      </div>
    </div>
  `;

      document
        .getElementById("closeAside")
        .addEventListener("click", this.closeAside);
      // Show the aside section
      this.showAside = true;
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
      this.cy.on("mouseover", "node", this.handleNodeHover);
      this.cy.on("mouseout", "node", this.handleNodeLeave);
    },
    //Other functionalities
    populateCytoscapeGraph() {
      var popup = document.createElement("div");
      popup.id = "popup";
      popup.style.opacity = "0";
      document.getElementById("cy").appendChild(popup);

      this.cy.nodes().forEach((node) => {
        if (node.connectedEdges().length === 0) {
          node.hide();
        }
      });

      this.cy.nodes().forEach((node) => {
        const size = this.getNodeSize(node);
        node.style("width", size);
        node.style("height", size);
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