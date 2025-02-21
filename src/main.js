import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import './assets/css/index.css';

import ToastProvider from '@/components/ui/toast/ToastProvider.vue';
import { installShadcn } from '@/lib/shadcn';
import axiosPlugin from '@/plugins/axios';
import App from './App.vue';
import router from './router/index';

// Set document title
document.title = 'Hue Harmony - Create Your Color Harmony';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(axiosPlugin);

app.component('ToastProvider', ToastProvider);

installShadcn(app);

app.mount('#app');
