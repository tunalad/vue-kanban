import { reactive, watchEffect } from "vue";
import apiClient from "./api";
import router from "./router";

async function getBoard(id) {
	try {
		const response = await apiClient.getBoardFull(id);
		return response.data[0];
	} catch (e) {
		console.error(e);
		return null;
	}
}

const state = reactive({
	board_id: null,
	board: [],
	boardLabels: [],
	itemsDraggable: true,
	editingData: {},
	boardsUnlocked: JSON.parse(localStorage.getItem("boardsUnlocked")) || [],
});

watchEffect(async () => {
	if (state.board_id) {
		// if locked
		if (
			!state.boardsUnlocked.some(
				(i) => i.boardId === parseInt(state.board_id)
			)
		) {
			state.itemsDraggable = false;
		} else {
			// if unlocked already
			state.itemsDraggable = true;
			const boardData = await getBoard(state.board_id);

			if (boardData) {
				const { lists, labels } = boardData;

				state.board = lists;
				state.boardLabels = labels;

				state.board_id = boardData.id;
			}
		}
	} else if (state.board_id === undefined) {
		console.log("cummings");
		router.push("/vue-kanban/404");
	}
});

export default {
	state: state,
};
