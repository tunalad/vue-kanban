<script setup>
	import { ref, inject } from "vue";
	import api from "../api";

	const props = defineProps(["boardData"]);
	const emit = defineEmits(["close", "toggleLabelManager"]);

	const store = inject("store");

	const editingValue = ref(null);
	const titleInput = ref(props.boardData.title);
	const errorMessage = ref({
		code: null,
		msg: null,
	});
	const passwordInput = ref({
		old: "",
		new: "",
		newAgain: "",
	});

	async function updateTitle() {
		// update locally
		store.state.boardData.title = titleInput.value;

		// localstorage history update
		let boardsUnlocked =
			JSON.parse(localStorage.getItem("boardsUnlocked")) || [];

		let unlockedItem = boardsUnlocked.find(
			(i) => i.boardId === store.state.boardData.id
		);

		if (unlockedItem) unlockedItem.boardTitle = titleInput.value;

		localStorage.setItem("boardsUnlocked", JSON.stringify(boardsUnlocked));

		store.state.boardsUnlocked = JSON.parse(
			localStorage.getItem("boardsUnlocked")
		);

		goBack();
		// update on server
		try {
			await api.patchBoard(props.boardData.id, {
				title: titleInput.value,
			});
		} catch (e) {
			console.error(e);
		}
	}

	async function updatePassword() {
		try {
			const response = await api.getBoard(props.boardData.id);

			if (response.data[0].password !== passwordInput.value.old) {
				errorMessage.value = {
					code: "WRONG_PW",
					msg: "Wrong password",
				};
				return;
			}

			if (passwordInput.value.new !== passwordInput.value.newAgain) {
				errorMessage.value = {
					code: "PW_NOT_MATCH",
					msg: "Passwords don't match",
				};
				return;
			}

			// update on server
			await api.patchBoard(props.boardData.id, {
				password: passwordInput.value.new,
			});
			goBack();
		} catch (e) {
			console.error(e);
		}
	}

	async function deleteBoard() {
		// remove from localstorage
		let boardsUnlocked =
			JSON.parse(localStorage.getItem("boardsUnlocked")) || [];

		boardsUnlocked = boardsUnlocked.filter(
			(item) => item.boardId !== store.state.boardData.id
		);

		localStorage.setItem("boardsUnlocked", JSON.stringify(boardsUnlocked));
		store.state.boardsUnlocked = JSON.parse(
			localStorage.getItem("boardsUnlocked")
		);

		// delete from database
		try {
			await api.deleteBoard(props.boardData.id);
		} catch (e) {
			console.error(e);
		}
	}

	function clearErrors() {
		errorMessage.value = {
			code: null,
			msg: null,
		};
	}

	function saveChanges() {
		if (editingValue.value === "title") {
			updateTitle();
		}
		if (editingValue.value === "password") {
			updatePassword();
		}
		console.log(errorMessage.value);
	}

	function goBack() {
		//titleInput.value = null;
		clearErrors();
		titleInput.value = props.boardData.title;
		passwordInput.value = {
			old: "",
			new: "",
			newAgain: "",
		};
		editingValue.value = null;
	}
</script>

<template>
	<!-- header -->
	<div class="header-container">
		<h1>Board settings</h1>
		<button @click="deleteBoard">Delete board</button>
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
		<input placeholder="Title goes here" v-model="titleInput" />
		<br />
	</div>

	<!-- password editor -->
	<div class="password-editor" v-if="editingValue === 'password'">
		<h3>Editing board password</h3>
		<span>Old password: </span>
		<input
			type="password"
			v-model="passwordInput.old"
			:class="{ 'error-input': errorMessage.code === 'WRONG_PW' }"
			@focus="clearErrors"
		/>
		<br />
		<span>New password: </span>
		<input
			type="password"
			v-model="passwordInput.new"
			:class="{ 'error-input': errorMessage.code === 'PW_NOT_MATCH' }"
			@focus="clearErrors"
		/>
		<br />
		<span>Repeat the new password: </span>
		<input
			type="password"
			v-model="passwordInput.newAgain"
			:class="{ 'error-input': errorMessage.code === 'PW_NOT_MATCH' }"
			@focus="clearErrors"
		/>

		<h4 class="error-input" v-if="errorMessage.code">
			Error: {{ errorMessage.msg }}
		</h4>
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
			<button @click="goBack">Back</button>
			<button @click="saveChanges">Save changes</button>
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
	.error-input {
		background-color: rgb(255, 0, 0);
	}
</style>
