<script setup>
	import { ref, inject } from "vue";
	import api from "../api";

	const store = inject("store");

	const passwordInput = ref("");

	async function submitPassword() {
		try {
			const response = await api.postBoardUnlock(
				store.state.boardData.id,
				{
					password: passwordInput.value,
				}
			);

			if (response.data.message === "correct password") {
				let boardsUnlocked =
					JSON.parse(localStorage.getItem("boardsUnlocked")) || [];

				boardsUnlocked.push({
					boardId: parseInt(store.state.boardData.id),
					boardTitle: response.data.boardTitle,
					token: response.data.jwt,
					dateUnlocked: response.data.dateUnlocked,
				});

				localStorage.setItem(
					"boardsUnlocked",
					JSON.stringify(boardsUnlocked)
				);

				// reload page
				window.location.reload();
			}
		} catch (e) {
			if (e.response && e.response.status === 401)
				alert("oopsie, wrong password");
			else console.error(e);
		}
	}
</script>

<template>
	<!-- header -->
	<div class="header-container">
		<h1>Unlock board</h1>
	</div>

	<!-- content -->
	<div class="content-container">
		<input
			type="password"
			placeholder="Board Password"
			v-model="passwordInput"
			@keyup.enter="submitPassword"
			autofocus
		/>
	</div>

	<!-- footer -->
	<div class="footer-container">
		<button @click="submitPassword">Unlock</button>
		<router-link :to="'/vue-kanban/dashboard/'">
			<button>Close</button>
		</router-link>
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
</style>
