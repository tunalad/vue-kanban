<script setup>
	import { ref, inject, watch } from "vue";
	import * as utils from "../utils";

	const store = inject("store");

	const props = defineProps(["taskData", "listData"]);
	const emit = defineEmits(["close"]);

	const boardLabels = ref(store.state.boardLabels);

	const labelSelector = ref("default");
	const editing = ref(false);
	const editingElement = ref(null);
	const inputField = ref(null);
	const inputValue = ref("");

	function editTitle(e) {
		if (inputValue.value.trim().length > 0 && e.key !== "Escape")
			props.taskData.title = inputValue.value;

		inputValue.value = props.taskData.title;
		editing.value = false;
		editingElement.value = null;
	}

	function editDescription(e) {
		if (e.key !== "Escape") {
			const inputValueTrimmed = inputValue.value.trim();
			if (inputValueTrimmed !== props.taskData.description) {
				props.taskData.description = inputValueTrimmed;
			}
		}

		inputValue.value = props.taskData.description;
		editing.value = false;
		editingElement.value = null;
	}

	function deleteCard() {
		utils.removeObject(props.listData.tasks, props.taskData.position);

		inputValue.value = "";
		editing.value = false;
		editingElement.value = null;
		emit("close");
	}

	function handleLabel(e) {
		const index = parseInt(e.target.value);
		const label = store.state.boardLabels.find((item) => item.id === index);

		const labelIndex = props.taskData.labels.findIndex(
			(item) => item.id === index
		);
		if (labelIndex !== -1) {
			// If the label already exists, remove it from the array
			props.taskData.labels.splice(labelIndex, 1);
		} else {
			// If the label doesn't exist, push it to the array
			props.taskData.labels.push(label);
		}

		labelSelector.value.selectedIndex = 0;
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
	<div class="overlay" @click="$emit('close')">
		<div class="overlay-content" @click.stop>
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
						<option value="default" disabled selected>
							+ set label
						</option>
						<option v-for="label in boardLabels" :value="label.id">
							{{ label.title }}
							<span
								v-if="
									JSON.stringify(
										props.taskData.labels
									).includes(JSON.stringify(label))
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
						new Date(props.taskData.dateCreated).toLocaleString(
							"en-us",
							{ day: "numeric", month: "long", year: "numeric" }
						)
					}}
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1;
		user-select: text;
	}
	.overlay-content {
		text-align: left;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #333;
		padding: 0 2rem;
		margin: 0;
		max-width: 600px;
		min-width: 500px;
		overflow: auto;
		user-select: auto;
	}
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
