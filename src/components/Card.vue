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

	function cardStyle(e, style) {
		switch (style) {
			case "border":
				e.currentTarget.style.border = "2px solid pink";
				break;
			case "noBorder":
				//e.target.style.border = "";
				e.currentTarget.style.border = "";
				break;
			case "opacity10":
				e.target.style.opacity = 0.1;
				break;
			case "opacity100":
				e.target.style.opacity = 1;
				break;
		}
	}

	/* ============================== */
	/* DRAGGING FUNCTIONALITIES BELOW */
	/* ============================== */
	function cardDragStart(item, e) {
		e.dataTransfer.setData("text", JSON.stringify(item));
		cardStyle(e, "opacity10");
	}

	function cardDrop(item, e) {
		e.preventDefault();
		let droppedItem = JSON.parse(e.dataTransfer.getData("text"));

		let parent = e.target.closest(".cards-list");
		if (!parent) return;

		console.log(`Item ${droppedItem.title} was dropped on ${item.title}`);

		cardStyle(e, "noBorder");
	}

	// handles focusing when editing cards
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
		@dragend="cardStyle($event, 'opacity100')"
		@dragover.prevent="cardStyle($event, 'border')"
		@dragleave="cardStyle($event, 'noBorder')"
		@drop="cardDrop(task, $event)"
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
