<script setup>
	import { RouterView } from "vue-router";
	import Board from "./components/Board.vue";
</script>

<template>
	<nav>navbar stuff here</nav>

	<router-view></router-view>
	<!--<Board />-->
</template>

<style scoped>
	nav {
		background-color: blueviolet;
		display: flex;
		justify-content: center;
		padding: 0.75rem;
	}
</style>
