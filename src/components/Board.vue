<script setup>
	import { ref, inject, watch } from "vue";
	import Card from "./Card.vue";
	import List from "./List.vue";

	const store = inject("store");
	const board = ref(store.state.board);

	board.value.sort((a, b) => a.position - b.position);

	const addingList = ref(false);
	const newList = ref("");
	const inputField = ref(null);

	function addList() {
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
					v-for="task in list.tasks"
					:taskData="task"
					:listData="list"
				/>
			</ul>
		</List>

		<div class="new-list">
			<h3
				v-if="!addingList"
				class="list-title"
				@click="addingList = true"
			>
				+ Add a list
			</h3>
			<div v-else>
				<input
					type="text"
					placeholder="enter a title"
					v-model="newList"
					ref="inputField"
					@blur="addList"
					@keyup.enter="addList"
					@keyup.esc="
						addingList = false;
						newList = '';
					"
				/>
				<button @click="addList()">Add</button>
			</div>
		</div>
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
		border: 0.1rem solid transparent;
		border-radius: 0.5rem;
		border-color: coral;

		min-width: 15rem;
		max-width: 15rem;

		padding: 0 0.5rem;
		margin: 0.5rem;

		display: inline-block;
	}
</style>
