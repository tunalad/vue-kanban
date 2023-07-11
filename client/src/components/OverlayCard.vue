<script setup>
	import { ref, inject, watch } from "vue";
	import * as utils from "../utils";
	import api from "../api";

	const store = inject("store");

	const props = defineProps(["taskData", "listData"]);
	const emit = defineEmits(["close", "toggleLabelManager"]);

	const boardLabels = ref(store.state.boardLabels);

	const labelSelector = ref("default");
	const editing = ref(false);
	const editingElement = ref(null);
	const inputField = ref(null);
	const inputValue = ref("");

	async function editTitle(e) {
		if (inputValue.value.trim().length > 0 && e.key !== "Escape")
			props.taskData.title = inputValue.value;

		inputValue.value = props.taskData.title;
		editing.value = false;
		editingElement.value = null;

		await api.patchCard(props.taskData.id, {
			title: props.taskData.title,
		});
	}

	async function editDescription(e) {
		if (e.key !== "Escape") {
			const inputValueTrimmed = inputValue.value.trim();
			if (inputValueTrimmed !== props.taskData.description) {
				props.taskData.description = inputValueTrimmed;
			}
		}

		inputValue.value = props.taskData.description;
		editing.value = false;
		editingElement.value = null;

		await api.patchCard(props.taskData.id, {
			description: props.taskData.description,
		});
	}

	async function deleteCard() {
		utils.removeObject(props.listData.cards, props.taskData.position);

		inputValue.value = "";
		editing.value = false;
		editingElement.value = null;

		emit("close");
		// server
		await api.deleteCard(props.taskData.id);
	}

	async function handleLabel(e) {
		const index = parseInt(e.target.value);
		const label = store.state.boardLabels.find((item) => item.id === index);

		const labelIndex = props.taskData.labels.findIndex(
			(item) => item.id === index
		);

		if (labelIndex !== -1) {
			// If the label already exists, remove it from the array
			//client update
			props.taskData.labels.splice(labelIndex, 1);

			props.taskData.labels.sort((a, b) => a.id - b.id);
			labelSelector.value.selectedIndex = 0;

			//server update
			await api.deleteCardLabel({
				card_id: props.taskData.id,
				label_id: label.id,
			});
		} else {
			// If the label doesn't exist, push it to the array
			//client update
			props.taskData.labels.push(label);

			props.taskData.labels.sort((a, b) => a.id - b.id);
			labelSelector.value.selectedIndex = 0;

			// server update
			await api.postCardLabel({
				card_id: props.taskData.id,
				label_id: label.id,
			});
		}
	}

	// handles focusing when editing
	watch(editing, (newVal, oldVal) => {
		if (newVal && !oldVal) {
			requestAnimationFrame(() => {
				inputField.value.focus();
			});
		}
	});
</script>

<template>
	<!-- header container -->
	<div class="header-container">
		<h1
			v-if="!editing || editingElement !== 'h1'"
			@click="
				editing = true;
				editingElement = 'h1';
				inputValue = props.taskData.title;
			"
		>
			{{ props.taskData.title }}
		</h1>
		<input
			type="text"
			ref="inputField"
			v-model="inputValue"
			v-if="editing && editingElement === 'h1'"
			@blur="editTitle"
			@keyup.enter="editTitle"
			@keyup.esc="editTitle"
		/>

		<button @click="deleteCard">Delete card</button>
	</div>
	<!-- content container -->
	<div class="content-container">
		<!-- labels container -->
		<div class="labels-container">
			<select ref="labelSelector" @change="handleLabel">
				<option value="default" disabled selected>+ set label</option>
				<option v-for="label in boardLabels" :value="label.id">
					{{ label.title }}
					<span
						v-if="
							JSON.stringify(props.taskData.labels).includes(
								JSON.stringify(label)
							)
						"
					>
						×
					</span>
				</option>
			</select>
			<!-- displays labels -->
			<h4
				v-for="label in props.taskData.labels"
				:style="{ backgroundColor: label.color }"
			>
				{{ label.title }}
			</h4>
		</div>

		<a href="#" @click="$emit('toggleLabelManager')">edit labels</a>

		<!-- description -->
		<h3>Description:</h3>
		<div class="description-container">
			<p
				v-if="!editing || editingElement !== 'p'"
				:style="
					props.taskData.description.trim().length === 0
						? { opacity: 0.25 }
						: {}
				"
				@click="
					editing = true;
					editingElement = 'p';
					inputValue = props.taskData.description;
				"
			>
				{{
					props.taskData.description
						? props.taskData.description
						: "there's no description"
				}}
			</p>
			<textarea
				type="text"
				ref="inputField"
				v-model="inputValue"
				v-if="editing && editingElement === 'p'"
				@blur="editDescription"
				@keyup.esc="editDescription"
			></textarea>
		</div>
	</div>
	<!-- footer container -->
	<div class="footer-container">
		<button @click="$emit('close')">Close</button>
		<p class="small-text">
			Date created:
			{{
				new Date(props.taskData.date_created).toLocaleString("en-us", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})
			}}
		</p>
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
	.labels-container {
		margin: 1rem 0;
		padding: 0 0.25rem;
		display: flex;
	}
	.labels-container h4 {
		margin: 0 0.25rem;
		padding: 0 0.25rem;
	}
	.description-container {
		padding: 0.25rem 0.5rem;
		background-color: rgba(0, 0, 0, 0.4);
		margin: 0;

		white-space: pre-wrap;
		overflow-wrap: break-word;
		word-wrap: break-word;
		max-width: 100%;
		overflow: auto;
		min-height: 10rem;
		max-height: 10rem;
		display: flex;
		flex-direction: column;
	}
	.description-container p {
		margin: 0;
		padding: inherit;
		width: inherit;
		height: 100%;
		flex-grow: 1;
	}
	.description-container textarea {
		width: 100%;
		min-height: 10rem;
		max-height: 10rem;
		box-sizing: border-box;
		resize: none;
		margin: 0;
		padding: inherit;
	}
	.footer-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0;
	}
	.small-text {
		font-size: 12px;
		text-align: right;
	}
	.content-container {
		margin: 0;
	}
	.content-container h3 {
		margin: 0;
	}
</style>
