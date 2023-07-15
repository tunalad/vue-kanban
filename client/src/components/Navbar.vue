<script setup>
	import { useRoute } from "vue-router";
	import { ref, watch, inject, computed } from "vue";

	const store = inject("store");
	const route = useRoute();

	const isDashboard = ref(route.path.startsWith("/vue-kanban/board"));

	watch(
		() => route.path,
		(newPath) => {
			isDashboard.value = newPath.startsWith("/vue-kanban/board");
		}
	);
</script>

<template>
	<nav>
		<router-link
			:to="'/vue-kanban/dashboard'"
			style="font-size: 40px"
			title="go to dashboard"
		>
			🏠️
		</router-link>
		<template v-if="!isDashboard">dashboard stuff </template>
		<template v-else>
			<p>{{ store.state.boardData.title }}</p>
			<a
				href="#"
				@click="store.state.itemsDraggable = false"
				style="font-size: 40px"
				title="board settings"
				>⚙️</a
			>
		</template>
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
