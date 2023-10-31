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

async function boardExists(id) {
    try {
        const response = await apiClient.getBoard(id);
        return response.data[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function updateBoardState() {
    const boardData = await getBoard(state.boardData.id);

    if (boardData) {
        const { lists, labels } = boardData;

        state.board = lists;
        state.boardLabels = labels;

        state.boardData.id = boardData.id;
        state.boardData.title = boardData.title;
        state.boardData.dateCreated = boardData.date_created;
    }
}

async function getServerState() {
    try {
        await apiClient.getBoard();
        state.serverUp = true;
    } catch {
        state.serverUp = false;
    }
}

const state = reactive({
    serverUp: true,
    board: [],
    boardData: {
        id: null,
        title: null,
        dateCreated: null,
    },
    boardLabels: [],
    itemsDraggable: true,
    editingData: {},
    boardsUnlocked: JSON.parse(localStorage.getItem("boardsUnlocked")) || [],
    sse: null,
});

watchEffect(async () => {
    getServerState();
    if (state.boardData.id && state.serverUp) {
        // if doesn't exist
        if (!(await boardExists(state.boardData.id)))
            router.push("/vue-kanban/404");

        // if locked
        if (
            !state.boardsUnlocked.some(
                (i) => i.boardId === parseInt(state.boardData.id),
            )
        ) {
            state.itemsDraggable = false;
        } else {
            // if unlocked
            state.itemsDraggable = true;

            updateBoardState();

            // sse watching
            if (state.sse) {
                state.sse.close();
                state.sse = null;
            }

            state.sse = new EventSource(
                `http://localhost:1337/board/${state.boardData.id}/live`,
            );

            state.sse.addEventListener("message", async (event) => {
                // on SSE message
                if (JSON.parse(event.data) === "BOARD DELETED") {
                    state.sse.close();
                    //window.location.replace("/vue-kanban/dashboard");
                    window.location.replace("/vue-kanban/404");
                    //router.push("/vue-kanban/404");
                }

                if (JSON.parse(event.data).updateRequired) {
                    console.log(`${Date.now()} PULL NEW DATA`);
                    updateBoardState();
                }
            });
        }
    }
});

export default {
    state: state,
};
