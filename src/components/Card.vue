<script setup>
	import { ref, watch } from "vue";

	const props = defineProps(["taskData"]);
	const task = props.taskData;

	const title = ref(task.title);
	const editing = ref(false);
	const inputField = ref(null);

	function editCard() {
		if (title.value.trim().length === 0) {
			title.value = task.title;
			editing.value = false;
			return;
		}
		editing.value = false;
	}

	function cardDragStart(item, e) {
		e.target.style.opacity = 0.1;
		e.dataTransfer.setData("text", JSON.stringify(item));
	}

	function cardDragEnd(e) {
		e.target.style.opacity = 1;
	}

	function cardDragOver(e) {
		e.preventDefault();
		e.currentTarget.style.border = "2px solid pink";
		//if (!e.target.classList.contains("list-card")) {
		//	e.target.style.border = "2px solid pink";
		//}
	}

	function cardDragLeave(e) {
		e.preventDefault();
		e.target.style.border = "";
		e.currentTarget.style.border = "";
	}

	function cardDrop(e) {
		let droppedItem = JSON.parse(e.dataTransfer.getData("text"));
		droppedItem.style = { opacity: 1, border: "" };
		//droppedItem.class = {};
		e.target.style = { opacity: 1, border: "" };
		console.log(
			`Item ${droppedItem.title} was dropped on ${e.target.innerHTML}`
		);
	}

	watch(editing, (newVal, oldVal) => {
		if (newVal && !oldVal) {
			requestAnimationFrame(() => {
				inputField.value.focus();
			});
		}
	});
</script>

<template>
	<li
		class="list-card"
		draggable="true"
		@dragstart="cardDragStart(task, $event)"
		@dragend="cardDragEnd($event)"
		@dragover="cardDragOver($event)"
		@dragleave="cardDragLeave($event)"
		@drop="cardDrop($event)"
	>
		<p @click="editing = true" v-if="!editing">
			{{ title }}
		</p>
		<input
			type="text"
			v-model="title"
			v-else
			@blur="editCard"
			@keyup.enter="editCard"
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
