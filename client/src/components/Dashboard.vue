<script setup>
	import { ref, inject, onMounted } from "vue";
	import api from "../api";
	import router from "../router";

	const store = inject("store");
	const boardsHistory = ref(store.state.boardsUnlocked);

	const creatingBoard = ref(false);
	const newBoard = ref({
		boardTitle: "",
		boardPassword: "",
	});

	async function createBoard() {
		try {
			const response = await api.postBoard({
				title: newBoard.value.boardTitle,
				password: newBoard.value.boardPassword,
			});

			const redirectTo = `/vue-kanban/board/${response.data.data[0].id}`;

			router.push(redirectTo);
		} catch (e) {
			console.error(e);
		}
	}

	onMounted(() => {
		// clear the stat
		store.state.board_id = null;
		store.state.board = [];
		store.state.boardLabels = [];
		store.state.itemsDraggable = true;
		store.state.editingData = {};
	});
</script>

<template>
	<h1>Dashboard</h1>
	<div class="history-container" v-if="!creatingBoard">
		<h2>History</h2>
		<ul class="history-list">
			<li v-for="b in boardsHistory">
				<router-link :to="'/vue-kanban/board/' + b.boardId">
					{{ b.boardTitle }}
				</router-link>
			</li>
		</ul>
		<button @click="creatingBoard = !creatingBoard">New board</button>
	</div>

	<div class="content-container" v-else>
		Board name:
		<input
			type="text"
			placeholder="Board name"
			v-model="newBoard.boardTitle"
		/>
		<br />
		Board password:
		<input
			type="password"
			placeholder="Board password"
			v-model="newBoard.boardPassword"
		/>
		<br />
		<br />
		<button @click="createBoard">create board</button>
		<button @click="creatingBoard = !creatingBoard">cancel</button>
	</div>
</template>

<style scoped>
	.history-container {
		margin: 0 2rem;
		padding: 0.5rem;
		background-color: teal;
	}
	.history-container h2 {
		margin: 0;
		padding: 0.75rem 0;
	}
	.history-list {
		margin: 0;
		padding: 0.75rem 0;
		list-style-type: none;
	}
	.history-list li {
		background-color: tomato;
		text-align: left;
		margin: 0.25rem;
		padding: 0 1rem;
	}
</style>
