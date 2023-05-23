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

	postList(data) {
		const { title, date_created, position, board_id } = data;

		console.log(data);

		return apiClient.post(
			"/list",
			{
				title,
				date_created,
				position,
				board_id,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	},
};
