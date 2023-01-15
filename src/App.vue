<script setup>
	import { ref } from "vue";
	import Card from "./components/Card.vue";
	import List from "./components/List.vue";

	import exampleData from "./exampleData.json";

	//const board = ref(exampleData);
	const board = ref([]);

	const addingList = ref(false);
	const newList = ref("");

	function addList() {
		if (newList.value.trim().length !== 0 || !newList)
			board.value.push({
				title: newList.value,
				dateCreated: Date.now(),
				position: board.value.length + 1,
				tasks: [],
			});
		addingList.value = false;
		newList.value = "";
	}
</script>

<template>
	<nav>navbar stuff here</nav>

	<div id="board">
		<List v-for="list in board" :title="list.title" :listData="list">
			<ul class="cards-list">
				<Card :taskData="task" v-for="task in list.tasks" />
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
				/>
				<button @click="addList()">Add</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
	nav {
		background-color: blueviolet;
		display: flex;
		justify-content: center;
		padding: 0.75rem;
	}
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
