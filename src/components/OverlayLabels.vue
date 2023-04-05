<script setup>
	import { ref, inject } from "vue";

	const store = inject("store");

	const adding = ref(false);
	const addingObject = ref({
		id: null,
		title: "",
		color: "",
	});

	const editing = ref(false);
	const editingLabel = ref(null);

	function addLabel(action = "save") {
		//console.log(addingObject.value);
		if (action === "cancel") {
			adding.value = false;
			addingObject.value = {
				id: null,
				title: "",
				color: "",
			};
		}

		if (action === "save") {
			const maxId = Math.max(
				...store.state.boardLabels.map((label) => label.id)
			);

			addingObject.value.id = maxId + 1;
			store.state.boardLabels.push(addingObject.value);
		}
	}

	function editLabel(label) {
		console.log(`edited label ${label.title}`);
		editing.value = false;
		editingLabel.value = null;
	}

	function deleteLabel(label) {
		const lists = store.state.board;

		for (let list in lists) {
			let cards = lists[list].tasks;
			for (let card in cards) {
				// removes the label from cards where found
				cards[card].labels = cards[card].labels.filter(
					(item) => item !== label
				);
			}
		}

		// removes label globally
		store.state.boardLabels.splice(
			store.state.boardLabels.findIndex((item) => item.id === label.id),
			1
		);
	}
</script>

<template>
	<!-- header container -->
	<div class="header-container">
		<h1>Labels management</h1>
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
			<input type="text" id="label-title" :value="editingLabel.title" />
			<br />
			<label for="label-color">Label color:</label>
			<input type="color" id="label-color" :value="editingLabel.color" />
			<br />
			<button @click="editLabel(editingLabel)">Save</button>
			<button
				@click="
					editing = false;
					editingLabel = null;
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
		<button>Close</button>
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
