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
});

watchEffect(async () => {
	if (state.board_id) {
		const boardData = await getBoard(state.board_id);

		if (boardData) {
			const { lists, labels } = boardData;

			localStorage.setItem("board", JSON.stringify(lists));
			localStorage.setItem("boardLabels", JSON.stringify(labels));

			state.board = JSON.parse(localStorage.getItem("board"));
			state.boardLabels = JSON.parse(localStorage.getItem("boardLabels"));
			state.board_id = boardData.id;
		}

		localStorage.setItem("board", JSON.stringify(state.board));
		localStorage.setItem("boardLabels", JSON.stringify(state.boardLabels));
	} else if (state.board_id === undefined) {
		router.push("/vue-kanban/404");
	}
});

export default {
	state: state,
};

/*
import { reactive, watchEffect } from "vue";
import apiClient from "./api";

async function getBoard(id) {
	try {
		const response = await apiClient.getBoardFull(id);
		return response.data[0];
	} catch (e) {
		console.error(e);
		return null;
	}
}

// create local storages if there's none
if (!localStorage.getItem("board")) {
	localStorage.setItem("board", JSON.stringify([]));
}

if (!localStorage.getItem("boardLabels")) {
	localStorage.setItem("boardLabels", JSON.stringify([]));
}

const initState = async () => {
	const boardData = await getBoard(2);

	const { lists, labels } = boardData;

	localStorage.setItem("board", JSON.stringify(lists));
	localStorage.setItem("boardLabels", JSON.stringify(labels));

	const state = reactive({
		board: JSON.parse(localStorage.getItem("board")),
		boardLabels: JSON.parse(localStorage.getItem("boardLabels")),
		itemsDraggable: true,
		editingData: {},
	});

	return state;
};

const state = await initState();

// update board on it's changes
watchEffect(() => {
	localStorage.setItem("board", JSON.stringify(state.board));
	localStorage.setItem("boardLabels", JSON.stringify(state.boardLabels));
});

export default {
	state: state,
};
*/
