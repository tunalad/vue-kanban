<script setup>
	import { ref, reactive } from "vue";
	import Card from "./components/Card.vue";
	import List from "./components/List.vue";

	import exampleData from "./exampleData.json";

	const board = ref(exampleData);
	//const board = ref([]);

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
</script>

<template>
	<nav>navbar stuff here</nav>

	<div id="board">
		<List v-for="list in board" :title="list.title" :listData="list">
			<ul class="cards-list">
				<Card
					:taskData="task"
					v-for="task in list.tasks"
					@dragstart="cardDragStart(task, $event)"
					@dragend="cardDragEnd($event)"
					@dragover="cardDragOver($event)"
					@dragleave="cardDragLeave($event)"
					@drop="cardDrop($event)"
					draggable="true"
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
