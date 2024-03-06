<template>
    <div class="graph-container">
        <div id="cy"></div>
        <div v-if="popup.visible" class="popup" :style="{ top: popup.top + 'px', left: popup.left + 'px' }">
            <img :src="popup.info.picture" alt="Profile Picture">
            <p>Name: {{ popup.info.firstName }} {{ popup.info.lastName }}</p>
            <p>Email: {{ popup.info.email }}</p>
            <p>Phone: {{ popup.info.phone }}</p>
        </div>
    </div>
</template>

<script>
import cytoscape from 'cytoscape';

export default {
    data() {
        return {
            popup: {
                visible: false,
                info: {},
                top: 0,
                left: 0
            }
        };
    },
    mounted() {
        this.createGraph();
    },
    methods: {
        async fetchData() {
            const response = await fetch("https://randomuser.me/api/");
            const data = await response.json();
            return data.results[0];
        },
        async createGraph() {
            const cyConfig = {
                container: document.getElementById('cy'),
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
                    name: "preset", // Use the 'preset' layout
                    positions: function (node) {
                        // Define positions for each node
                        var positionMap = {
                            a: { x: 0, y: 0 },
                            b: { x: 100, y: 0 },
                            c: { x: 50, y: 100 },
                            d: { x: 200, y: 0 },
                            e: { x: 300, y: 0 },
                            f: { x: 250, y: 100 },
                            g: { x: 150, y: 200 },
                            // Add more nodes and their positions as needed
                        };
                        return positionMap[node.id()] || { x: 0, y: 0 }; // Default position if not specified
                    },
                },
                style: [
                    {
                        selector: "node",
                        style: {
                            "background-fit": "cover",
                            "background-color": "#666",
                            width: "60px",
                            height: "60px",
                            // "background-image": "data(userImage)", // You need to fetch and set the user images
                        },
                    },
                    {
                        selector: "edge",
                        style: {
                            width: 3,
                            "line-color": "#ccc",
                            "target-arrow-color": "#ccc",
                            "target-arrow-shape": "triangle",
                        },
                    },
                ],
            };

            const cy = cytoscape(cyConfig);

            // Bind click event handler to nodes
            cy.on('click', 'node', (event) => {
                const node = event.target;
                const info = node.data('info');
                this.popup.info = info;
                this.popup.visible = true;
                this.popup.top = event.pageY;
                this.popup.left = event.pageX;
            });

            // Hide the popup when clicking outside of it
            document.addEventListener('click', this.hidePopupOutside);
        },
        hidePopupOutside(event) {
            if (this.popup.visible && !document.querySelector('.popup').contains(event.target)) {
                this.popup.visible = false;
                document.removeEventListener('click', this.hidePopupOutside);
            }
        }
    },
    beforeDestroy() {
        // Remove event listener to prevent memory leaks
        document.removeEventListener('click', this.hidePopupOutside);
    }
}
</script>

<style scoped>
.graph-container {
    position: relative;
}

.popup {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    padding: 10px;
}
</style>