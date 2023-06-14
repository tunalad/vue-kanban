import { createRouter, createWebHistory } from "vue-router";

import Board from "../components/Board.vue";
import Dashboard from "../components/Dashboard.vue";
import NotFound from "../components/NotFound.vue";

const routes = [
	{ component: Board, path: "/vue-kanban/board/:id" },
	{ component: NotFound, path: "/vue-kanban/404" },
	{ component: Dashboard, path: "/vue-kanban/dashboard" },
	{ path: "/vue-kanban/", redirect: "/vue-kanban/dashboard" },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
