<template>
  <div id="outer-container">
    <!-- EVENTS PAGE -->
    <div id="logo-container">
      <img v-show="loading" id="loading" src="/wordpress/wp-content/themes/astra/assets/dist/img/vidimus_r.png" alt="Logo vidimus" width="500px">
    </div>
    <div id="events" v-show="showEventList">
      <h1>Repertorio</h1>
      <div id="searchBar-container">
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            @input="updateAutocomplete"
            @keyup.enter="searchCharacter"
            placeholder="Filtrare per genere..."
          />
          <ul v-if="showAutocomplete" id="autocomplete">
            <li
              v-for="song in filteredSongs"
              :key="song.genere"
              @click="selectCharacter(song)"
              class="character"
            >
              {{ song.genere }}
            </li>
          </ul>
        </div>
      </div>
      <div
        v-for="(song, index) in filteredRepertorio"
        :key="song.id"
        :value="song.id"
        :class="[index % 2 === 0 ? 'light-grey' : 'white']"
      >
        <div id="event">
          <div id="event-content">
            <div class="block">
              <h2>{{ song.titolo }}</h2>
              <h3 v-if="song.data !== null">Data: {{ song.data }}</h3>
              Autore:
              <p
                v-for="character in song.relatedCharacters"
                :key="character.characterId"
              >
                {{ getCharacterName(character.characterId) }}
              </p>
            </div>
            <div class="block" style="margin-top:30px">
              <p v-if="song.genere !== null">Genere: {{ song.genere }}</p>
              <p>{{ getFontType(song.fonte_repertorio) }}</p>
              <p v-if="song.note !== null">{{ song.note }}</p>
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
  margin: 0;
}

hr {
  width: 100%;
  margin-bottom: 20px;
  border: none;
  height: 3px;
  background-color: rgb(120, 38, 46);
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

.dropdown {
  position: relative;
  display: inline-block;
  min-width: 100%;
}

.droptbtn {
  width: 100%;
}

.dropdown-content {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 1000;
  max-height: 380px;
  overflow-y: scroll;
}

.dd-content {
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

#searchBar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

#searchBar-container > div > button {
  padding: 10px;
  background: none;
  border: solid 2px rgb(100, 9, 18);
  color: rgb(76, 76, 76);
  font-family: Montserrat;
  font-weight: 600;
  transition: all 0.5s ease-out;
  cursor: pointer;
}

#searchBar-container > div > button:hover {
  background-color: rgb(120, 38, 46);
  color: aliceblue;
}

.search-container {
  margin-right: 15px;
}

.search-container > input {
  padding: 10px;
  min-width: 180px;
  border: solid 2px rgb(100, 9, 18);
}

#autocomplete {
  position: absolute;
  list-style: none;
  max-height: 200px;
  max-width: 230px;
  overflow-y: scroll;
  background-color: #fafafa;
  border: solid 2px rgb(100, 9, 18);
  margin-top: 5px;
  z-index: 1002;
}

.character {
  cursor: pointer;
  padding: 10px;
  font-family: Montserrat;
  font-weight: 500;
  transition: all 0.3s ease;
}

.character:hover {
  background-color: rgb(100, 9, 18);
  color: aliceblue;
}

#events {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 50px;
  padding-top: 40px;
  margin: 0;
}

#events > h1 {
  text-align: center;
  margin-bottom: 30px;
}

#event > h2 {
  font-size: 26px;
  margin: 20px;
}

#event {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 34%;
}

#event-info > p {
  max-width: 100%;
}

#event-info > h3 {
  max-width: 100%;
}

#event-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px;
}

.block{
  max-width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

#app {
  height: auto;
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

#cy {
  width: 100%;
  height: 1100px;
  background-color: rgb(255, 255, 255);
  border: solid 2px rgb(100, 9, 18);
}

#content {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0;
}

#content img {
  margin-bottom: 15px;
}

#picture {
  grid-row: 1 / span 2;
  border-radius: 10px;
  margin: 15px;
}

.logo {
  position: absolute;
  top: 15px;
  right: 15px;
  float: right;
}

