<template>
  <div id="outer-container">
    <!-- EVENTS PAGE -->
    <div id="logo-container">
      <img v-show="loading" id="loading" src="/wp-content/themes/astra/assets/dist/img/vidimus_r.png" alt="Logo vidimus"
        width="500px" />
    </div>
    <div id="events" v-show="showEventList">
      <h1>Eventi</h1>
      <div id="searchBar-container">
        <div class="search-container">
          <input type="text" v-model="searchQuery" placeholder="Cerca per data, luogo o virtuose..." />
          <ul v-if="showAutocomplete" id="autocomplete">
            <li v-for="event in filteredEvents" :key="event.id" @click="selectCharacter(event)" class="character">
              {{ event.luogo }}, {{ event.data }}
            </li>
          </ul>
          <button @click="clearSearch" id="searchBar-button">
            <img src="/wp-content/themes/astra/assets/dist/img/x.png" alt="" class="searchBar-button-icon" />
          </button>
        </div>
      </div>
      <div v-for="(event, index) in filteredEvents" :key="event.id" :value="event.id"
        :class="[index % 2 === 0 ? 'light-grey' : 'white']">
        <div class="event">
          <p>{{ event.luogo }}, {{ event.data }}</p>
          <div class="event-info">
            <p v-if="event.note !== null">{{ event.note }}</p>
            <div v-if="event.relatedRepertorio.length > 0">
              <span class="subtitle">REPERTORIO</span>
              <p v-for="repertorio in event.relatedRepertorio" :key="repertorio.id" :value="repertorio.titolo"
                class="subcontent">
                {{ repertorio.titolo }}
              </p>
            </div>
            <div v-if="event.relatedMecenati.length > 0">
              <hr /><br>
              <span class="subtitle">MECENATE</span>
              <p v-for="mecenate in event.relatedMecenati" :key="mecenate.id" :value="mecenate.nome_scelto"
                class="subcontent">
                {{ mecenate.nome_scelto }}
              </p>
            </div>
            <div v-if="event.relatedFonti.length > 0">
              <hr /><br>
              <span class="subtitle">FONTI</span>
              <p v-for="font in event.relatedFonti" :key="font.id" :value="font.archivio"
                class="subcontent">
                {{ font.archivio_sigla }}, {{ font.fondo }}, {{ font.busta }}, {{ font.carte }}
              </p>
            </div>
            <div v-if="event.relatedCharacters.length > 0">
              <hr /><br>
              <span class="subtitle">VIRTUOSE</span>
              <p v-for="character in event.relatedCharacters" :key="character.id" :value="character.nome_scelto"
                class="subcontent">
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
    opacity: 100%;
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

#searchBar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

#searchBar-container>div>button {
  padding: 10px;
  background: none;
  border: solid 2px rgb(100, 9, 18);
  color: rgb(76, 76, 76);
  transition: all 0.5s ease-out;
  cursor: pointer;
}

#searchBar-container>div>button:hover {
  background-color: rgb(120, 38, 46);
  color: aliceblue;
}

.search-container {
  margin-right: 15px;
  display: flex;
  flex-direction: row;
}

.search-container>input {
  padding: 10px;
  min-width: 320px;
  border: solid 2px rgb(100, 9, 18);
}

#autocomplete {
  position: absolute;
  list-style: none;
  max-height: 200px;
  max-width: 320px;
  overflow-y: scroll;
  background-color: #fafafa;
  border: solid 2px rgb(100, 9, 18);
  margin-top: 45px;
  z-index: 1002;
}

#searchBar-button {
  margin-left: 10px;
  width: 40px;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px !important;
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

li {
  height: 100%;
}

#events {
  padding-bottom: 50px;
  padding-top: 40px;
}

#events * {
  font-family: "Source Sans 3" !important;
}

#events>h1 {
  text-align: center;
  margin: 20px;
}

.event {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 60px;
}

