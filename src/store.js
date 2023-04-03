import { reactive, watchEffect } from "vue";

// create local storage if there's none
if (!localStorage.getItem("board")) {
	localStorage.setItem("board", JSON.stringify([]));
}

const state = reactive({
	board: JSON.parse(localStorage.getItem("board")),
	boardLabels: [
		{ id: 1, title: "label01", color: "purple" },
		{ id: 2, title: "label02", color: "cyan" },
		{ id: 3, title: "label03", color: "pink" },
		{ id: 4, title: "label04", color: "brown" },
		{ id: 5, title: "label05", color: "black" },
	],
	itemsDraggable: true,
	editingData: {},
});

// update board on it's changes
watchEffect(() => {
	localStorage.setItem("board", JSON.stringify(state.board));
});

export default {
	state: state,
};
