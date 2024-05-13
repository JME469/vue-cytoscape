import { createApp } from 'vue';
import App from './App.vue';

import 'primevue/resources/themes/saga-blue/theme.css';    
import 'primevue/resources/primevue.min.css';                
import 'primeicons/primeicons.css';

import PrimeVue from 'primevue/config';
import MultiSelect from 'primevue/multiselect';

const app = createApp(App);

app.use(PrimeVue);
app.component('MultiSelect', MultiSelect);

app.mount('#app');
