<script setup>
	import { ref, watch } from "vue";

	const props = defineProps(["taskData"]);
	const task = props.taskData;

	const title = ref(task.title);
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
	<li class="list-card">
		<p @click="editing = true" v-if="!editing">
			{{ title }}
		</p>
		<input
			type="text"
			v-model="title"
			v-else
			@blur="editing = false"
			@keyup.enter="editing = false"
			ref="inputField"
		/>
	</li>
</template>

<style scoped>
	p {
		margin: 0;
		padding: 0;
	}
	.list-card {
		background-color: crimson;
		text-align: left;
		list-style-type: none;
		padding: 0.1rem 1rem;
		margin: 0.5rem 0;
		border-radius: 0.3rem;
	}
</style>
