<script setup>
	import Board from "./components/Board.vue";

	//import { ref, inject } from "vue";

	//const store = inject("store");
	//const board = ref(store.state.board);

	//console.log(store.state.board);
</script>

<template>
	<nav>navbar stuff here</nav>

	<!--<Board />-->
	<Board />
</template>

<style scoped>
	nav {
		background-color: blueviolet;
		display: flex;
		justify-content: center;
		padding: 0.75rem;
	}
</style>
