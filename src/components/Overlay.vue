<script setup>
	import { ref, watch } from "vue";
	const props = defineProps(["taskData"]);

	const editing = ref(false);
	const inputField = ref(null);
	const inputValue = ref(props.taskData.title);

	function editTitle(e) {
		if (inputValue.value.trim().length > 0 && e.key !== "Escape")
			props.taskData.title = inputValue.value;

		inputValue.value = props.taskData.title;
		editing.value = false;
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
			<div class="header-container">
				<h1 v-if="!editing" @click="editing = true">
					{{ props.taskData.title }}
				</h1>
				<input
					type="text"
					ref="inputField"
					v-model="inputValue"
					v-else
					@blur="editTitle"
					@keyup.enter="editTitle"
					@keyup.esc="editTitle"
				/>
			</div>
			<div class="content-container">
				<h4 class="task-labels">Labelname</h4>
				<h3>Description:</h3>
				<p class="task-description">
					{{
						props.taskData.description
							? props.taskData.description
							: "there's no description"
					}}
				</p>
			</div>
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
	.task-description {
		padding: 0.5rem 0.5rem;
		background-color: rgba(0, 0, 0, 0.4);
		margin: 0;

		white-space: pre-wrap;
		overflow-wrap: break-word;
		word-wrap: break-word;
		max-width: 100%;
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
