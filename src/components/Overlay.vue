<script setup>
	import { ref, inject, watch } from "vue";
	import * as utils from "../utils";

	const props = defineProps(["taskData", "listData"]);
	const emit = defineEmits(["close"]);

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
		if (inputValue.value.trim().length > 0 && e.key !== "Escape")
			props.taskData.description = inputValue.value;

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
				<h4 class="task-labels">Labelname</h4>
				<h3>Description:</h3>
				<div class="description-container">
					<p
						v-if="!editing || editingElement !== 'p'"
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
					<input
						type="text"
						ref="inputField"
						v-model="inputValue"
						v-if="editing && editingElement === 'p'"
						@blur="editDescription"
						@keyup.enter="editDescription"
						@keyup.esc="editDescription"
					/>
				</div>
			</div>
			<!-- footer container -->
			<div class="footer-container">
				<button @click="$emit('close')">Close</button>
				<p class="small-text">
					Date created: {{ props.taskData.dateCreated }}
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
		margin: 0;
	}
	.header-container h1 {
		margin: 1.5rem 0 0;
		white-space: normal;
		word-break: break-all;
	}
	.task-labels {
		margin: 1rem 0;
		padding: 0 0.25rem;
		display: inline-block;
		background-color: green;
	}
	.description-container {
		padding: 0.25rem 0.5rem;
		background-color: rgba(0, 0, 0, 0.4);
		margin: 0;

		white-space: pre-wrap;
		overflow-wrap: break-word;
		word-wrap: break-word;
		max-width: 100%;
	}
	.description-container p {
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
