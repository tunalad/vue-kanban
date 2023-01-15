<script setup>
	import { ref, watch } from "vue";

	const props = defineProps(["title", "listData"]);
	const list = props.listData;
	const title = ref(list.title);

	const editing = ref(false);
	const inputField = ref(null);

	const addingCard = ref(false);
	const newCard = ref("");

	function editList() {
		if (title.value.trim().length === 0) {
			title.value = list.title;
			editing.value = false;
			return;
		}
		editing.value = false;
	}

	function addCard(list) {
		if (newCard.value.trim().length !== 0 || !newCard)
			list.tasks.push({
				title: newCard.value,
				description: "",
				position: list.tasks.length + 1,
				dateCreated: Date.now(),
			});
		addingCard.value = false;
		newCard.value = "";
	}

	watch(editing, (newVal, oldVal) => {
		if (newVal && !oldVal) {
			requestAnimationFrame(() => {
				inputField.value.focus();
			});
		}
	});
</script>

<template>
	<div class="list">
		<h3 class="list-title" @click="editing = true" v-if="!editing">
			{{ title }}
		</h3>
		<input
			type="text"
			v-model="title"
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
			<button @click="addCard(list)">Add</button>
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
