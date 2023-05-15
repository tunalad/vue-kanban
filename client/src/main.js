import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import "./style.css";

createApp(App).provide("store", store).mount("#app");
