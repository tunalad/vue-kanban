import axios from "axios";

const apiClient = axios.create({
	baseURL: "http://localhost:1337",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

export default {
	/* GET */
	getBoard(id) {
		return apiClient.get(`/board/${id}`);
	},

	getBoardFull(id) {
		return apiClient.get(`/board/${id}/full`);
	},

	/* POST */
	postBoardUnlock(id, data) {
		return apiClient.post(`/board/${id}/unlock`, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
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

	/* PATCH */
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

	/* DELETE */
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

	deleteCardLabel(data) {
		return apiClient.delete(`/card_label`, {
			headers: {
				"Content-Type": "application/json",
			},
			params: data,
		});
	},
};
