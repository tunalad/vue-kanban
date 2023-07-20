import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/vue-kanban/",
    plugins: [vue()],
});
