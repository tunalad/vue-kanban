<script setup>
	import { onMounted, ref } from "vue";
	import api from "../api";

	const emit = defineEmits(["close"]);

	const boardsList = ref(null);
	const searchInput = ref("");
	const sortState = ref({
		option: "id",
		ascending: false,
	});

	function filterList() {
		let filteredList = [];
		if (boardsList.value === null) return [];
		else
			filteredList = boardsList.value.filter((item) => {
				return item.title
					.toLowerCase()
					.includes(searchInput.value.toLowerCase());
			});

		//filteredList.sort((a, b) => {
		//	if (sortState.value.ascending) {
		//		const tempA = a;
		//		a = b;
		//		b = tempA;
		//	}
		//	if (sortState.value.option === "title")
		//		return a.title.localeCompare(b.title);
		//	else return a[sortState.value.option] - b[sortState.value.option];
		//});

		return sortList(filteredList);
	}

	function changeSortState(option) {
		if (option === sortState.value.option)
			sortState.value.ascending = !sortState.value.ascending;
		else
			sortState.value = {
				option: option,
				ascending: false,
			};
	}

	function sortList(list) {
		return list.sort((a, b) => {
			if (sortState.value.ascending) {
				const tempA = a;
				a = b;
				b = tempA;
			}
			if (sortState.value.option === "title")
				return a.title.localeCompare(b.title);
			else return a[sortState.value.option] - b[sortState.value.option];
		});
	}

	onMounted(async () => {
		boardsList.value = (await api.getBoard()).data;
	});
</script>

<template>
	<!-- header -->
	<div class="header-container">
		<h1>Find board</h1>
	</div>

	<!-- content -->
	<div class="content-container">
		<div class="input-container">
			<input
				v-model="searchInput"
				type="text"
				placeholder="search thing"
			/>
		</div>
		<button @click="changeSortState('id')">
			id
			{{
				sortState.option === "id"
					? sortState.ascending
						? "⬆️"
						: "⬇️"
					: ""
			}}
		</button>
		<button @click="changeSortState('title')">
			title
			{{
				sortState.option === "title"
					? sortState.ascending
						? "⬆️"
						: "⬇️"
					: ""
			}}
		</button>
		<ul>
			<li v-for="bl in filterList()">
				<router-link :to="'/vue-kanban/board/' + bl.id">
					{{ `(${bl.id}) - ` + bl.title }}
				</router-link>
			</li>
		</ul>
	</div>

	<!-- footer -->
	<div class="footer-container">
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

	.content-container {
		margin: 2rem;
		padding: 0.5rem;
		background-color: rgba(0, 0, 0, 25%);
	}
	.content-container h2 {
		margin: 0;
		padding: 0.75rem 0;
	}
	.content-container ul {
		margin: 0 1rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
		max-height: 280px;
		overflow-y: auto;
		background-color: rgba(0, 0, 0, 25%);
	}
	.input-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}
</style>
