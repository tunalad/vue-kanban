<script setup>
	import { ref, inject, watch } from "vue";
	import * as utils from "../utils";

	const store = inject("store");
	const board = ref(store.state.board);

	const props = defineProps(["taskData", "listData"]);

	const editing = ref(false);
	const inputField = ref(null);
	const inputValue = ref(props.taskData.title);

	function editCard(e) {
		if (inputValue.value.trim().length > 0 && e.key !== "Escape")
			props.taskData.title = inputValue.value;

		inputValue.value = props.taskData.title;
		editing.value = false;
	}

	function cardStyle(e, style) {
		if (e.dataTransfer.getData("isList") === "false")
			switch (style) {
				case "border":
					e.currentTarget.style.border = "2px solid pink";
					break;
				case "noBorder":
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
		e.dataTransfer.setData("fromList", JSON.stringify(props.listData));
		e.dataTransfer.setData("isList", false);
	}

	function cardDrop(item, e) {
		let droppedItem = JSON.parse(e.dataTransfer.getData("text"));
		let fromList = JSON.parse(e.dataTransfer.getData("fromList"));

		// if list dropped, do nothing
		if (e.dataTransfer.getData("isList") === "true") return;

		// if not from the same list
		if (fromList.title !== props.listData.title) {
			// pops item from old list
			utils.removeObject(
				board.value[fromList.position].tasks,
				droppedItem.position
			);

			// pushes to the new list
			utils.addObject(
				board.value[props.listData.position].tasks,
				droppedItem,
				item.position + 1
			);
			return;
		}

		// if from the same list
		utils.moveInArray(
			props.listData.tasks,
			droppedItem.position,
			item.position
		);
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
		@dragstart="
			cardDragStart(props.taskData, $event);
			cardStyle($event, 'opacity10');
		"
		@drop.prevent="
			cardDrop(props.taskData, $event);
			cardStyle($event, 'noBorder');
		"
		@dragend="cardStyle($event, 'opacity100')"
		@dragover.prevent="cardStyle($event, 'border')"
		@dragleave="cardStyle($event, 'noBorder')"
	>
		<p @click="editing = true" v-if="!editing">
			{{ props.taskData.title }}
		</p>

		<input
			type="text"
			ref="inputField"
			v-model="inputValue"
			v-else
			@blur="editCard"
			@keyup.enter="editCard"
			@keyup.esc="editCard"
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
