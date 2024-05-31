<template>
  <div id="outer-container">
    <!-- GRAPH AND FUNCTIONALITIES -->
    <div id="view-switch">
      <ul class="nav2" id="grafico-lista">
        <li>
          <button
            id="lista-button"
            :class="{ selected: selectedView === 'lista' }"
            class="nav-button nav-button2 switch-button"
            @click="toggleView('lista')"
          >
            <div class="btn-text filters">Lista</div>
          </button>
        </li>
        <li>
          <button
            id="grafico-button"
            :class="{ selected: selectedView === 'grafico' }"
            class="nav-button nav-button2 switch-button"
            @click="toggleView('grafico')"
          >
            <div class="btn-text filters">Grafico</div>
          </button>
        </li>
      </ul>
    </div>
    <div v-show="showCytoscape">
      <div id="container">
        <div id="modal" v-show="showModal" @click.self="closeModal">
          <div id="search-results-modal" v-if="showSearchResults">
            <span class="close" @click="closeModal">&times;</span>
            <h2>
              Risultati per <span id="show-query">"{{ searchQuery2 }}"</span>
            </h2>
            <ul>
              <li
                v-for="result in searchResults"
                :key="result.data.id"
                @click="handleSelectResult(result)"
                class="search-result-item"
              >
                {{ getResultDisplayText(result) }}
              </li>
            </ul>
          </div>
          <div id="ev-modal" v-if="fontType === 'eventi'">
            <span class="close" @click="closeModal">&times;</span>
            <h2>{{ fontObject.luogo }}</h2>
            <br />
            <h3>{{ fontObject.data }}</h3>
            <br />
            <br />
            <p v-if="fontObject.note !== null">Note: {{ fontObject.note }}</p>
            <span style="cursor:pointer" @click="selectEvent(fontObject)">Filtra il grafico</span>
          </div>
          <div id="rep-modal" v-if="fontType === 'repertorio'">
            <span class="close" @click="closeModal">&times;</span>
            <h2>{{ fontObject.titolo }}</h2>
            <br />
            <h3>{{ fontObject.genere }}</h3>
            <br />
            <h4>{{ fontObject.data }}</h4>
            <br />
            <p v-if="fontObject.note !== null">Note: {{ fontObject.note }}</p>
            <span style="cursor:pointer" @click="selectRepertorio(fontObject)">Filtra il grafico</span>
          </div>
          <div id="fm-modal" v-if="fontType === 'musicali'">
            <span class="close" @click="closeModal">&times;</span>
            <h2>{{ fontObject.titolo }}</h2>
            <br />
            <h4>
              {{
                fontObject.compositore !== null
                  ? "Compositore: " + fontObject.compositore
                  : ""
              }}
              {{ fontObject.data !== null ? "Data: " + fontObject.data : "" }}
            </h4>
            <br />
            <p>Segnatura: {{ fontObject.segnatura }}</p>
            <p v-if="fontObject.note !== null">Note: {{ fontObject.note }}</p>
          </div>
          <div id="fa-modal" v-if="fontType === 'archivistiche'">
            <span class="close" @click="closeModal">&times;</span>
            <h2>{{ fontObject.archivio_sigla }} - {{ fontObject.archivio }}</h2>
            <br />
            <p>Busta: {{ fontObject.busta }}</p>
            <p>Carte: {{ fontObject.carte }}</p>
            <br />
            <p v-if="fontObject.note !== null">Note: {{ fontObject.note }}</p>
            <p>
              {{
                fontObject.descrizione !== null
                  ? "Descrizione: " + fontObject.descrizione
                  : ""
              }}
            </p>
            <p>
              {{
                fontObject.trascrizione !== null
                  ? "Trascrizione: " + fontObject.trascrizione
                  : ""
              }}
            </p>
          </div>
          <div id="fl-modal" v-if="fontType === 'letterarie'">
            <span class="close" @click="closeModal">&times;</span>
            <h2>{{ fontObject.titolo }}</h2>
            <br />
            <h4>
              {{
                fontObject.autore !== null
                  ? "Autore: " + fontObject.autore
                  : "Non conosciuto"
              }}<br />
              {{
                fontObject.editore !== null
                  ? "Editore: " + fontObject.editore
                  : "Non conosciuto"
              }}
            </h4>
            <p>Data: {{ fontObject.data }}</p>
            <p>Luogo: {{ fontObject.luogo }}</p>
            <br />
            <p v-if="fontObject.note !== null">Note: {{ fontObject.note }}</p>
            <p>
              {{
                fontObject.trascrizione !== null
                  ? "Trascrizione: " + fontObject.trascrizione
                  : ""
              }}
            </p>
          </div>
        </div>
        <div style="position: absolute; left: 5px">
          <button id="menu-deploy" @click="toggleFilterMenu">Menu</button>
        </div>
        <div
          v-show="filterMenuDisplay"
          id="nav-container"
          class="nav-container2"
        >
          <ul class="nav2" style="width: 100%">
            <li style="width: 100%">
              <button
                id="all"
                :class="{ selected: selectedFilter === 'all' }"
                class="nav-button nav-button2"
                @click="toggleFilter('all')"
                style="width: 100%"
              >
                <div class="btn-text filters">Network</div>
              </button>
            </li>
          </ul>
          <ul class="nav2" style="width: 100%; margin-top: -15px">
            <li id="container-reti">
              <button
                id="profesionali"
                :class="{ selected: selectedFilter === 'mecenati' }"
                class="nav-button nav-button2"
                @click="toggleFilter('work', 'mecenati')"
              >
                <div class="btn-text filters">Reti professionali</div>
              </button>
            </li>
            <li>
              <button
                id="formazione"
                :class="{ selected: selectedFilter === 'maestro' }"
                class="nav-button nav-button2"
                @click="toggleFilter('work', 'maestro')"
              >
                <div class="btn-text filters">Formazione</div>
              </button>
            </li>
            <li>
              <button
                id="family"
                :class="{ selected: selectedFilter === 'family' }"
                class="nav-button nav-button2"
                @click="toggleFilter('family')"
              >
                <div class="btn-text filters">Famiglia</div>
              </button>
            </li>
          </ul>
          <ul
            v-show="selectedFilter === 'mecenati'"
            id="nav3"
            style="z-index: 2000"
          >
            <li style="z-index: 2000">
              <MultiSelect
                v-model="selectedFilters"
                display="chip"
                :options="filterOptions"
                placeholder="Tipi di relazioni"
                optionLabel="name"
                @change="filterChange(this.selectedFilters)"
              >
              </MultiSelect>
            </li>
          </ul>
          <div class="searchBar-container">
            <div class="search-container">
              <input
                type="text"
                v-model="searchQuery"
                @input="updateAutocomplete"
                @keyup.enter="searchCharacter"
                placeholder="Cerca una persona..."
              />
              <ul v-if="showAutocomplete" class="autocomplete">
                <li
                  v-for="character in filteredCharacters"
                  :key="character.id"
                  @click="selectCharacter(character)"
                  class="character"
                >
                  {{ character.nome_scelto }}
                </li>
              </ul>
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 7px;
              "
            >
              <button @click="searchCharacter" class="searchBar-button">
                <img
                  src="/wp-content/themes/astra/assets/dist/img/search.png"
                  alt=""
                  class="searchBar-button-icon"
                />
              </button>
              <button @click="clearSearch" class="searchBar-button">
                <img
                  src="/wp-content/themes/astra/assets/dist/img/x.png"
                  alt=""
                  class="searchBar-button-icon"
                />
              </button>
            </div>
          </div>
          <div class="searchBar-container">
            <div class="search-container">
              <input
                type="text"
                v-model="searchQuery2"
                @input="updateAutocomplete"
                @keyup.enter="searchCharacter"
                placeholder="Cerca in eventi, repertorio e fonti..."
              />
              <ul v-if="showAutocomplete2" class="autocomplete">
                <li
                  v-for="character in filteredCharacters"
                  :key="character.id"
                  @click="selectCharacter(character)"
                  class="character"
                >
                  {{ character.nome_scelto }}
                </li>
              </ul>
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 7px;
              "
            >
              <button @click="searchByWord" class="searchBar-button">
                <img
                  src="/wp-content/themes/astra/assets/dist/img/search.png"
                  alt=""
                  class="searchBar-button-icon"
                />
              </button>
              <button @click="clearSearch2" class="searchBar-button">
                <img
                  src="/wp-content/themes/astra/assets/dist/img/x.png"
                  alt=""
                  class="searchBar-button-icon"
                />
              </button>
            </div>
          </div>
          <div
            id="ricerca-container"
            class="aside-subtitle"
            style="
              width: 100%;
              display: flex;
              align-items: left;
              justify-content: center;
              margin-top: 20px;
              margin-bottom: -8px;
            "
          >
            <h4
              id="ricerca-avanzata"
              @click="toggleRicercaAvanzata"
              style="
                color: rgb(130, 6, 18);
                font-size: large;
                font-family: 'Source Sans 3';
              "
            >
              Ricerca avanzata
              <img
                id="ric-arrow"
                src="/wp-content/themes/astra/assets/dist/img/arrow.png"
                alt="Search icon"
                width="20px"
              />
            </h4>
          </div>
          <hr />
          <form
            @submit.prevent="handleSubmit"
            v-show="showRicerca"
            id="ricerca-form"
          >
            <div class="field-wrapper">
              <label for="luogo">Luogo</label>
              <div class="search-container">
                <input
                  type="text"
                  id="luogo"
                  v-model="searchFields.luogo"
                  placeholder="Cerca una luogo..."
                  class="fields-input"
                />
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="luogo-filter"
                    value="AND"
                    v-model="searchFields.luogoFilter"
                  />
                  AND
                </label>
                <label>
                  <input
                    type="radio"
                    name="luogo-filter"
                    value="NOT"
                    v-model="searchFields.luogoFilter"
                  />
                  NOT
                </label>
              </div>
            </div>
            <div class="field-wrapper">
              <label for="anno">Anno</label>
              <div class="search-container">
                <input
                  type="text"
                  id="anno"
                  v-model="searchFields.anno"
                  placeholder="Cerca un anno..."
                  class="fields-input"
                />
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="anno-filter"
                    value="AND"
                    v-model="searchFields.annoFilter"
                  />
                  AND
                </label>
                <label>
                  <input
                    type="radio"
                    name="anno-filter"
                    value="NOT"
                    v-model="searchFields.annoFilter"
                  />
                  NOT
                </label>
              </div>
            </div>
            <div class="field-wrapper">
              <label for="persona">Persona</label>
              <div class="search-container">
                <input
                  type="text"
                  id="persona"
                  v-model="searchFields.persona"
                  placeholder="Cerca una persona..."
                  class="fields-input"
                />
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="persona-filter"
                    value="AND"
                    v-model="searchFields.personaFilter"
                  />
                  AND
                </label>
                <label>
                  <input
                    type="radio"
                    name="persona-filter"
                    value="NOT"
                    v-model="searchFields.personaFilter"
                  />
                  NOT
                </label>
              </div>
            </div>
            <div id="field-buttons-wrapper">
              <button type="submit">Cerca</button>
              <button type="button" @click="resetFilters">Reset</button>
            </div>
          </form>
        </div>
        <!-- Cytoscape graph-->
        <div id="cy" v-show="view == 'grafico'"></div>
        <div id="lista" v-show="view == 'lista'">
          <div
            v-for="character in filteredList"
            :key="character.id"
            @click="handleCharacterClick(character.id)"
            class="list-character"
            :class="{ highlighted: isSearchedCharacter(character) }"
          >
            {{ character.nome_scelto }}
            {{
              "(" +
              (character.luogo_nascita != null
                ? character.luogo_nascita
                : "...") +
              ", " +
              (character.data_nascita != null ? character.data_nascita : "?") +
              " - " +
              (character.luogo_morte != null ? character.luogo_morte : "...") +
              ", " +
              (character.data_morte != null ? character.data_morte : "?") +
              ")"
            }}
            <img
              v-if="character.virtuosa === true"
              src="/wp-content/themes/astra/assets/dist/img/logo_r.png"
              alt="Logo virtuosa"
              width="12px"
            />
          </div>
        </div>
        <div id="aside" v-show="showAside" style="display: flex">
          <button id="closeAside" class="nav-button nav-button2">
            <div
              class="btn-text filters"
              style="font-weight: bold; font-size: large"
            >
              x
            </div>
          </button>
          <div id="aside-content"></div>
        </div>
      </div>
      <!-- <div id="download-container">
        <button @click="downloadData">Scarica i dati</button>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@400..800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montaga&display=swap");

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

