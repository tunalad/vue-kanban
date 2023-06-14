<script setup>
	import { ref, inject } from "vue";

	const store = inject("store");
	const boardsHistory = ref(store.state.boardsUnlocked);
	console.log(boardsHistory.value);
</script>

<template>
	<h1>Dashboard</h1>
	<div class="history-container">
		<h2>History</h2>
		<ul class="history-list">
			<li v-for="b in boardsHistory">
				<router-link :to="'/vue-kanban/board/' + b.boardId">
					{{ b }}
				</router-link>
			</li>
		</ul>
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
		overflow: hidden;
	}
	.history-list li {
		background-color: tomato;
		display: inline;
		margin: 5rem 0.5rem;
		padding: 3rem;
	}
</style>
