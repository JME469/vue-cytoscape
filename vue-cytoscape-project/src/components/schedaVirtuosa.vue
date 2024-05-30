<template>
  <div id="logo-container">
    <img
      v-show="loading"
      id="loading"
      src="/wordpress/wp-content/themes/astra/assets/dist/img/vidimus_r.png"
      alt="Logo vidimus"
      width="500px"
    />
  </div>
  <div id="container">
    <div id="modal" v-show="showModal" @click.self="closeModal">
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
            fontObject.trascrizione !== null ? "Data: " + fontObject.data : ""
          }}
        </p>
      </div>
    </div>
    <div id="aside" v-show="showAside" style="display: flex">
      <div id="aside-content"></div>
    </div>
  </div>
</template>

<style scoped>
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

hr {
  width: 100%;
  margin-bottom: 20px;
  border: none;
  height: 3px;
  background-color: rgb(120, 38, 46);
}

#logo-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#aside-content{
  width: 100%;
  height: 100%;
}

#content{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  position: absolute;
  top: 15px;
  right: 15px;
  float: right;
}

.chInfo {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  text-align: center;
  justify-content: center;
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
  width: 100%;
  height: 100vh;

  background-color: white;
  padding: 60px;

  z-index: 1000;
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
#modal {
  position: fixed; /* Stay in place */
  z-index: 9999 !important; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal Content */
#fm-modal,
#fa-modal,
#fl-modal {
  position: relative;
  background-color: #fefefe;
  border: solid 2px rgb(100, 9, 18);
  margin: 30% auto; /* 10% from the top and centered */
  padding: 150px;
  width: 55%;
  min-height: 40%; /* Could be more or less, depending on screen size */
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
</style>

<script>
export default {
  data() {
    return {
      loading: true,

      showAside: false,

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

      filteredData: [],

      showModal: false,
      fontObject: null,

      permaLinks: [],
    };
  },
  mounted() {
    this.fetchDataAndPopulateNodes();
    setTimeout(() => {
      this.loadAside();
    }, 1750);
    this.loading = false;
  },
  methods: {
    loadAside() {
      const data = this.getDataFromLocalStorage();
      if (data) {
        this.handleNodeClick(data);
      }
    },
    getDataFromLocalStorage() {
      const info = JSON.parse(localStorage.getItem("nodeInfo"));
      const relations = JSON.parse(localStorage.getItem("nodeRelations"));
      console.log("Info: ", info);
      console.log("Relationships: ", relations);
      if (!info || !relations) {
        // Handle the case where the data is not available
        document.getElementById("aside-content").innerHTML =
          "<p>No data available. Please go back and select a node.</p>";
        return null;
      }
      return { info, relations };
    },
    handleNodeClick(data) {
      // Show detailed info about the clicked node in the aside section

      const info = data.info;
      const relations = data.relations;

      const content = document.getElementById("aside-content");

      const logoSrc = info.virtuosa
        ? `/wordpress/wp-content/themes/astra/assets/dist/img/logo_r.png`
        : "";
      const imageSrc =
        info.icona !== null
          ? `https://directusvirtuose.vidimus.it/assets/${info.icona}`
          : "";
      const permaLink = this.permaLinks.find((link) => link.item == info.id);

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
      <div id="content" 
      syle="display:flex;
      align-items: center;
      justify-content: center;">

      <div class="chInfo" style="width: 80%;
        height: 80%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 20px;
        text-align: left;
        justify-content: center;">
        <div id="dati1" style="display:flex;flex-direction:column;">
          <h3 style="margin-left:10px"><b>${info.nome + " " + info.cognome}</b>${
          logoSrc !== ""
          ? `<img src="${logoSrc}" style="max-width:25px;margin-left:10px" alt="Logo" class="logo">`
          : ""
          }
          </h3>
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
          <h4 id="famiglia-trigger" class="aside-subtitle" style="cursor:pointer;">Famiglia <img id="fam-arrow" src="/wordpress/wp-content/themes/astra/assets/dist/img/arrow.png" alt="Search icon" width="15px"></h4>
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
        </div>
        <div id="dati2" style="display:flex;flex-direction:column;">
          <h4 id="formazione-trigger" class="aside-subtitle" style="cursor:pointer;">Formazione <img id="form-arrow" src="/wordpress/wp-content/themes/astra/assets/dist/img/arrow.png" alt="Search icon" width="15px"></h4>
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
        </div>
        <div id="dati3" style="display:flex;flex-direction:column;">
          <h4 id="attivita-trigger" class="aside-subtitle" style="cursor:pointer;">Attivita <img id="att-arrow" src="/wordpress/wp-content/themes/astra/assets/dist/img/arrow.png" alt="Search icon" width="15px"></h4>
          <hr>
          <div id="attivita-info">
          ${
          info.eventi && info.eventi.length > 0
            ? `<p><b>Eventi:</b><br> ${info.eventi
                .map((eventId) => {
                  const event = this.eventsData.find(
                    (event) => event.id === eventId
                  );
                  return event ? `${event.data} - ${event.luogo}` : "";
                })
                .join("<br>")}</p>`
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
        </div>
        <div id="dati4" style="display:flex;flex-direction:column;">
          <h4 id="fonti-trigger" class="aside-subtitle" style="cursor:pointer;">Fonti <img id="font-arrow" src="/wordpress/wp-content/themes/astra/assets/dist/img/arrow.png" alt="Search icon" width="15px"></h4>
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
          ${
            permaLink
              ? `<a href="${
                  "https://directusvirtuose.vidimus.it/admin/shared/" +
                  permaLink.id
                }" target="_blank">PermaLink</a>`
              : ""
          }
          </div>
        </div>
      </div>
  `;

      // Show the aside section
      this.showAside = true;

      document.querySelectorAll(".fontLink").forEach((link) => {
        link.addEventListener("click", this.showFontDetails);
      });
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
        console.log(fontiArchivistiche);
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
  },
};
</script>