.highlighted {
  font-weight: bold;
}

#banner {
  display: flex;
  min-height: 170px;
  text-align: center;
  color: rgb(120, 38, 46);
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 100%;
}

#title {
  font-family: Montaga;
  font-size: 60px;
  margin-top: 70px;
}

#banner > img {
  left: 30px;
  position: absolute;
}

#view-switch {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#grafico-lista {
  margin: 0px;
  gap: 0px !important;
}

.switch-button {
  width: 100%;
  padding: 14px 26px 14px 26px !important;
  margin: 0;
  font-size: larger !important;
  transition: all 0.5s ease-out;
  border-radius: 10px 10px 0px 0px !important;
}

#menu-deploy {
  border: solid 2px rgb(120, 38, 46);
  background-color: white;
  color: rgb(15, 15, 15);
  font-family: Montserrat;
  font-weight: 500;
  font-size: medium;
  padding: 10px;
  float: left;
  left: 10px;
  transform: translateY(-50px);
  cursor: pointer;
}

#filter-menu {
  position: absolute;
  left: 50px;
  border: solid 2px rgb(120, 38, 46);
  z-index: 1000;
  padding: 20px;
  margin-left: 10px;
  margin-top: 15px;
}

#ricerca-avanzata {
  font-family: "Source Sans 3" !important;
  cursor: pointer;
}

#ricerca-container {
  text-align: left !important;
  margin-top: 40px !important;
}

#ric-arrow {
  margin: 0px !important;
}

#outer-container {
  padding-top: 30px;
}

#container {
  margin-top: 0px;
  display: grid;
  grid-template-columns: 30% 70%;
  justify-content: center;
  height: 100%;
}

