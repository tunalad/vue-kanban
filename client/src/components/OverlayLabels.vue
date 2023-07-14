<script setup>
	import { ref, inject, toRaw } from "vue";
	import api from "../api";

	const emit = defineEmits(["close"]);

	const store = inject("store");

	const adding = ref(false);
	const addingObject = ref({
		id: null,
		title: "",
		color: "#000",
	});

	const editing = ref(false);
	const editingLabel = ref(null);
	const editingLabelNew = ref(null);

	console.log(store.state.board[0].cards[0].labels);

	async function addLabel(action = "save") {
		if (action === "cancel") {
			adding.value = false;
			addingObject.value = {
				id: null,
				title: "",
				color: "#000",
			};
		}

		if (action === "save") {
			// client
			addingObject.value.id = new Date().getTime();

			store.state.boardLabels.push(addingObject.value);

			// server
			const response = await api.postLabel({
				...toRaw(addingObject.value),
				date_created: Date.now(),
				board_id: store.state.boardData.id,
			});

			const newData = response.data.data[0];

			// update local id
			if (newData) {
				const index = toRaw(store.state.boardLabels).findIndex(
					(item) =>
						item.date_created === addingObject.value.date_created
				);
				if (index !== -1) {
					store.state.boardLabels[index] = {
						...newData,
					};
				}
			}
		}
	}

	async function editLabel(newData) {
		const board = ref(store.state.board);

		// client
		// updates card colors
		for (let lists in board.value) {
			let tasks = board.value[lists].tasks;
			for (let task in tasks) {
				let labels = tasks[task].labels;
				for (let l in labels) {
					if (newData.id === labels[l].id) {
						labels[l].title = newData.title;
						labels[l].color = newData.color;
					}
				}
			}
		}

		// updates label color
		const label = store.state.boardLabels.find((i) => i.id === newData.id);
		label.title = newData.title;
		label.color = newData.color;

		editing.value = false;
		editingLabel.value = null;
		editingLabelNew.value = null;

		// server
		await api.patchLabel(label.id, {
			color: newData.color,
			title: newData.title,
		});
	}

	async function deleteLabel(label) {
		const board = ref(store.state.board);

		// client
		for (let lists in board.value) {
			let cards = board.value[lists].cards;
			for (let card in cards) {
				let labels = cards[card].labels;
				for (let l in labels) {
					if (label.id === labels[l].id) {
						labels.splice(l, 1);
					}
				}
			}
		}

		// removes label in the list
		store.state.boardLabels.splice(
			store.state.boardLabels.findIndex((item) => item.id === label.id),
			1
		);

		// server
		await api.deleteLabel(label.id);
	}
</script>

<template>
	<!-- header container -->
	<div class="header-container">
		<h1>Labels manager</h1>
	</div>
	<!-- content container -->
	<div class="content-container">
		<!-- list labels -->
		<ul class="labels-list" v-if="!editing && !adding">
			<p v-if="store.state.boardLabels.length < 1">You have no labels</p>
			<li class="label" v-for="label in store.state.boardLabels">
				<button title="Delete label" @click="deleteLabel(label)">
					🗑️
				</button>
				<button
					title="Edit label"
					@click="
						editing = true;
						editingLabel = label;
						editingLabelNew = label;
					"
				>
					✏️
				</button>
				<span
					class="label-title"
					:style="{ backgroundColor: label.color }"
					>{{ label.title }} ️</span
				>
			</li>
			<hr />
			<button @click="adding = true">+ Add new label</button>
		</ul>

		<!-- edit a label -->
		<div v-if="editing">
			<label for="label-title">Label title:</label>
			<input
				type="text"
				id="label-title"
				:value="editingLabelNew.title"
				@input="
					editingLabelNew = {
						...editingLabelNew,
						title: $event.target.value,
					}
				"
			/>
			<br />
			<label for="label-color">Label color:</label>
			<input
				type="color"
				id="label-color"
				:value="editingLabelNew.color"
				@input="
					editingLabelNew = {
						...editingLabelNew,
						color: $event.target.value,
					}
				"
			/>
			<br />
			<button @click="editLabel(editingLabelNew)">Save</button>
			<button
				@click="
					editing = false;
					editingLabel = null;
					editingLabelNew = null;
				"
			>
				Cancel
			</button>
		</div>

		<!-- adding a label-->
		<div v-if="adding">
			<label for="label-title">Label title:</label>
			<input type="text" v-model="addingObject.title" />
			<br />
			<label for="label-color">Label color:</label>
			<input type="color" v-model="addingObject.color" />
			<br />
			<button
				@click="
					addLabel();
					addLabel('cancel');
				"
			>
				Save
			</button>
			<button @click="addLabel('cancel')">Cancel</button>
		</div>
	</div>
	<!-- footer container -->
	<div class="footer-container">
		<button @click="$emit('close')">Back</button>
	</div>
</template>

<style scoped>
	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 1rem 0;
	}
	.header-container h1 {
		margin: 0 0;
		white-space: normal;
		word-break: break-all;
		width: 100%;
	}
	.labels-list {
		list-style: none;
		margin: 0;
		padding: 1rem;
	}
	.label-title {
		margin: 0.5rem;
	}
	.footer-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 1rem 0;
	}
</style>
