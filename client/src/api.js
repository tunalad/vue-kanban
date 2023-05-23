import axios from "axios";

const apiClient = axios.create({
	baseURL: "http://localhost:1337",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

export default {
	getBoard(id) {
		return apiClient.get(`/board/${id}`);
	},
	getBoardFull(id) {
		return apiClient.get(`/board/${id}/full`);
	},
};