#nav-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  align-items: center;
  left: 10px;
  padding: 15px;
  background-color: white;
  border: solid 2px rgb(120, 38, 46);
  z-index: 999;
  max-width: 600px;
}

#nav {
  display: flex;
  flex-direction: row;
  gap: 20px;
  list-style: none;
  list-style-type: none;
  margin-bottom: 20px;
}

.nav2 {
  display: flex;
  flex-direction: row;
  flex-flow: row-reverse;
  gap: 10px;
  list-style: none;
  list-style-type: none;
  z-index: 1000;
  margin-bottom: 15px;
  align-items: center;
  justify-content: space-between;
}

.nav2 > li {
  min-width: 25%;
}

#container-reti {
  width: 40%;
}

#family,
#formazione,
#profesionali {
  width: 100%;
}

#all {
  width: 100% !important;
}

#nav3 {
  display: flex;
  flex-direction: column;
  gap: 15px;
  list-style: none;
  list-style-type: none;
  z-index: 1000;
  margin-bottom: 30px;
  justify-content: right;
  width: 100%;
}

#nav3 > li {
  display: flex;
  justify-content: right;
}

li {
  height: 100%;
}

.nav-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  height: auto;
  width: 100%;
  padding: 10px;
  margin: 0;
  font-size: medium;
  border: none;
  cursor: pointer;
  background: none;
  color: rgb(76, 76, 76);
  transition: all 0.5s ease-out;
  border: solid 1px black;
  border-radius: 10px;
}

.nav-button2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.filters {
  font-weight: 500 !important;
  text-align: center;
}

.nav-button:hover {
  background: rgb(120, 38, 46);
  color: aliceblue;
}

.selected {
  background: rgb(120, 38, 46);
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
  text-align: center;
  font-size: 12px;
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
  max-width: 200px;
  padding: 10px 20px;
  border: solid 1px rgb(120, 38, 46);
  border-radius: 10px;
  background-color: rgb(244, 244, 244);
  margin: 20px;
  z-index: 999;
  overflow: visible;
}

.searchBar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.searchBar-button {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px !important;
}

.searchBar-button-icon {
  width: 18px !important;
  height: auto !important;
  margin: 0 !important;
}

.searchBar-container > div > button {
  padding: 10px;
  background: none;
  border: solid 2px rgb(100, 9, 18);
  color: rgb(76, 76, 76);
  font-family: Montserrat;
  font-weight: 600;
  font-size: small;
  transition: all 0.5s ease-out;
  cursor: pointer;
}

.searchBar-container > div > button:hover {
  background-color: rgb(120, 38, 46);
  color: aliceblue;
}

.search-container {
  margin-right: 15px;
}

.search-container > input {
  padding: 5px;
  width: 260px;
  border: solid 2px rgb(100, 9, 18);
}

.fields-input {
  width: 175px !important;
  margin: 0;
}

.field-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.field-wrapper > label {
  min-width: 75px;
  text-align: right;
}

#field-buttons-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

#field-buttons-wrapper > button {
  padding: 8px 22px 8px 22px;
  background: none;
  border: solid 2px rgb(100, 9, 18);
  color: rgb(76, 76, 76);
  font-family: Montserrat;
  font-weight: 600;
  font-size: small;
  transition: all 0.5s ease-out;
  cursor: pointer;
}

#field-buttons-wrapper > button:hover {
  background-color: rgb(120, 38, 46);
  color: aliceblue;
}

.autocomplete {
  position: absolute;
  list-style: none;
  max-height: 200px;
  max-width: 200px;
  overflow-y: scroll;
  background-color: #fafafa;
  border: solid 2px rgb(100, 9, 18);
  margin-top: 5px;
  z-index: 9000 !important;
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

#event-info > p {
  font-family: "Source Sans 3";
  max-width: 50%;
}

#event-info {
  display: flex;
  flex-direction: row;
  gap: 40px;
  margin: 20px;
}

.accordion {
  border: solid 2px rgb(100, 9, 18);
  min-width: 200px;
  height: fit-content;
}

.accordion-btn {
  cursor: pointer;
  background-color: #fafafa;
  color: #333;
  padding: 10px;
  border: none;
  width: 100%;
  text-align: center;
}

.accordion-btn:hover {
  background-color: #ddd;
}

.accordion-content {
  z-index: 1001;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.accordion-content p {
  margin: 10px 0;
  font-family: Montserrat;
  font-weight: 500;
  font-size: small;
}

#app {
  height: auto;
}

.color {
  color: rgb(177, 80, 80);
  background-color: rgb(45, 116, 59);
}

#cy {
  width: 100%;
  height: 90vh;
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

.chInfo {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  gap: 5px;
}

.chInfo h3,
.chInfo h4 {
  font-family: "Source Sans 3" !important;
  font-size: medium !important;
}

.chInfo h4 {
  font-weight: lighter;
  color: rgb(67, 67, 67);
}

.chInfo p {
  margin-bottom: 0.75em !important;
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
  left: 45%;
  min-width: 550px;
  max-width: 550px;
  min-height: 675px;
  max-height: 675px;
  overflow-y: scroll;

  background-color: white;
  border: solid 2px rgb(100, 9, 18);
  padding: 35px;
  transform: translateY(-35px);

  z-index: 1000;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#closeAside {
  position: absolute;
  right: 15px;
  top: 15px;

  background-color: rgb(100, 9, 18) !important;
  color: aliceblue !important;
  padding: 10px !important;
  font-family: Montserrat !important;
  font-weight: 800 !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;

  width: 35px;
  height: 35px;
}

#aside h3,
h4 {
  font-family: "Source Sans 3" !important;
  font-size: large !important;
}

#download-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 50px;
}

#download-container button {
  padding: 15px;
}

#modal {
  position: fixed;
  z-index: 9999 !important;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal Content */
#fm-modal,
#fa-modal,
#fl-modal,
#ev-modal,
#rep-modal,
#search-results-modal {
  position: relative;
  background-color: #fefefe;
  border: solid 2px rgb(100, 9, 18);
  margin: 30% auto;
  /* 10% from the top and centered */
  padding: 150px;
  width: 55%;
  min-height: 40%;
  max-height: 60%;
  overflow: auto;
  /* Could be more or less, depending on screen size */
}

.search-result-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.search-result-item:hover {
  background-color: #f1f1f1;
}

/* The Close Button */
.close {
  position: absolute;
  right: 30px;
  top: 20px;
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

#lista {
  max-height: 90vh;
  height: 90vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: solid 2px rgb(100, 9, 18);
  padding: 35px;
}

.list-character {
  cursor: pointer;
  font-size: large;
}
</style>

<script>
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import MultiSelect from "primevue/multiselect";

cytoscape.use(fcose);

