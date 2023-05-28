<script setup>
	import { ref, inject, watch, toRaw } from "vue";
	import * as utils from "../utils";
	import api from "../api";

	const store = inject("store");
	const board = ref(store.state.board);

	const props = defineProps(["listData", "boardData"]);

	const editing = ref(false);
	const inputField = ref(null);
	const inputValue = ref(props.listData.title);

	const addingCard = ref(false);
	const newCard = ref("");

	async function editList(e) {
		if (inputValue.value.trim().length > 0 && e.key !== "Escape") {
			// local
			props.listData.title = inputValue.value;

			// server
			try {
				await api.patchList(props.listData.id, {
					title: inputValue.value,
				});
			} catch (e) {
				console.error(e);
			}
		}

		inputValue.value = props.listData.title;
		editing.value = false;
	}

	async function deleteList() {
		try {
			// local
			utils.removeObject(board.value, props.listData.position);

			// server
			await api.deleteList(props.listData.id);
		} catch (e) {
			console.error(e);
		}
	}

	async function addCard(e, list) {
		if (e.key === "Escape") {
			addingCard.value = false;
			newCard.value = "";
			return;
		}

		const pushData = {
			title: newCard.value,
			description: "",
			position: list.cards.length,
			date_created: Date.now(),
		};

		if (newCard.value.trim().length !== 0 || !newCard) {
			// local
			list.cards.push(pushData);

			addingCard.value = false;
			newCard.value = "";

			// server
			try {
				const response = await api.postCard({
					...pushData,
					list_id: props.listData.id, // server thing only
				});

				// update the new item locally with it's id from the database
				const newData = response.data.data[0];

				if (newData) {
					const index = props.listData.cards.findIndex(
						(item) => item.date_created === pushData.date_created
					);
					if (index !== -1) {
						props.listData.cards[index] = {
							...pushData,
							...newData,
							labels: [],
						};
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	function listStyle(e, style) {
		if (e.target.classList.contains("list"))
			switch (style) {
				case "border":
					e.target.style.border = "2px solid pink";
					break;
				case "noBorder":
					e.target.style.border = "";
					break;
				case "opacity10":
					e.target.style.opacity = 0.1;
					break;
				case "opacity100":
					e.target.style.opacity = 1;
					break;
			}
	}

	function childrenHoverHandling(e) {
		/* hacky solution for ignoring children of the list when hovering */
		let hovering = e.target.parentNode;

		if (hovering.className === "list-header")
			hovering = hovering.parentNode;

		if (hovering.className === "list") {
			hovering.dispatchEvent(new DragEvent("dragover"));
			hovering.dispatchEvent(new DragEvent("dragend"));
		}
	}

	function childrenDropHandling(e) {
		/* hacky solution for ignoring children of the list when dropping */
		let hovering = e.target.parentNode;

		if (hovering.className === "list-header")
			hovering = hovering.parentNode;

		if (hovering.className === "list") {
			let dataTransfer = new DataTransfer();

			dataTransfer.setData("text", e.dataTransfer.getData("text"));
			dataTransfer.setData("isList", e.dataTransfer.getData("isList"));
			dataTransfer.setData(
				"fromList",
				e.dataTransfer.getData("fromList")
			);

			// Create the DragEventInit object with the dataTransfer property
			let eventInit = {
				dataTransfer: dataTransfer,
			};

			// Create the DragEvent with the eventInit object
			let dropEvent = new DragEvent("drop", eventInit);

			// Dispatch the event on the hovering element
			hovering.dispatchEvent(dropEvent);
		}
	}

	/* ============================== */
	/* DRAGGING FUNCTIONALITIES BELOW */
	/* ============================== */
	function listDragStart(item, e) {
		if (e.target.classList.contains("list")) {
			e.dataTransfer.setData("text", JSON.stringify(item));
			e.dataTransfer.setData("isList", true);
		}
	}

	async function listDrop(item, e) {
		/* this line prevents this function from executing
		when dropping a card onto a card */
		if (!e.target.classList.contains("list")) return;

		const droppedItem = JSON.parse(e.dataTransfer.getData("text"));
		const newList = toRaw(item).id;

		// if card dropped
		if (e.dataTransfer.getData("isList") === "false") {
			let fromList = JSON.parse(e.dataTransfer.getData("fromList"));

			utils.removeObject(
				// pops item from old list
				board.value[fromList.position].cards,
				droppedItem.position
			);

			utils.addObject(
				// pushes to the new list
				board.value[props.listData.position].cards,
				droppedItem,
				0
			);

			// same actions on the server
			const response = await api.patchCard(toRaw(droppedItem).id, {
				position: 0,
				list_id: newList,
			});
			return;
		}

		// if list dropped
		// local
		utils.moveInArray(
			props.boardData,
			toRaw(droppedItem).position,
			toRaw(item).position
		);

		// server
		await api.patchList(toRaw(droppedItem).id, {
			position: newPosition,
		});
	}

	// handles focusing when editing lists
	watch(editing, (newVal, oldVal) => {
		if (newVal && !oldVal) {
			requestAnimationFrame(() => {
				inputField.value.focus();
			});
		}
	});

	// handles focusing when adding cards
	watch(addingCard, (newVal, oldVal) => {
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
		v-bind:draggable="store.state.itemsDraggable"
		@dragstart="
			listDragStart(props.listData, $event);
			listStyle($event, 'opacity10');
		"
		@drop="
			listDrop(props.listData, $event);
			listStyle($event, 'noBorder');
		"
		@dragend="listStyle($event, 'opacity100')"
		@dragover.prevent="listStyle($event, 'border')"
		@dragleave="listStyle($event, 'noBorder')"
	>
		<div
			class="list-header"
			@dragover.prevent="childrenHoverHandling($event)"
			@drop="childrenDropHandling($event)"
		>
			<h3 class="list-title" @click="editing = true" v-if="!editing">
				{{ props.listData.title }}
			</h3>

			<input
				type="text"
				ref="inputField"
				v-model="inputValue"
				v-else
				@blur="editList"
				@keyup.enter="editList"
				@keyup.esc="editList"
			/>
			<span @click="deleteList">🗑️</span>
		</div>

		<slot />

		<button v-if="!addingCard" @click="addingCard = true">
			+ Add a card
		</button>
		<div v-else id="new-card">
			<input
				type="text"
				placeholder="enter a title"
				ref="inputField"
				v-model="newCard"
				@blur="addCard($event, props.listData)"
				@keyup.enter="addCard($event, props.listData)"
				@keyup.esc="addCard($event, props.listData)"
			/>
			<button @click="addCard($event, props.listData)">Add</button>
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
		margin: 0;
		background-color: darkblue;
		display: table;
		white-space: normal;
		word-break: break-all;
	}
	.list-header {
		display: flex;
		justify-content: space-between;
		padding: 0 0.4rem;
		background-color: chocolate;
	}
</style>