#chInfo {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
}

#chInfo h3,
#chInfo h4 {
  font-family: "Source Sans 3" !important;
  font-size: medium !important;
}

#chInfo h4 {
  font-weight: lighter;
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

#popup h3,
h4 {
  font-family: "Source Sans 3" !important;
  font-size: medium !important;
}

#popup:hover {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#aside {
  display: flex;
  flex-direction: column;

  position: absolute;
  float: right;
  right: 0;
  min-width: 350px;
  max-width: 500px;
  min-height: 700px;
  max-height: 1000px;
  overflow-y: scroll;

  background-color: white;
  border: solid 2px rgb(100, 9, 18);
  font-family: "Source Sans 3";
  padding: 30px;
}

#closeAside {
  background-color: rgb(100, 9, 18) !important;
  color: aliceblue !important;
  padding: 10px !important;
  font-family: Montserrat !important;
  font-weight: 500 !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;

  max-width: 150px;
}

#aside h3,
h4 {
  font-family: "Source Sans 3" !important;
  font-size: medium !important;
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
      repertorioData: [],
      repertorioRelations: [],

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
    filteredSongs() {
      const query = this.searchQuery.toLowerCase().trim();
      return this.repertorioData
        .filter((song) =>
          song.genere && song.genere.toLowerCase().includes(query)
        )
        .sort((a, b) => {
          return a.genere.localeCompare(b.genere); // Sort alphabetically by character name
        });
    },
    filteredRepertorio() {
      return this.filteredSongs;
    },
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
        this.selectedFilter = filterValue;
        await this.fetchDataAndPopulateNodes();
      }
    },
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
    getFontType(fonte) {
      if (fonte[0] == 1) {
        return "Fonte musicale";
      } else if (fonte[0] == 2) {
        return "Fonte archivistiche";
      } else if (fonte[0] == 3) {
        return "Fonte letterarie";
      } else {
        return "";
      }
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
      return this.repertorioData.filter((song) => song.genere && 
        song.genere.toLowerCase().includes(query)
      );
    },
    selectCharacter(song) {
      this.searchQuery = song.genere;
      this.showAutocomplete = false;
    },
    searchCharacter() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        this.showAllNodes();
        return;
      }
      const character = this.repertorioData.find((char) => char.genere &&
        char.genere.toLowerCase().includes(query)
      );
      if (character) {
        // If the genere is found, filter the list to show only the selected genere songs
        this.filteredRepertorio = this.filteredSongs;
      } else {
        // If the genre is not found, show all the songs
        this.filteredRepertorio = this.repertorioData;
      }
    },
    //It calls the relevant functions in order to retrieve data and create the graph
    async fetchDataAndPopulateNodes() {
      try {
        const charactersData = await this.retrieveData();
        this.charactersData = charactersData;

        const eventsData = await this.retrieveEvents();
        this.eventsData = eventsData;

        const relationsData = await this.retrieveRelations();
        this.relationsData = relationsData;

        const repertorioRelations = await this.retrieveRepertorioRelations();
        this.repertorioRelations = repertorioRelations;
        const repertorioData = await this.retrieveRepertorioData();
        this.repertorioData = repertorioData;

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

        //console.log(cyData);
        setTimeout((this.showEventList = true), 150);
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
    async retrieveRepertorioRelations() {
      const response = await fetch(
        "http://95.110.132.24:8071/items/Virtuose_repertorio"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveRepertorioData() {
      const response = await fetch(
        "http://95.110.132.24:8071/items/repertorio?filter[pubblicato][_eq]=1"
      );
      const responseData = await response.json();
      const data = responseData.data;

      for (const song of data) {
        // Initialize an array to store related characters
        song.relatedCharacters = [];

        // Find corresponding relation in repertorioRelations
        const relation = this.repertorioRelations.find(
          (rel) => rel.repertorio_id === song.id
        );
        if (relation) {
          // Get the character ID from the relation and add it to the song's relatedCharacters array
          song.relatedCharacters.push({ characterId: relation.Virtuose_id });
        }
      }
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
  },
};
</script>
