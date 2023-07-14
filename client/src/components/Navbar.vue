<script setup>
	import { useRoute } from "vue-router";
	import { ref, watch, inject } from "vue";

	const store = inject("store");
	const route = useRoute();

	const isDashboard = ref(route.path === "/vue-kanban/dashboard");

	watch(
		() => route.path,
		(newPath) => {
			isDashboard.value = newPath === "/vue-kanban/dashboard";
		}
	);
</script>

<template>
	<nav v-if="isDashboard">dashboard stuff</nav>
	<nav v-else>
		<router-link
			:to="'/vue-kanban/dashboard'"
			style="font-size: 40px"
			title="go to dashboard"
		>
			🏠️
		</router-link>
		<p>{{ store.state.boardData.title }}</p>
		<a
			href="#"
			@click="store.state.itemsDraggable = false"
			style="font-size: 40px"
			title="board settings"
			>⚙️</a
		>
	</nav>
</template>

<style scoped>
	nav {
		background-color: blueviolet;
		display: flex;
		justify-content: center;
		padding: 0.75rem;
	}

	p {
		margin: 0;
		padding: 0 1rem;
	}
</style>
