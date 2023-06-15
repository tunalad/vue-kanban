<script setup>
	import { ref, inject, watch, onMounted } from "vue";
	import { useRoute } from "vue-router";
	import api from "../api";
	import Card from "./Card.vue";
	import List from "./List.vue";
	import Overlay from "./Overlay.vue";

	const store = inject("store");
	const board = ref(store.state.board);

	const addingList = ref(false);
	const newList = ref("");
	const inputField = ref(null);

	async function addList(e) {
		if (e.key === "Escape") {
			addingList.value = false;
			newList.value = "";
			return;
		}

		const pushData = {
			title: newList.value,
			date_created: Date.now(),
			position: board.value.length,
		};

		if (newList.value.trim().length !== 0 || !newList) {
			// localStorage update
			board.value.push(pushData);

			addingList.value = false;
			newList.value = "";
			// server update
			try {
				const response = await api.postList({
					...pushData,
					board_id: store.state.board_id, // server thing only
				});

				// update the new item locally with it's id from the database
				const newData = response.data.data[0];

				if (newData) {
					const index = board.value.findIndex(
						(item) => item.date_created === pushData.date_created
					);
					if (index !== -1) {
						board.value[index] = {
							...pushData,
							...newData,
							cards: [],
						};
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	// watches the store.state.board changes
	watch(
		() => store.state.board,
		(newBoard) => {
			board.value = newBoard;
			board.value.sort((a, b) => a.position - b.position);
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

	onMounted(() => {
		store.state.board_id = useRoute().params.id;
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
