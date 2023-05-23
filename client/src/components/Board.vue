<script setup>
	import { ref, inject, watch } from "vue";
	import Card from "./Card.vue";
	import List from "./List.vue";
	import Overlay from "./Overlay.vue";

	const store = inject("store");
	//const board = ref(store.state.board);
	const board = ref([]);

	board.value.sort((a, b) => a.position - b.position);

	const addingList = ref(false);
	const newList = ref("");
	const inputField = ref(null);

	function addList(e) {
		if (e.key === "Escape") {
			addingList.value = false;
			newList.value = "";
			return;
		}

		if (newList.value.trim().length !== 0 || !newList)
			board.value.push({
				title: newList.value,
				dateCreated: Date.now(),
				position: board.value.length,
				tasks: [],
			});
		addingList.value = false;
		newList.value = "";
	}

	// watches the store.state.board changes
	watch(
		() => store.state.board,
		(newBoard) => {
			board.value = newBoard;
		},
		{ immediate: true }
	);

	// handles focusing when adding lists
	watch(addingList, (newVal, oldVal) => {
		if (newVal && !oldVal) {
			requestAnimationFrame(() => {
				inputField.value.focus();
			});
		}
	});
</script>

<template>
	<div id="board">
		<List v-for="list in board" :listData="list" :boardData="board">
			<ul class="cards-list">
				<Card
					v-for="card in list.cards"
					:taskData="card"
					:listData="list"
				/>
			</ul>
		</List>

		<div class="new-list">
			<button
				v-if="!addingList"
				class="list-title"
				@click="addingList = true"
			>
				+ Add a list
			</button>
			<div v-else>
				<input
					type="text"
					placeholder="enter a title"
					v-model="newList"
					ref="inputField"
					@blur="addList"
					@keyup.enter="addList"
					@keyup.esc="addList"
				/>
				<button @click="addList">Add</button>
			</div>
		</div>

		<Overlay v-if="!store.state.itemsDraggable" />
	</div>
</template>

<style scoped>
	#board {
		background-color: #242424;
		text-align: left;
		white-space: nowrap;
		margin: 1rem;
		padding: 1rem;
		overflow: auto;
		height: 100%;
	}
	.cards-list {
		margin: 0;
		padding: 0;
	}
	.new-list {
		background-color: rgb(255, 127, 80, 1%);
		/*border: 0.1rem solid transparent;*/
		border-radius: 0.5rem;
		border-color: coral;

		min-width: 15rem;
		max-width: 15rem;

		padding: 0 0.5rem;
		margin: 0.5rem;

		cursor: default;
		display: inline-block;
	}
	.new-list h3 {
		margin: 0.75rem;
	}
</style>