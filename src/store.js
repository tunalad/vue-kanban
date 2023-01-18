import { reactive } from "vue";

import exampleData from "./exampleData.json";

const state = reactive({
	board: exampleData,
	//board: [],
});

export default {
	state: state,
};
