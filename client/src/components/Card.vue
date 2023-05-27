<script setup>
	import { ref, inject, toRaw } from "vue";
	import * as utils from "../utils";
	import api from "../api";

	const store = inject("store");
	const board = ref(store.state.board);

	const props = defineProps(["taskData", "listData"]);

	function cardStyle(e, style) {
		//if (e.dataTransfer.getData("isList") === "false")
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

	async function cardDrop(item, e) {
		let droppedItem = JSON.parse(e.dataTransfer.getData("text"));
		let fromList = JSON.parse(e.dataTransfer.getData("fromList"));
		const newPosition = toRaw(item).position;
		const newList = toRaw(item).list_id;

		// if list dropped, do nothing
		if (e.dataTransfer.getData("isList") === "true") return;

		// if not from the same list
		if (fromList.title !== props.listData.title) {
			// pops item from old list
			utils.removeObject(
				board.value[fromList.position].cards,
				droppedItem.position
			);

			// pushes to the new list
			utils.addObject(
				board.value[props.listData.position].cards,
				droppedItem,
				item.position + 1
			);

			// same actions on the server
			const response = await api.patchCard(toRaw(droppedItem).id, {
				position: newPosition + 1,
				list_id: newList,
			});
			return;
		}

		// if from the same list
		// client
		utils.moveInArray(
			props.listData.cards,
			droppedItem.position,
			item.position
		);

		// server
		const response = await api.patchCard(toRaw(droppedItem).id, {
			position: newPosition,
		});
	}
</script>

<template>
	<li
		class="list-card"
		v-bind:draggable="store.state.itemsDraggable"
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
		@click="
			store.state.itemsDraggable = false;
			store.state.editingData = {
				taskData: props.taskData,
				listData: props.listData,
			};
		"
	>
		<div class="labels">
			<span
				v-for="label in props.taskData.labels"
				class="label-box"
				:style="{ backgroundColor: label.color }"
			></span>
		</div>
		<p>
			{{ props.taskData.title }}
			{{ props.taskData.id }} |
			{{ props.taskData.position }}
		</p>
		<div class="icons">
			<p v-if="props.taskData.description">🗒️</p>
		</div>
	</li>
</template>

<style scoped>
	p {
		margin: 0;
		padding: 0;
		white-space: normal;
		word-break: break-all;
	}
	.list-card {
		background-color: crimson;
		text-align: left;
		list-style-type: none;
		padding: 0.1rem 1rem;
		margin: 0.5rem 0;
		border-radius: 0.3rem;
	}
	.labels {
		margin: 0;
		padding: 0.25rem 0;
		display: flex;
	}
	.label-box {
		display: inline-block;
		width: 100%;
		height: 4px;
		margin-right: 5px;
		border-radius: 0.3rem;
	}
</style>
