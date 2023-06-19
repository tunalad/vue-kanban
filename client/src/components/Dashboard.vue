<script setup>
	import { ref, inject } from "vue";
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
</script>

<template>
	<h1>Dashboard</h1>
	<div class="history-container" v-if="!creatingBoard">
		<h2>History</h2>
		<ul class="history-list">
			<li v-for="b in boardsHistory">
				<router-link :to="'/vue-kanban/board/' + b.boardId">
					{{ b.id }}
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
		overflow: hidden;
	}
	.history-list li {
		background-color: tomato;
		display: inline;
		margin: 5rem 0.5rem;
		padding: 3rem;
	}
</style>
