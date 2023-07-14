<script setup>
	import { ref, onMounted, inject } from "vue";
	import api from "../api";

	const props = defineProps(["boardData"]);
	const emit = defineEmits(["close", "toggleLabelManager"]);

	//const store = inject("store");

	const editingValue = ref(null);

	onMounted(() => {});
</script>

<template>
	<!-- header -->
	<div class="header-container">
		<h1>Board settings</h1>
		<button>Delete board</button>
	</div>
	<hr />

	<!-- content -->
	<div class="content-container" v-if="!editingValue">
		<h3>
			{{ props.boardData.title }}
			<button title="Edit title" @click="editingValue = 'title'">
				✏️
			</button>
		</h3>

		<button @click="$emit('toggleLabelManager')">Labels manager</button>
		<br />
		<button @click="editingValue = 'password'">Change password</button>
	</div>

	<!-- title editor -->
	<div class="title-editor" v-if="editingValue === 'title'">
		<h3>Editing board title</h3>
		<span>Title: </span>
		<input placeholder="Title goes here" :value="props.boardData.title" />
		<br />
	</div>

	<!-- password editor -->
	<div class="password-editor" v-if="editingValue === 'password'">
		<h3>Editing board password</h3>
		<span>Old password: </span>
		<input type="password" />
		<br />
		<span>New password: </span>
		<input type="password" />
		<br />
		<span>Repeat the new password: </span>
		<input type="password" />
	</div>

	<!-- footer -->
	<div class="footer-container">
		<!-- if not editing -->
		<template v-if="!editingValue">
			<button @click="$emit('close')">Close</button>
			<p class="small-text">
				Date created:
				{{
					new Date(props.boardData.dateCreated).toLocaleString(
						"en-us",
						{
							day: "numeric",
							month: "long",
							year: "numeric",
						}
					)
				}}
			</p>
		</template>
		<!-- if editing -->
		<template v-else>
			<button @click="editingValue = null">Back</button>
			<button>Save changes</button>
		</template>
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
	.footer-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 1rem 0;
	}
	.small-text {
		font-size: 12px;
		text-align: right;
	}
</style>
