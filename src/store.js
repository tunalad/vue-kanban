import { reactive, watchEffect } from "vue";

// create local storage if there's none
if (!localStorage.getItem("board")) {
	localStorage.setItem("board", JSON.stringify([]));
}

const state = reactive({
	board: JSON.parse(localStorage.getItem("board")),
	boardLabels: [
		{ title: "label01", color: "purple" },
		{ title: "label02", color: "cyan" },
		{ title: "label03", color: "pink" },
		{ title: "label04", color: "brown" },
		{ title: "label05", color: "black" },
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
