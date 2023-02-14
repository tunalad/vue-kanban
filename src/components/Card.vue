<script setup>
	import { ref, watch } from "vue";
	import * as utils from "../utils";

	const props = defineProps(["taskData", "listData"]);

	const editing = ref(false);
	const inputField = ref(null);

	function editCard() {
		//if (title.value.trim().length === 0) {
		//	title.value = task.title;
		//	editing.value = false;
		//	return;
		//}
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
		e.dataTransfer.setData("fromList", props.listData.title);
		e.dataTransfer.setData("isList", false);
	}

	function cardDrop(item, e) {
		let droppedItem = JSON.parse(e.dataTransfer.getData("text"));

		// if list dropped, do nothing
		if (e.dataTransfer.getData("isList") === "true") return;

		// if not from the same list
		if (e.dataTransfer.getData("fromList") !== props.listData.title) {
			console.log(
				`pop '${droppedItem.title}' from '${e.dataTransfer.getData(
					"fromList"
				)}', and push to '${props.listData.title}' on position ${
					item.position + 1
				}`
			);
			return;
		}

		// if from the same list
		console.log(
			`Item ${droppedItem.title} (${droppedItem.position}) was dropped on ${item.title} (${item.position})`
		);

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
			v-else
			type="text"
			v-model="props.taskData.title"
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
