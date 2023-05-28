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

	postCard(data) {
		const { title, description, date_created, position, list_id } = data;

		return apiClient.post(
			"/card",
			{
				title,
				description,
				date_created,
				position,
				list_id,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	},

	postLabel(data) {
		const { title, date_created, color, board_id } = data;

		return apiClient.post(
			"/label",
			{
				title,
				date_created,
				color,
				board_id,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	},

	postCardLabel(data) {
		const { card_id, label_id } = data;

		return apiClient.post(
			"/card_label",
			{
				card_id,
				label_id,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	},

	patchList(id, data) {
		return apiClient.patch(`/list/${id}`, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	patchCard(id, data) {
		return apiClient.patch(`/card/${id}`, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	patchLabel(id, data) {
		return apiClient.patch(`/label/${id}`, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	deleteList(id) {
		return apiClient.delete(`/list/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	deleteCard(id) {
		return apiClient.delete(`/card/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},

	deleteLabel(id) {
		return apiClient.delete(`/label/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},
};
