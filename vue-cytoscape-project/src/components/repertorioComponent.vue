<template>
  <div id="outer-container">
    <!-- EVENTS PAGE -->
    <div id="logo-container">
      <img
        v-show="loading"
        id="loading"
        src="/wp-content/themes/astra/assets/dist/img/vidimus_r.png"
        alt="Logo vidimus"
        width="500px"
      />
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
            placeholder="Cerca una persona o un repertorio..."
          />
          <ul v-if="showAutocomplete" id="autocomplete">
            <li
              v-for="song in filteredSongs"
              :key="song.titolo"
              @click="selectCharacter(song)"
              class="character"
            >
              {{ song.titolo }}
            </li>
          </ul>
          <button @click="clearSearch" id="searchBar-button">
            <img
              src="/wp-content/themes/astra/assets/dist/img/x.png"
              alt=""
              class="searchBar-button-icon"
            />
          </button>
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
              <h2>
                {{ song.titolo }}
                <span class="genere">{{
                  song.genere !== null ? "(" + song.genere + ")" : ""
                }}</span>
              </h2>
              <p v-if="song.note !== null">{{ song.note }}</p>
              <br />
              <!-- <h3 v-if="song.data !== null">Data: {{ song.data }}</h3>
              <h4 v-if="song.compositore !== null">Compositore: {{ getCharacterName(song.compositore) }}</h4> -->
              <p
                v-for="event in song.relatedEvents"
                :key="event.eventId"
                style="font-size:16px;"
              >
                Eseguito in ocasione dell'evento: 
                <strong><em>{{ getEventInfo(event.eventId) }}</em></strong>
              </p>
            </div>
            <hr class="riga" />
            <div class="block" style="margin-top: 30px">
              <p
                v-for="character in song.relatedCharacters"
                :key="character.characterId"
              >
                Cantata da:
                <a
                  :href="
                    'https://directusvirtuose.vidimus.it/admin/shared/' +
                    getPermalink(character.characterId)
                  "
                  target="_blank"
                  >{{ getCharacterName(character.characterId) }}</a
                >
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
  transition: all 0.5s ease-out;
  cursor: pointer;
}

#searchBar-container > div > button:hover {
  background-color: rgb(120, 38, 46);
  color: aliceblue;
}

.search-container {
  margin-right: 15px;
  display: flex;
  flex-direction: row;
}

.search-container > input {
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

#events {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 50px;
  padding-top: 40px;
  margin: 0;
}

#events * {
  font-family: "Source Sans 3";
}

#events > h1 {
  text-align: center;
  margin-bottom: 30px;
}

#event h2 {
  font-size: 24px;
  font-weight: 600;
  font-style: italic;
}

.genere {
  font-size: 16px;
  color: rgb(100, 9, 18);
}

#event {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#event-info > p {
  max-width: 100%;
  font-size: 16px;
}

#event-info > h3 {
  max-width: 100%;
}

#event-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 20px;
}

#event-content p,
h4 {
  font-size: 18px;
}

