<script setup>
	import { ref, inject } from "vue";
	import api from "../api";

	const emit = defineEmits(["close"]);
	const store = inject("store");

	const passwordInput = ref("");

	async function submitPassword() {
		const response = await api.getBoard(store.state.board_id);
		if (response.data[0].password === passwordInput.value) {
			console.log("correct password");
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
		/>
	</div>

	<!-- footer -->
	<div class="footer-container">
		<button @click="submitPassword">Unlock</button>
		<button @click="$emit('close')">Close</button>
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
