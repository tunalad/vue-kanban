<script setup>
	import { ref, inject, onMounted } from "vue";
	import Overlay from "./Overlay.vue";

	const store = inject("store");
	const boardsHistory = ref(store.state.boardsUnlocked);

	onMounted(() => {
		// clear the stat
		store.state.board_id = null;
		store.state.board = [];
		store.state.boardLabels = [];
		store.state.itemsDraggable = true;
		store.state.editingData = {};
	});
</script>

<template>
	<h1>Dashboard</h1>
	<div class="history-container">
		<h2>History</h2>
		<ul class="history-list">
			<li v-for="b in boardsHistory">
				<router-link :to="'/vue-kanban/board/' + b.boardId">
					{{ `(${b.boardId}) - ` + b.boardTitle }}
				</router-link>
			</li>
		</ul>
		<button @click="store.state.itemsDraggable = false">New board</button>
		<Overlay v-if="!store.state.itemsDraggable" />
	</div>
</template>

<style scoped>
	.history-container {
		margin: 0 2rem;
		padding: 0.5rem;
		background-color: teal;
	}
	.history-container h2 {
		margin: 0;
		padding: 0.75rem 0;
	}
	.history-list {
		margin: 0;
		padding: 0.75rem 0;
		list-style-type: none;
	}
	.history-list li {
		background-color: tomato;
		text-align: left;
		margin: 0.25rem;
		padding: 0 1rem;
	}
</style>
