import { reactive, watchEffect } from "vue";

// create local storage if there's none
if (!localStorage.getItem("board")) {
	localStorage.setItem("board", JSON.stringify([]));
}

const state = reactive({
	board: JSON.parse(localStorage.getItem("board")),
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