.block {
  max-width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.block p {
  max-width: 1200px;
  text-align: center;
  color: #3a3a3a;
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

.riga {
  max-width: 972px;
  height: 1px;
  background-color: rgba(100, 9, 18, 1);
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
      showEventList: false,
      loading: true,

      charactersData: [],
      relationsData: [],

      eventsData: [],
      eventsRelations: [],

      repertorioData: [],
      repertorioRelations: [],

      searchQuery: "",
      showAutocomplete: false,

      permaLinks: [],
    };
  },
  mounted() {
    this.fetchDataAndPopulateNodes();
  },
  computed: {
    // FILTRAR LISTA CANCIONES
    filteredSongs() {
      const query = this.searchQuery.toLowerCase().trim();

      return this.repertorioData
        .filter((song) => {
          // Comprobar título
          const matchesTitle =
            song.titolo && song.titolo.toLowerCase().includes(query);

          // Comprobar género
          const matchesGenre =
            song.genere && song.genere.toLowerCase().includes(query);

          // Comprobar personajes relacionados
          const matchesRelatedCharacters = song.relatedCharacters.some(
            (rel) => {
              const character = this.charactersData.find(
                (char) => char.id === rel.characterId
              );
              return (
                character && character.nome_scelto.toLowerCase().includes(query)
              );
            }
          );

          //Devovlver verdadero si la query coincide con alguno de los campos
          return matchesTitle || matchesGenre || matchesRelatedCharacters;
        })
        .sort((a, b) => {
          return a.titolo.localeCompare(b.titolo); //Ordenar coincidencias (por orden alfabético según título)
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

    clearSearch() {
      this.searchQuery = "";
      this.showAutocomplete = false;
    },
    getPermalink(characterId) {
      const permaLink = this.permaLinks.find(
        (link) => link.item == characterId
      );
      return permaLink;
    },

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
    updateAutocomplete() {
      if (this.searchQuery == "") {
        this.showAutocomplete = false;
      } else {
        const matchingCharacters = this.getMatchingSongs();
        this.showAutocomplete = matchingCharacters.length > 0;
      }
    },
    getMatchingSongs() {
      const query = this.searchQuery.toLowerCase().trim();
      return this.repertorioData.filter(
        (song) => song.titolo && song.titolo.toLowerCase().includes(query)
      );
    },
    selectCharacter(song) {
      this.searchQuery = song.titolo;
      this.showAutocomplete = false;
    },
    //Hace las calls a la API necesarias y despues muestra la lista
    async fetchDataAndPopulateNodes() {
      try {
        const charactersData = await this.retrieveData();
        this.charactersData = charactersData;

        const eventsData = await this.retrieveEvents();
        this.eventsData = eventsData;
        const eventsRelations = await this.retrieveEventsRepertorio();
        this.eventsRelations = eventsRelations;

        const relationsData = await this.retrieveRelations();
        this.relationsData = relationsData;

        const repertorioRelations = await this.retrieveRepertorioRelations();
        this.repertorioRelations = repertorioRelations;
        const repertorioData = await this.retrieveRepertorioData();
        this.repertorioData = repertorioData;
        console.log(this.repertorioData);

        const permaLinks = await this.retrievePermaLinks();
        this.permaLinks = permaLinks;

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
    async retrieveRelations() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/items/Virtuose_Virtuose"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveRepertorioRelations() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/items/Virtuose_repertorio"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveRepertorioData() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/items/repertorio?filter[pubblicato][_eq]=1"
      );
      const responseData = await response.json();
      const data = responseData.data;

      for (const song of data) {
        // Array para personajes relacionados
        song.relatedCharacters = [];
        song.relatedEvents = [];

        // Encontrar la relacion correspondiente en la tabla de relaciones (Virtuose_repertorio)
        const relation = this.repertorioRelations.find(
          (rel) => rel.repertorio_id === song.id
        );
        if (relation) {
          //Añade la id del personaje encontrado al array
          song.relatedCharacters.push({ characterId: relation.Virtuose_id });
        }

        const relation2 = this.eventsRelations.find(
          (rel) => rel.repertorio_id === song.id
        );
        if (relation2) {
          //Añade la id del personaje encontrado al array
          song.relatedEvents.push({ eventId: relation2.eventi_id });
        }
      }
      return data;
    },
    async retrieveEvents() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/eventi"
        );
        const eventData = await response.json();
        const events = eventData.data;
        return events;
      } catch (error) {
        console.error("Error fetching events: ", error);
        throw error;
      }
    },

    async retrieveEventsRepertorio() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/eventi_repertorio"
        );
        const eventData = await response.json();
        const events = eventData.data;
        return events;
      } catch (error) {
        console.error("Error fetching events: ", error);
        throw error;
      }
    },

    async retrievePermaLinks() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/shares"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },

    //Saca el nombre de un personaje con su id
    getCharacterName(id) {
      const character = this.charactersData.find((char) => char.id === id);
      return character ? character.nome_scelto : `"Non conosciuto"`;
    },
    getEventInfo(id) {
      const event = this.eventsData.find((ev) => ev.id === id);
      return event ? event.luogo+", "+event.data : `"Nessuna informazione sull'evento"`;
    },
  },
};
</script>