export default {
  components: {
    MultiSelect,
  },
  data() {
    return {
      showCytoscape: true,
      showEventList: false,
      showPopup: false,
      showAside: false,

      //Multi-select config
      selectedFilters: [],
      filterOptions: [],

      isPanning: false,
      initialPointerPosition: { x: 0, y: 0 },
      nodeClicked: false,
      popupInfo: {},
      clickedNode: null,
      hoverTimeout: null,

      filterMenuDisplay: true,

      charactersData: [],
      relationsData: [],
      maestroRelations: [],
      mecenatiRelations: [],
      maestroData: [],
      mecenatiData: [],
      tipoMecenate: [],
      eventsData: [],
      repertorioRelations: [],
      repertorioData: [],
      sostegnoRelations: [],
      sostegnoData: [],

      fontiMusicali: [],
      fontiArchivistiche: [],
      fontiLetterarie: [],

      cy: null,
      cyData: null,
      filter: "all",
      workFilter: "",
      eventFilter: false,
      layout1: {
        name: "fcose",
        nodeRepulsion: 35000,
        randomize: true,
        idealEdgeLength: 90,
        numIter: 30000,
        nestingFactor: 1000,
        componentSpacing: 1000,
        nodeOverlap: 10000,
        animate: false,
      },
      layout2: {
        name: "fcose",
        nodeRepulsion: 150000,
        randomize: true,
        idealEdgeLength: 80,
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
      selectedRepertorio: null,
      selectedFilter: "all",
      searchQuery: "",
      searchQuery2: "",
      showAutocomplete: false,
      showAutocomplete2: false,
      accordionState: {},

      filteredData: [],

      showModal: false,
      fontObject: null,
      showSearchResults: false,

      selectedView: "grafico",
      view: "grafico",

      searchFields: {
        luogo: "",
        luogoFilter: "AND",
        anno: "",
        annoFilter: "AND",
        persona: "",
        personaFilter: "AND",
      },

      permaLinks: [],
      showRicerca: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.fetchDataAndPopulateNodes();
    }, 100);
    document.addEventListener("click", this.hidePopupOutside.bind(this));
  },
  computed: {
    isSearchedCharacter() {
      if (this.searchQuery === "") {
        // If search query is empty, return a function that always returns false
        return () => false;
      } else {
        // If search query is not empty, return a function that checks if character's name includes the search query
        return (character) =>
          character.nome_scelto
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
      }
    },
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
    filteredList() {
      if (!this.cy) {
        return [];
      }
      var visibleNodeIds = this.cy
        .nodes(":visible")
        .map((node) => parseInt(node.data("id")));
      return this.charactersData.filter((character) =>
        visibleNodeIds.includes(character.id)
      );
    },
  },
  methods: {
    searchInObjects(array, query) {
      const lowerCaseQuery = query.toLowerCase();

      function searchInObject(obj) {
        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (
              typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseQuery)
            ) {
              return true;
            }
            if (typeof value === "object" && value !== null) {
              if (Array.isArray(value)) {
                if (value.some((item) => searchInObject(item))) {
                  return true;
                }
              } else {
                if (searchInObject(value)) {
                  return true;
                }
              }
            }
          }
        }
        return false;
      }

      return array.filter((obj) => searchInObject(obj));
    },
    searchByWord() {
      const query = this.searchQuery2.toLowerCase().trim();
      if (!query) {
        this.clearSearch2();
        return;
      }

      const matchingCharacters = this.searchInObjects(
        this.charactersData,
        query
      );
      const matchingEvents = this.searchInObjects(this.eventsData, query);
      const matchingRepertories = this.searchInObjects(
        this.repertorioData,
        query
      );
      const matchingFM = this.searchInObjects(this.fontiMusicali, query);
      const matchingFA = this.searchInObjects(this.fontiArchivistiche, query);
      const matchingFL = this.searchInObjects(this.fontiLetterarie, query);
      // Add more data arrays as needed

      this.searchResults = [
        ...matchingCharacters.map((char) => ({
          type: "character",
          data: char,
        })),
        ...matchingEvents.map((event) => ({ type: "eventi", data: event })),
        ...matchingRepertories.map((rep) => ({
          type: "repertorio",
          data: rep,
        })),
        ...matchingFM.map((font) => ({ type: "musicali", data: font })),
        ...matchingFA.map((font) => ({ type: "archivistiche", data: font })),
        ...matchingFL.map((font) => ({ type: "letterarie", data: font })),
        // Add more mappings as needed
      ];

      if (this.searchResults.length > 0) {
        this.showSearchResults = true;
        this.showModal = true;
      } else {
        alert("No results found");
      }
    },

    getResultDisplayText(result) {
      switch (result.type) {
        case "character":
          return result.data.nome_scelto;
        case "eventi":
          return `${result.data.titolo} | ${result.data.data} (Evento)`;
        case "repertorio":
          return `${result.data.titolo} (Repertorio)`;
        case "musicali":
          return `${result.data.titolo} (F. Musicale)`;
        case "archivistiche":
          return `${result.data.archivio_sigla} - ${result.data.fondo} (F. Archivistiche)`;
        case "letterarie":
          return `${result.data.titolo} (F. Letterarie)`;
        default:
          return "Unknown";
      }
    },
    handleSelectResult(result) {
      console.log("Selected result:", result);

      if (result.type === 'character') {
        this.filterGraph(result.data);
      } else {
        this.showDetailedInfo(result.data, result.type);
      }
    },
    showDetailedInfo(data, type) {
      this.fontObject = data;
      this.fontType = type;
      this.openModal();
      this.showSearchResults = false;
    },

    clearSearch2() {
      // Implement logic to clear the search results
      this.showAllNodes();
      this.searchQuery2 = "";
      this.cy.fit(this.cy.nodes(":visible"), 100);
      this.cy.zoom(0.45);
    },
    filterCharacterList() {
      return this.charactersData.sort((a, b) => {
        return a.nome_scelto.localeCompare(b.nome_scelto); // Sort alphabetically by character name
      });
    },
    handleSubmit() {
      // Handle the form submission logic here
      console.log(this.searchFields);
      // Perform your search or filter action
    },
    resetFilters() {
      this.searchFields = {
        luogo: "",
        luogoFilter: "AND",
        anno: "",
        annoFilter: "AND",
        mecenate: "",
        mecenateFilter: "AND",
      };
    },
    toggleRicercaAvanzata() {
      if (document.getElementById("ricerca-form").style.display !== "none") {
        this.showRicerca = !this.showRicerca;
        document.getElementById("ric-arrow").style.transform = "rotate(360deg)";
      } else {
        this.showRicerca = !this.showRicerca;
        document.getElementById("ric-arrow").style.transform = "rotate(180deg)";
      }
    },
    toggleFilterMenu() {
      this.filterMenuDisplay = !this.filterMenuDisplay;
      if (this.filterMenuDisplay == false) {
        document.getElementById("container").style.gridTemplateColumns = "100%";
        this.cy.fit(this.cy.nodes(":visible"), 100);
        this.cy.zoom(0.8);
      } else {
        document.getElementById("container").style.gridTemplateColumns =
          "30% 70%";
        this.cy.fit(this.cy.nodes(":visible"), 100);
        this.cy.zoom(0.65);
      }
    },
    downloadData() {
      // Extracting IDs from visible nodes
      const visibleNodeIds = this.cy
        .nodes(":visible")
        .map((node) => parseInt(node.data().id, 10));

      // Filter charactersData based on visible node IDs
      const filteredCharactersData = this.charactersData
        .filter((character) => visibleNodeIds.includes(character.id))
        .map((character) => ({
          id: character.id,
          nome: character.nome + character.cognome,
          data_nascita: character.data_nascita,
          data_morte: character.data_morte,
          luogo_nascita: character.luogo_nascita,
          luogo_morte: character.luogo_morte,
          padre: this.getCharacterName(character.padre),
          madre: this.getCharacterName(character.madre),
          padrino: this.getCharacterName(character.padrino),
          madrina: this.getCharacterName(character.madrina),
          marito_moglie: this.getCharacterName(character.marito_moglie),
          figli_figlie: character.figli_figlie
            .map((childId) => this.getCharacterName(childId))
            .join(", "),
          fratelli_sorelle: character.fratelli_sorelle
            .map((fra_sor) => this.getCharacterName(fra_sor))
            .join(", "),
          maestro: character.maestro
            .map((maestroId) => this.getCharacterName(maestroId))
            .join(", "),
          mecenati: character.mecenati
            .map((mecenateId) => this.getCharacterName(mecenateId))
            .join(", "),
          eventi: character.eventi
            .map((eventId) => {
              const event = this.eventsData.find(
                (event) => event.id === eventId
              );
              return event ? `${event.data} - ${event.luogo}` : "";
            })
            .join(" | "),
          fonti_musicali: character.fonti_musicali
            .map((fontiId) => {
              const fonti = this.fontiMusicali.find(
                (fonti) => fonti.id === fontiId
              );
              return fonti ? `${fonti.titolo} - ${fonti.compositore}` : "";
            })
            .join(" | "),
          fonti_archivistiche: character.fonti_archivistiche
            .map((fontiId) => {
              const fonti = this.fontiArchivistiche.find(
                (fonti) => fonti.id === fontiId
              );
              return fonti
                ? `${fonti.archivio_sigla} - ${fonti.busta} - ${fonti.carte}`
                : "";
            })
            .join(" | "),
          fonti_letterarie: character.fonti_letterarie
            .map((fontiId) => {
              const fonti = this.fontiLetterarie.find(
                (fonti) => fonti.id === fontiId
              );
              return fonti ? `${fonti.titolo} - ${fonti.autore}` : "";
            })
            .join(" | "),
        }));

      // Convert filtered data to JSON
      const jsonData = JSON.stringify(filteredCharactersData, null, 2);

      // Create a blob
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "filtered_data.json";

      // Append link to document body and trigger click
      document.body.appendChild(link);
      link.click();

      // Revoke the URL and remove the link element
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    async toggleFilter(filterValue, secondaryFilter = null) {
      if (this.filter !== filterValue || this.workFilter !== secondaryFilter) {
        this.filter = filterValue;
        this.selectedFilter = filterValue;
        await this.fetchDataAndPopulateNodes();
        if (secondaryFilter) {
          this.selectedFilter = secondaryFilter;
          this.workFilter = secondaryFilter;
          this.filterGraphByWork();
        }
      }
    },
    filterGraphByWork() {
      this.cy.elements().hide();

      // Get the selected work type from the work filter
      const selectedWorkType = this.workFilter;

      // If no work type is selected, show all edges and nodes
      if (!selectedWorkType || selectedWorkType === "all") {
        this.cy.elements().show();
      } else {
        // Iterate over all edges and show/hide them based on the selected work type
        this.cy.edges().forEach((edge) => {
          const edgeType = edge.data("type"); // Assuming you have a data field for the relationship type

          if (edgeType === selectedWorkType) {
            // Show the edge
            edge.show();

            // Show the source and target nodes of the edge
            const sourceId = edge.source().id();
            const targetId = edge.target().id();
            this.cy.getElementById(sourceId).show();
            this.cy.getElementById(targetId).show();
          }
        });
      }
      // Fit the graph to the displayed elements
      this.cy.fit(this.cy.nodes(":visible"), 420);
    },

    toggleView(filterValue) {
      if (this.view !== filterValue) {
        this.view = filterValue;
        this.selectedView = filterValue;
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
      this.closeModal();
      this.filterGraphByEvent();
    },
    selectRepertorio(repertorio) {
      this.selectedRepertorio = repertorio.id;
      this.closeModal();
      this.filterGraphByRepertorio();
    },
    isNodeRelatedToEvent(node, selectedEventId) {
      return node.data().info.eventi.includes(selectedEventId);
    },
    isNodeRelatedToRepertorio(node, selectedRepertorioId) {
      return node.data().info.repertorio.includes(selectedRepertorioId);
    },
    isNodeRelatedToFontType(node, fontType, fontId) {
      switch (fontType) {
        case "musicali":
          return node.data().info.fontiMusicali.includes(fontId);
        case "archivistiche":
          return node.data().info.fontiArchivistiche.includes(fontId);
        case "letterarie":
          return node.data().info.fontiLetterarie.includes(fontId);
        default:
          return false;
      }
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
    filterGraphByRepertorio() {
      console.log(this.selectedRepertorio);
      this.showAllNodes();
      this.cy.nodes().forEach((node) => {
        const related = this.isNodeRelatedToRepertorio(
          node,
          this.selectedRepertorio
        );
        if (!related) {
          node.hide();
        }
      });
      const relatedNodes = this.cy.nodes().filter((node) => {
        return this.isNodeRelatedToRepertorio(node, this.selectedRepertorio);
      });
      if (relatedNodes.length > 0) {
        this.cy.fit(relatedNodes, 420);
      }
    },
    filterGraphByFontType(fontType, font) {
      this.showAllNodes();
      this.cy.nodes().forEach((node) => {
        const related = this.isNodeRelatedToFontType(node, fontType, font.id);
        if (!related) {
          node.hide();
        }
      });
      const relatedNodes = this.cy.nodes().filter((node) => {
        return this.isNodeRelatedToFontType(node, fontType, font.id);
      });
      if (relatedNodes.length > 0) {
        this.cy.fit(relatedNodes, 420);
      }
    },

    /* CHARACTER SEARCH LOGIC */
    filterChange(selectedFilters) {
      if (selectedFilters.length < 1) {
        this.showAllNodes();
      } else {
        this.filterGraphByRelations(this.selectedFilters);
      }
    },

    filterGraphByRelations(selectedFilters) {
      console.log(selectedFilters);
      this.cy.elements().hide();

      const selectedFiltersIds = selectedFilters.map((filter) => filter.id);

      this.cy.edges().forEach((edge) => {
        const sourceId = edge.source().id();
        const targetId = edge.target().id();
        const mecenateType = edge.data().mecenatiType;

        console.log(`Edge ID: ${edge.id()}, Mecenati Type: ${mecenateType}`);

        if (selectedFiltersIds.includes(mecenateType)) {
          edge.show();
          this.cy.getElementById(sourceId).show();
          this.cy.getElementById(targetId).show();
        }
      });

      this.cy.fit(this.cy.nodes(":visible"), 420);
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
        this.cy.fit(characterNode, 360);
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
    clearSearch() {
      this.showAllNodes();
      this.searchQuery = "";
      this.cy.fit(this.cy.nodes(":visible"), 100);
      this.cy.zoom(0.45);
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
      const baseSize = 50;
      const sizeIncrement = 10;
      const maxSize = 140;

      if (connections < 5) {
        if (node.data("info").virtuosa !== true) {
          node.style({
            "background-color": "rgba(255, 255, 255, 0)",
          });
        }
      }

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
                    ? `url(https://directusvirtuose.vidimus.it/assets/${info.icona})`
                    : "none";
                },
                "background-fit": "cover",
                "background-color": (node) => {
                  const info = node.data("info");
                  return info.virtuosa ? "rgb(100, 9, 18)" : "#96b8d2";
                },

                // "background-image": (node) => {
                //   const info = node.data("info");
                //   return info.virtuosa ? `url(https://directusvirtuose.vidimus.it/assets/${info.icona})` : "#96b8d2";
                // },

                "border-width": (node) => {
                  const info = node.data("info");
                  return info.virtuosa ? "6px" : "8px";
                },
                "border-color": (node) => {
                  const info = node.data("info");
                  return info.virtuosa ? "rgb(120, 38, 46)" : "#96b8d2";
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
                width: 4,
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
                // "line-style": (edge) => {
                //   const relation = edge.data();
                //   if (relation.type === "maestro") {
                //     return 'dashed';
                //   } else if (relation.type === "mecenati") {
                //     return 'dotted';
                //   } else {
                //     return 'solid';
                //   }
                // },
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

        const repertorioRelations = await this.retrieveRepertorioRelations();
        this.repertorioRelations = repertorioRelations;
        const repertorioData = await this.retrieveRepertorioData();
        this.repertorioData = repertorioData;

        const sostegnoRelations = await this.retrieveSostegnoRelations();
        this.sostegnoRelations = sostegnoRelations;
        const sostegnoData = await this.retrieveSostegnoData();
        this.sostegnoData = sostegnoData;

        const fontiMusicali = await this.retrieveFontiMusicali();
        this.fontiMusicali = fontiMusicali;
        const fontiArchivistiche = await this.retrieveFontiArchivistiche();
        this.fontiArchivistiche = fontiArchivistiche;
        const fontiLetterarie = await this.retrieveFontiLetterarie();
        this.fontiLetterarie = fontiLetterarie;

        const tipoMecenate = await this.retrieveTipoMecenate();
        this.filterOptions = tipoMecenate.map((filter) => {
          return {
            id: filter.id,
            name: filter.tipologia,
          };
        });

        const permaLinks = await this.retrievePermaLinks();
        this.permaLinks = permaLinks;

        const combinedMaestroData = this.combineMaestroData(
          maestroRelations,
          maestroData
        );
        const combinedMecenatiData = this.combineMecenatiData(
          mecenatiRelations,
          mecenatiData
        );

        const combinedSostegnoData = this.combineSostegnoData(
          sostegnoRelations,
          sostegnoData
        );

        this.updateCharacterMaestroRelations(combinedMaestroData);
        this.updateCharacterMecenatiRelations(combinedMecenatiData);
        this.updateCharacterSostegnoRelations(combinedSostegnoData);

        this.updateCharacterEvents(
          charactersData,
          await this.retrieveEventRelations()
        );

        this.combineData();

        this.cyData = this.formatDataForCytoscape(
          charactersData,
          this.maestroRelations,
          this.mecenatiRelations,
          this.sostegnoRelations,
          this.maestroData,
          this.mecenatiData,
          this.sostegnoData
        );

        this.filterCharacterList();

        //console.log(cyData);
        this.loadLayout();
        this.populateCytoscapeGraph();
        this.addCytoscapeEventListeners();
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
    async retrieveEventRelations() {
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
    async retrieveMaestroRelations() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/Virtuose_maestro"
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
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/maestro"
        );
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
          "https://directusvirtuose.vidimus.it/items/Virtuose_mecenati"
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
    async retrieveTipoMecenate() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/tipo_mecenate"
        );
        const responseData = await response.json();
        const data = responseData.data;

        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
        throw error;
      }
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
    async retrieveFontiMusicali() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/items/fonti_musicali"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveFontiArchivistiche() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/items/fonti_archivistiche"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveFontiLetterarie() {
      const response = await fetch(
        "https://directusvirtuose.vidimus.it/items/Fonti_letterarie"
      );
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    },
    async retrieveSostegnoData() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/sostegno_economico"
        );
        const responseData = await response.json();
        const sostegnoData = responseData.data;

        return sostegnoData;
      } catch (error) {
        console.error("Error fetching maestro relations data: ", error);
        throw error;
      }
    },
    async retrieveSostegnoRelations() {
      try {
        const response = await fetch(
          "https://directusvirtuose.vidimus.it/items/Virtuose_sostegno_economico"
        );
        const responseData = await response.json();
        const data = responseData.data;

        return data;
      } catch (error) {
        console.error("Error fetching event relations: ", error);
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
      return mecenatiRelations
        .filter(
          (relation) =>
            relation.mecenati_id !== null && relation.Virtuose_id !== null
        ) // Filter out relations with null mecenati_id or Virtuose_id
        .map((relation) => {
          const mecenati = mecenatiData.find(
            (mecenati) => mecenati.id === relation.mecenati_id
          );

          if (!mecenati) {
            console.error(
              `Mecenati with ID ${relation.mecenati_id} not found in mecenatiData.`
            );
            return {
              relation,
              mecenati: null,
              mecType: null,
            };
          }

          return {
            relation,
            mecenati: mecenati.mecenate,
            mecType: mecenati.tipo_mecenate,
          };
        });
    },
    combineSostegnoData(sostegnoRelations, sostegnoData) {
      return sostegnoRelations
        .filter(
          (relation) =>
            relation.sostegno_economico_id !== null &&
            relation.Virtuose_id !== null
        ) // Filter out relations with null mecenati_id or Virtuose_id
        .map((relation) => {
          const sostegno = sostegnoData.find(
            (sostegno) => sostegno.id === relation.sostegno_economico_id
          );

          if (!sostegno) {
            console.error(
              `Mecenati with ID ${relation.sostegno_economico_id} not found in mecenatiData.`
            );
            return {
              relation,
              mecenati: null,
              mecType: null,
            };
          }

          return {
            relation,
            sostegno: sostegno.persona,
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
          // Update character's mecenati relations
          if (!character.mecenati) {
            character.mecenati = [];
          }
          character.mecenati.push(mecenati);
        }
      });
    },
    updateCharacterSostegnoRelations(combinedSostegnoData) {
      this.charactersData.forEach((character) => {
        character.sostegno = [];
      });
      combinedSostegnoData.forEach(({ relation, sostegno }) => {
        const character = this.charactersData.find(
          (char) => char.id === relation.Virtuose_id
        );
        if (character) {
          // Update character's mecenati relations
          if (!character.sostegno) {
            character.sostegno = [];
          }
          character.sostegno.push(sostegno);
        }
      });
    },
    getCharacterName(id) {
      const character = this.charactersData.find((char) => char.id === id);
      return character
        ? character.nome + " " + character.cognome
        : `"Non conosciuto"`;
    },

    //Transforms characters data into cytoscape format
    formatDataForCytoscape(
      charactersData,
      maestroRelations,
      mecenatiRelations,
      sostegnoRelations,
      maestroData,
      mecenatiData,
      sostegnoData
    ) {
      const nodes = charactersData.map((character) => {
        //console.log(character);
        return {
          data: {
            id: character.id,
            label: character.nome_scelto,
            info: character,
            relationships: {
              mother: null,
              father: null,
              children: [],
              siblings: [],
              spouse: null,
              maestro: [],
              mecenati: [],
              mecenateType: null,
              sostegno: [],
            },
          },
        };
      });

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
          node.data.relationships.mecenateType;
        }
      });

      this.sostegnoRelations.forEach((relation) => {
        const node = nodes.find(
          (node) => node.data.id === relation.Virtuose_id
        );
        if (node) {
          node.data.relationships.sostegno.push(relation.sostegno_economico_id);
        }
      });

      const edges = this.extractEdgesFromCharacters(
        charactersData,
        maestroRelations,
        mecenatiRelations,
        sostegnoRelations,
        maestroData,
        mecenatiData,
        sostegnoData
      );
      this.updateRelationships(nodes, edges);
      return { nodes, edges };
    },

    //Organizes all relations
    extractRelatives(
      character,
      maestroRelations,
      mecenatiRelations,
      sostegnoRelations,
      maestroData,
      mecenatiData,
      sostegnoData
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
        sostegnoRelations.forEach((relation) => {
          if (relation.Virtuose_id === character.id) {
            const sostegno = sostegnoData.find(
              (m) => m.id === relation.sostegno_economico_id
            );
            if (sostegno) {
              relatives.push(sostegno.persona);
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
      sostegnoRelations,
      maestroData,
      mecenatiData,
      sostegnoData
    ) {
      const edges = [];
      charactersData.forEach((character) => {
        const relatives = this.extractRelatives(
          character,
          maestroRelations,
          mecenatiRelations,
          sostegnoRelations,
          maestroData,
          mecenatiData,
          sostegnoData
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
            let mecenateType = null;

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
                  mecenateType = mecenati.tipo_mecenate;
                }
              }
              const sostegno = sostegnoData.find(
                (m) => m.persona === relativeId
              );
              if (sostegno) {
                if (
                  sostegnoRelations.some(
                    (relation) =>
                      relation.Virtuose_id === character.id &&
                      sostegno.persona === relativeId
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
                mecenatiType: mecenateType,
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

        const maxX = cyContainer.offsetWidth + 150;
        const maxY = cyContainer.offsetHeight + 150;
        const minX = -cyContainer.offsetWidth * 0.95;
        const minY = -cyContainer.offsetHeight * 0.95;

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
      event.target.connectedEdges().style({
        "line-color": "#ff0000", // Change to desired color
        width: "12px", // Change to desired width
      });
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
          ? `/wp-content/themes/astra/assets/dist/img/logo_r.png`
          : "";
        // const imageSrc =
        //   info.icona !== null
        //     ? `https://directusvirtuose.vidimus.it/assets/${info.icona}`
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
        //   ${
        //   imageSrc !== ""
        //     ? `<img src="${imageSrc}" style="max-width:250px;max-height:300px;" alt="Icona" id="picture">`
        //     : ""
        // }

        // Construct the popup content
        popup.innerHTML = `
        <div id="content">
          

          
            <div class="chInfo">
              <h3 style="margin-left:10px"><b>${
                info.nome + " " + info.cognome
              }</b>${
          logoSrc !== ""
            ? `<img src="${logoSrc}" style="max-width:25px;margin-left:10px" alt="Logo" class="logo">`
            : ""
        }
              </h3>
        <h4 style="margin-left:10px">${pseudonimo}</h4>
        <br>
                ${nascita}
                ${morte}        
                ${fatherSection}
                ${motherSection}
            </div>
        </div>
    `;

        var position = event.target.renderedPosition();
        // console.log("Position: ", position);
        var cyContainer = document.getElementById("cy");
        var popupHeight = popup.offsetHeight;
        var popupWidth = popup.offsetWidth;

        var popupOffsetX = -250;
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
          popup.style.width = "300px";
          popup.style.height = "auto";
          popup.style.opacity = "1";
          popup.style.zIndex = "4999";

          // Add event listener to hide the popup when clicking outside of it
          document.addEventListener("click", this.hidePopupOutside);
        }, 200);

        event.stopPropagation();
      }, 750);
    },
    closeAside() {
      document
        .getElementById("closeAside")
        .removeEventListener("click", this.closeAside);
      this.showAside = false;
    },
    handleNodeLeave(event) {
      // Clear the timeout if the mouse leaves the node before the delay
      clearTimeout(this.hoverTimeout);
      event.target.connectedEdges().style({
        "line-color": "", // Reset to default color
        width: "", // Reset to default width
      });
    },
    handleNodeClick(event) {
      // Show detailed info about the clicked node in the aside section

      const node = event.target;
      const info = node.data("info");
      const relations = node.data("relationships");

      const content = document.getElementById("aside-content");

      const logoSrc = info.virtuosa
        ? `/wp-content/themes/astra/assets/dist/img/logo_r.png`
        : "";
      const imageSrc =
        info.icona !== null
          ? `https://directusvirtuose.vidimus.it/assets/${info.icona}`
          : "";

      const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      const dateUpdated = formatDate(info.date_updated);

      // Construct the content for the aside section
      content.innerHTML = `
      <div id="content"><br>
      <div class="chInfo">
        <h3 style="margin-left:10px"><b>${info.nome + " " + info.cognome}</b>${
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
        <h4 id="famiglia-trigger" class="aside-subtitle" style="cursor:pointer;">Famiglia <img id="fam-arrow" src="/wp-content/themes/astra/assets/dist/img/arrow.png" alt="Search icon" width="15px"></h4>
        <hr>
        <div id="famiglia-info">
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
          info.fratelli_sorelle && info.fratelli_sorelle.length > 0
            ? `<p><b>Fratelli/Sorelle:</b> ${info.fratelli_sorelle
                .map((sibling) => this.getCharacterName(sibling))
                .join(", ")}</p>`
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
        }
      </div>
        <br>
        <h4 id="formazione-trigger" class="aside-subtitle" style="cursor:pointer;">Formazione <img id="form-arrow" src="/wp-content/themes/astra/assets/dist/img/arrow.png" alt="Search icon" width="15px"></h4>
        <hr>
        <div id="formazione-info">
        ${
          info.maestro && info.maestro.length > 0
            ? `<p><b>Maestro:</b> ${info.maestro
                .map((maestroId) => this.getCharacterName(maestroId))
                .join(", ")}</p>`
            : ""
        }
        </div>
        <br>
        <h4 id="attivita-trigger" class="aside-subtitle" style="cursor:pointer;">Attivita <img id="att-arrow" src="/wp-content/themes/astra/assets/dist/img/arrow.png" alt="Search icon" width="15px"></h4>
        <hr>
        <div id="attivita-info">
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
        ${
          info.repertorio && info.repertorio.length > 0
            ? `<p><b>Repertorio:</b> ${info.repertorio
                .map((repertorioId) => {
                  const song = this.repertorioData.find(
                    (song) => song.id === repertorioId
                  );
                  return song ? `${song.titolo} - ${song.genere}` : "";
                })
                .join(" | ")}</p>`
            : ""
        }
        ${
          info.mecenati && info.mecenati.length > 0
            ? `<p><b>Mecenati:</b> ${info.mecenati
                .map((mecenatiId) => this.getCharacterName(mecenatiId))
                .join(", ")}</p>`
            : ""
        }
        ${
          info.sostegno && info.sostegno.length > 0
            ? `<p><b>Sostegno economico:</b> ${info.sostegno
                .map((sostegnoId) => this.getCharacterName(sostegnoId))
                .join(", ")}</p>`
            : ""
        }
        </div>
        <br>
        <h4 id="fonti-trigger" class="aside-subtitle" style="cursor:pointer;">Fonti <img id="font-arrow" src="/wp-content/themes/astra/assets/dist/img/arrow.png" alt="Search icon" width="15px"></h4>
        <hr>
        <div id="fonti-info">
        ${
          info.fonti_musicali && info.fonti_musicali.length > 0
            ? `<p><b>Fonti musicali:</b> <br>${info.fonti_musicali
                .map((fontiId) => {
                  const fonti = this.fontiMusicali.find(
                    (fonti) => fonti.id === fontiId
                  );
                  return fonti
                    ? `<a href="" class="fontLink fMusicale" id="fm-${fonti.id}">${fonti.titolo} - ${fonti.compositore}</a>`
                    : "";
                })
                .join("<br>")}</p>`
            : ""
        }
        ${
          info.fonti_archivistiche && info.fonti_archivistiche.length > 0
            ? `<p><b>Fonti archivistiche:</b> <br>${info.fonti_archivistiche
                .map((fontiId) => {
                  const fonti = this.fontiArchivistiche.find(
                    (fonti) => fonti.id === fontiId
                  );
                  return fonti
                    ? `<a href="" class="fontLink fArchivistiche" id="fa-${fonti.id}">${fonti.archivio_sigla} - ${fonti.busta} - ${fonti.carte}</a>`
                    : "";
                })
                .join("<br>")}</p>`
            : ""
        }
        ${
          info.fonti_letterarie && info.fonti_letterarie.length > 0
            ? `<p><b>Fonti letterarie:</b> <br>${info.fonti_letterarie
                .map((fontiId) => {
                  const fonti = this.fontiLetterarie.find(
                    (fonti) => fonti.id === fontiId
                  );
                  return fonti
                    ? `<a href="" class="fontLink fLetterarie" id="fl-${
                        fonti.id
                      }">${fonti.titolo} - ${
                        fonti.autore !== null ? fonti.autore : "Non conosciuto"
                      }</a>`
                    : "";
                })
                .join("<br>")}</p>`
            : ""
        }
        </div>
        <br>
        ${
          imageSrc !== ""
            ? `<img src="${imageSrc}" style="max-width:250px;max-height:300px;margin-bottom:15px" alt="Icona" id="picture">`
            : ""
        }
        <div id="autore" style="font-size:smaller;text-align:right;margin-top:70px">
          ${"Data di modifica: " + dateUpdated}<br>
          ${
            info.autore_scheda !== null
              ? "Creato da: " + info.autore_scheda
              : ""
          } <br>
          <a href="/wp-content/themes/astra/assets/scheda/index.html" target="_blank">PermaLink</a>
              
        </div>
      </div>
    </div>
  `;

      // Show the aside section
      this.showAside = true;
      // if (document.getElementById('famiglia-info').innerHTML == "") {

      // }
      document
        .getElementById("famiglia-trigger")
        .addEventListener("click", this.toggleFamigliaInfo);
      document
        .getElementById("formazione-trigger")
        .addEventListener("click", this.toggleFormazioneInfo);
      document
        .getElementById("attivita-trigger")
        .addEventListener("click", this.toggleAttivitaInfo);
      document
        .getElementById("fonti-trigger")
        .addEventListener("click", this.toggleFontiInfo);
      document
        .getElementById("closeAside")
        .addEventListener("click", this.closeAside);
      document.querySelectorAll(".fontLink").forEach((link) => {
        link.addEventListener("click", this.showFontDetails);
      });

      localStorage.removeItem("nodeInfo");
      localStorage.removeItem("nodeRelations");

      // Store the data in local storage
      localStorage.setItem("nodeInfo", JSON.stringify(info));
      localStorage.setItem("nodeRelations", JSON.stringify(relations));
    },
    handleCharacterClick(characterId) {
      // Find the corresponding node in Cytoscape
      const node = this.cy.getElementById(characterId);

      // Check if the node exists
      if (node.length > 0) {
        // Create a mock event object
        const mockEvent = { target: node };
        // Call handleNodeClick with the mock event
        this.handleNodeClick(mockEvent);
      } else {
        console.error(`Node with id ${characterId} not found`);
      }
    },
    showFontDetails(event) {
      // Prevent default link behavior
      event.preventDefault();

      // Extract font type and ID from element's classes or attributes
      const fontType = event.target.classList.contains("fMusicale")
        ? "musicali"
        : event.target.classList.contains("fArchivistiche")
        ? "archivistiche"
        : event.target.classList.contains("fLetterarie")
        ? "letterarie"
        : "";

      const fontId = event.target.id.substring(3);
      let fontObject = null;

      switch (fontType) {
        case "musicali":
          fontObject = this.fontiMusicali.find((font) => font.id == fontId);
          break;

        case "archivistiche":
          fontObject = this.fontiArchivistiche.find(
            (font) => font.id == fontId
          );
          break;

        case "letterarie":
          fontObject = this.fontiLetterarie.find((font) => font.id == fontId);
          break;

        default:
          break;
      }

      if (fontObject) {
        this.fontObject = fontObject;
        this.fontType = fontType;
        this.openModal();
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.fontObject = null;
      this.fontType = "";
    },
    toggleFamigliaInfo() {
      if (document.getElementById("famiglia-info").style.display !== "none") {
        document.getElementById("famiglia-info").style.display = "none";
        document.getElementById("fam-arrow").style.transform = "rotate(360deg)";
      } else {
        document.getElementById("famiglia-info").style.display = "block";
        document.getElementById("fam-arrow").style.transform = "rotate(180deg)";
      }
    },
    toggleFormazioneInfo() {
      if (document.getElementById("formazione-info").style.display !== "none") {
        document.getElementById("formazione-info").style.display = "none";
        document.getElementById("form-arrow").style.transform =
          "rotate(360deg)";
      } else {
        document.getElementById("formazione-info").style.display = "block";
        document.getElementById("form-arrow").style.transform =
          "rotate(180deg)";
      }
    },
    toggleAttivitaInfo() {
      if (document.getElementById("attivita-info").style.display !== "none") {
        document.getElementById("attivita-info").style.display = "none";
        document.getElementById("att-arrow").style.transform = "rotate(360deg)";
      } else {
        document.getElementById("attivita-info").style.display = "block";
        document.getElementById("att-arrow").style.transform = "rotate(180deg)";
      }
    },
    toggleFontiInfo() {
      if (document.getElementById("fonti-info").style.display !== "none") {
        document.getElementById("fonti-info").style.display = "none";
        document.getElementById("font-arrow").style.transform =
          "rotate(360deg)";
      } else {
        document.getElementById("fonti-info").style.display = "block";
        document.getElementById("font-arrow").style.transform =
          "rotate(180deg)";
      }
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
        this.cy.fit(this.cy.nodes(":visible"), 100);
        this.cy.zoom(0.65);
      });
    },
  },
};
</script>
