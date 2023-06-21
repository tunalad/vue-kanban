<script setup>
	import { RouterView } from "vue-router";
	import { useRoute } from "vue-router";
	import { ref, watch } from "vue";

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
		<router-link :to="'/vue-kanban/dashboard'">
			go to dashboard
		</router-link>
	</nav>

	<router-view></router-view>
</template>

<style scoped>
	nav {
		background-color: blueviolet;
		display: flex;
		justify-content: center;
		padding: 0.75rem;
	}
</style>
