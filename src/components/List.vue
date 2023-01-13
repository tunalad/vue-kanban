<script setup>
	import { ref, watch } from "vue";

	const props = defineProps(["title"]);

	const title = ref(props.title);
	const editing = ref(false);
	const inputField = ref(null);

	watch(editing, (newVal, oldVal) => {
		if (newVal && !oldVal) {
			requestAnimationFrame(() => {
				inputField.value.focus();
			});
		}
	});
</script>

<template>
	<div class="list">
		<h3 class="list-title" @click="editing = true" v-if="!editing">
			{{ title }}
		</h3>
		<input
			type="text"
			v-model="title"
			v-else
			@blur="editing = false"
			@keyup.enter="editing = false"
			ref="inputField"
		/>
		<slot />
	</div>
</template>

<style scoped>
	.list {
		padding: 0.5rem 0.5rem;
		margin: 0.5rem;
		border-radius: 0.3rem;
		background-color: coral;
		min-width: 15rem;
		max-width: 15rem;
		display: inline-block;
		vertical-align: top;
		overflow: auto;
	}
	.list ul {
		margin: 0;
		padding: 0;
	}
	.list-title {
		text-align: left;
		margin: 0.2rem 0.5rem;
		background-color: darkblue;
		display: table;
	}
</style>