.event>p {
  margin: 20px;
  font-weight: 600;
  font-style: italic;
  font-size: 24px !important;
  text-align: center;
}

.event-info>p {
  max-width: 1180px;
  font-size: 20px;
  color: #3a3a3a;
  text-align: center;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
  text-align: center;
}

.characters {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.characters p {
  font-weight: bold;
}

.subtitle {
  color: rgb(100, 9, 18);
}

.subcontent {
  font-style: italic;
}

hr {
  min-width: 500px;
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
      showEventList: false,
      loading: true,

      charactersData: [],
      eventCharacterRelations: [],

      mecenatiData: [],
      mecenatiRelations: [],

      repertorioData: [],

      fontiArchivistiche: [],
      fontiRelations: [],

      eventsData: [],
      eventRelationsData: [],

      searchQuery: "",
      showAutocomplete: false,
    };
  },
  mounted() {
    this.fetchDataAndPopulateNodes();
  },
  computed: {
    filteredEvents() {
      const query = this.searchQuery.toLowerCase().trim();

      return this.eventsData.filter((event) => {
        // Comprobar título
        const matchesLuogo =
          (event.luogo && event.luogo.toLowerCase().includes(query)) ||
          (event.luogo &&
            query.toLowerCase().includes(event.luogo.toLowerCase()));

        // Comprobar género
        const matchesData =
          (event.data && event.data.toLowerCase().includes(query)) ||
          (event.data &&
            query.toLowerCase().includes(event.data.toLowerCase()));

        // Comprobar personajes relacionados
        const matchesRelatedCharacters = event.relatedCharacters.some((rel) => {
          const character = this.charactersData.find(
            (char) => char.id === rel.characterId
          );
          return (
            character && character.nome_scelto.toLowerCase().includes(query)
          );
        });

        //Devovlver verdadero si la query coincide con alguno de los campos
        return matchesLuogo || matchesData || matchesRelatedCharacters;
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
    clearSearch() {
      this.searchQuery = "";
      this.showAutocomplete = false;
    },

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

    /* AUTOCOMPLETE */

    // updateAutocomplete() {
    //   if (this.searchQuery == "") {
    //     this.showAutocomplete = false;
    //   } else {
    //     const matchingCharacters = this.getMatchingCharacters();
    //     this.showAutocomplete = matchingCharacters.length > 0;
    //   }
    // },
    // getMatchingCharacters() {
    //   const query = this.searchQuery.toLowerCase().trim();
    //   return this.charactersData.filter((character) =>
    //     character.nome_scelto.toLowerCase().includes(query)
    //   );
    // },
    // selectCharacter(event) {
    //   this.searchQuery = event.luogo + ", " + event.data;
    //   this.showAutocomplete = false;
    // },

    /* MAIN FUNCTION */

    //It calls the relevant functions in order to retrieve data and create the graph
    async fetchDataAndPopulateNodes() {
      try {
        const charactersData = await this.retrieveData();
        this.charactersData = charactersData;
        const eventCharacterRelations = await this.retrieveEventCharacterRelations();
        this.eventCharacterRelations = eventCharacterRelations;

        const mecenatiData = await this.retrieveMecenatiData();
        this.mecenatiData = mecenatiData;
        const mecenatiRelations = await this.retrieveEventMecenate();
        this.mecenatiRelations = mecenatiRelations;

        const repertorioData = await this.retrieveRepertorio();
        this.repertorioData = repertorioData;

        const fontiArchivistiche = await this.retrieveFontiArchivistiche();
        this.fontiArchivistiche = fontiArchivistiche;
        const fontiRelations = await this.retrieveEventFonti();
        this.fontiRelations = fontiRelations;

        const eventRepertorioRelations = await this.retrieveEventRepertorioRelations();
        this.eventRepertorioRelations = eventRepertorioRelations;

        const eventsData = await this.retrieveEvents();
        this.eventsData = eventsData;

        setTimeout((this.showEventList = true), 150);
        this.loading = false;
      } catch (error) {
        console.error("Error fetching data and populating nodes: ", error);
      }
    },

    /* DATA RETRIEVING */
    async retrieveData() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/items/Virtuose?filter[pubblicato][_eq]=1"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveEventCharacterRelations() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/Virtuose_eventi"
        );
        const responseData = await response.json();
        const data = responseData.data;
        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },
    async retrieveEventMecenate() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/eventi_mecenati"
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
          "https://directusvirtuose.vidimus.it/items/mecenati"
        );
        const responseData = await response.json();
        const data = responseData.data;
        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },
    async retrieveEventFonti() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/eventi_fonti_archivistiche"
        );
        const responseData = await response.json();
        const data = responseData.data;
        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },
    async retrieveEvents() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/items/eventi"
      );
      const responseData = await response.json();
      const data = responseData.data;

      for (const event of data) {
        // Initialize the arrays for related repertorio and characters
        event.relatedRepertorio = [];
        event.relatedCharacters = [];
        event.relatedMecenati = [];
        event.relatedFonti = [];

        // Find all matching relationships in the eventRepertorioRelations array
        const relations = this.eventRepertorioRelations.filter(
          (rel) => rel.eventi_id === event.id
        );

        // Add each related repertorio object to the event's relatedRepertorio array
        for (const relation of relations) {
          const repertorio = this.repertorioData.find(
            (rep) => rep.id === relation.repertorio_id
          );
          if (repertorio) {
            event.relatedRepertorio.push(repertorio);
          }
        }

        // Find all matching relationships in the eventRepertorioRelations array
        const mecenatiRelations = this.mecenatiRelations.filter(
          (rel) => rel.eventi_id === event.id
        );

        // Add each related repertorio object to the event's relatedRepertorio array
        for (const relation of mecenatiRelations) {
          const mecenati = this.mecenatiData.find(
            (rep) => rep.id === relation.mecenati_id
          );
          if (mecenati) {
            // Find the corresponding character from the charactersData
            const character = this.charactersData.find(
              (char) => char.id === mecenati.mecenate
            );
            if (character) {
              event.relatedMecenati.push(character);
            } else {
              console.warn(`Character not found for mecenate id: ${mecenati.mecenate}`);
            }
          } else {
            console.warn(`Mecenati not found for id: ${relation.mecenati_id}`);
          }
        }

        // Find all characters related to this event
        const eventRelations = this.eventCharacterRelations.filter(
          (rel) => rel.eventi_id === event.id
        );

        // Extract character IDs from eventRelations
        const characterIds = eventRelations.map((rel) => rel.Virtuose_id);

        // Find corresponding characters from character IDs
        const relatedCharacters = this.charactersData.filter((char) =>
          characterIds.includes(char.id)
        );

        // Add each related character to the event's relatedCharacters array
        for (const character of relatedCharacters) {
          event.relatedCharacters.push(character);
        }

        // Find all matching relationships in the eventRepertorioRelations array
        const fontRelations = this.fontiRelations.filter(
          (rel) => rel.eventi_id === event.id
        );

        // Add each related repertorio object to the event's relatedRepertorio array
        for (const relation of fontRelations) {
          const font = this.fontiArchivistiche.find(
            (rep) => rep.id === relation.fonti_archivistiche_id
          );
          if (font) {
            event.relatedFonti.push(font);
          }
        }
      }
      return data;
    },
    async retrieveEventRepertorioRelations() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/eventi_repertorio"
        );
        const responseData = await response.json();
        const data = responseData.data;
        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },

    async retrieveRepertorio() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/repertorio"
        );
        const responseData = await response.json();
        const data = responseData.data;
        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },

    async retrieveFontiArchivistiche() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/fonti_archivistiche"
        );
        const responseData = await response.json();
        const data = responseData.data;
        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
    },

    getCharacterName(id) {
      const character = this.charactersData.find((char) => char.id === id);
      return character ? character.nome_scelto : `"Non conosciuto"`;
    },
  },
};
</script>
