import { createRouter, createWebHistory } from "vue-router";

import Board from "../components/Board.vue";
import NotFound from "../components/NotFound.vue";

const routes = [
	{ component: Board, path: "/vue-kanban/board/:id" },
	{ component: NotFound, path: "/vue-kanban/404" },
	//{ component: Login, path: "/board/:id/login" },
	//{ component: Dashboard, path: "/dashboard" },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
