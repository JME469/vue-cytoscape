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
      // Fetch user data from Random User API
      async function fetchUser() {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();
        return data.results[0];
      }

      // Define Cytoscape configuration
      var cyConfig = {
        container: document.getElementById("cy"),
        elements: [
          { data: { id: "a" } },
          { data: { id: "b" } },
          { data: { id: "c" } },
          { data: { id: "d" } },
          { data: { id: "e" } },
          { data: { id: "f" } },
          { data: { id: "g" } },
          { data: { id: "ac", source: "a", target: "c" } },
          { data: { id: "bc", source: "b", target: "c" } },
          { data: { id: "df", source: "d", target: "f" } },
          { data: { id: "ef", source: "e", target: "f" } },
          { data: { id: "cg", source: "c", target: "g" } },
          { data: { id: "fg", source: "f", target: "g" } },
        ],
        layout: {
          name: 'dagre',
          nodeSep: 100,
          rankSep: 100,
          rankDir: 'TB',
          /*positions: function (node) {
            var positionMap = {
              a: { x: -50, y: 0 },
              b: { x: 50, y: 0 },
              c: { x: 0, y: 100 },
              d: { x: 150, y: 0 },
              e: { x: 250, y: 0 },
              f: { x: 200, y: 100 },
              g: { x: 100, y: 200 },
            };
            return positionMap[node.id()] || { x: 0, y: 0 };
          },*/
        },
        style: [
          {
            selector: "node",
            style: {
              "background-color": "rgb(0, 87, 9)",
              width: "30px",
              height: "30px",
              "background-image": "data(userImage)",
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
      };

      var cy = cytoscape(cyConfig);

      cy.ready(() => {
        cy.zoom(0.75);
      })

      var nodes = cy.nodes();
      for (let i = 0; i < nodes.length; i++) {
        const user = await fetchUser();
        nodes[i].data("name", `${user.name.first} ${user.name.last}`);
        nodes[i].data("info", {
          // Store user info for the node
          firstName: user.name.first,
          lastName: user.name.last,
          email: user.email,
          phone: user.phone,
          picture: user.picture.large,
        });
        nodes[i].data("userImage", user.picture.large);
      }

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
