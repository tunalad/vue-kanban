import { reactive, watchEffect } from "vue";

// create local storage if there's none
if (!localStorage.getItem("board")) {
	localStorage.setItem("board", JSON.stringify([]));
}

if (!localStorage.getItem("boardLabels")) {
	localStorage.setItem(
		"boardLabels",
		JSON.stringify([
			{ id: 1, title: "label01", color: "#3cb371" },
			{ id: 2, title: "label02", color: "#ff0000" },
			{ id: 3, title: "label03", color: "#ee82ee" },
			{ id: 4, title: "label04", color: "#6a5acd" },
			{ id: 5, title: "label05", color: "#ffa500" },
		])
	);
}

const state = reactive({
	board: JSON.parse(localStorage.getItem("board")),
	boardLabels: JSON.parse(localStorage.getItem("boardLabels")),
	itemsDraggable: true,
	editingData: {},
});

// update board on it's changes
watchEffect(() => {
	localStorage.setItem("board", JSON.stringify(state.board));
	localStorage.setItem("boardLabels", JSON.stringify(state.boardLabels));
});

export default {
	state: state,
};
