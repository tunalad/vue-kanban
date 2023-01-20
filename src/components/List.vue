<script setup>
	import { ref, watch } from "vue";
	import * as utils from "../utils";

	const props = defineProps(["listData", "boardData"]);
	props.listData.tasks.sort((a, b) => a.position - b.position);

	const editing = ref(false);
	const inputField = ref(null);

	const addingCard = ref(false);
	const newCard = ref("");

	function editList() {
		//if (props.listData.title.trim().length === 0) {
		//	title.value = list.title;
		//	editing.value = false;
		//	return;
		//}
		editing.value = false;
	}

	function addCard(list) {
		if (newCard.value.trim().length !== 0 || !newCard)
			list.tasks.push({
				title: newCard.value,
				description: "",
				position: list.tasks.length,
				dateCreated: Date.now(),
			});
		addingCard.value = false;
		newCard.value = "";
	}

	function listStyle(e, style) {
		if (e.target.classList.contains("list"))
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
	function listDragStart(item, e) {
		if (e.target.classList.contains("list")) {
			e.dataTransfer.setData("text", JSON.stringify(item));
			e.dataTransfer.setData("isList", true);
			listStyle(e, "opacity10");
		}
	}

	function listDrop(item, e) {
		if (e.target.classList.contains("list")) {
			let droppedItem = JSON.parse(e.dataTransfer.getData("text"));

			console.log(
				`Item ${droppedItem.title} (${droppedItem.position}) was dropped on ${item.title} (${item.position})`
			);

			utils.moveInArray(
				props.boardData,
				droppedItem.position,
				item.position
			);
			listStyle(e, "noBorder");
		}
	}

	// handles focusing when editing lists
	watch(editing, (newVal, oldVal) => {
		if (newVal && !oldVal) {
			requestAnimationFrame(() => {
				inputField.value.focus();
			});
		}
	});
</script>

<template>
	<div
		class="list"
		draggable="true"
		@dragstart="listDragStart(props.listData, $event)"
		@drop="listDrop(props.listData, $event)"
		@dragend="listStyle($event, 'opacity100')"
		@dragover.prevent="listStyle($event, 'border')"
		@dragleave="listStyle($event, 'noBorder')"
	>
		<h3 class="list-title" @click="editing = true" v-if="!editing">
			{{ props.listData.title }}
		</h3>
		<input
			type="text"
			v-model="props.listData.title"
			v-else
			@blur="editList"
			@keyup.enter="editList"
			ref="inputField"
		/>
		<slot />

		<button v-if="!addingCard" @click="addingCard = true">
			+ Add a card
		</button>
		<div v-else id="new-card">
			<input type="text" placeholder="enter a title" v-model="newCard" />
			<button @click="addCard(props.listData)">Add</button>
		</div>
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
		user-select: none;
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
