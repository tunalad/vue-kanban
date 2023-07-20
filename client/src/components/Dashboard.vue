<script setup>
import { ref, inject, onMounted } from "vue";
import Overlay from "./Overlay.vue";

const store = inject("store");
const boardsHistory = ref(store.state.boardsUnlocked);

const overlayDashboard = ref({
    newBoard: false,
    findBoard: false,
});

function removeFromHistory(id) {
    let boardsUnlocked =
        JSON.parse(localStorage.getItem("boardsUnlocked")) || [];

    boardsUnlocked = boardsUnlocked.filter((item) => item.boardId !== id);

    localStorage.setItem("boardsUnlocked", JSON.stringify(boardsUnlocked));

    store.state.boardsUnlocked = JSON.parse(
        localStorage.getItem("boardsUnlocked"),
    );

    boardsHistory.value = store.state.boardsUnlocked;
}

onMounted(() => {
    // clear the stat
    store.state.boardData.id = null;
    store.state.boardData.title = null;
    store.state.boardData.dateCreated = null;
    store.state.board = [];
    store.state.boardLabels = [];
    store.state.itemsDraggable = true;
    store.state.editingData = {};
});
</script>

<template>
    <h1>Dashboard</h1>
    <div class="history-container">
        <h2>History</h2>
        <hr />
        <ul class="history-list">
            <li v-for="b in boardsHistory">
                <a
                    href="#"
                    @click="removeFromHistory(b.boardId)"
                    title="Remove from history"
                    >🗑️</a
                >
                <router-link :to="'/vue-kanban/board/' + b.boardId">
                    {{ `(${b.boardId}) - ` + b.boardTitle }}
                </router-link>
            </li>
            <p v-if="boardsHistory.length < 1">You have no unlocked boards.</p>
        </ul>
        <button
            @click="
                store.state.itemsDraggable = false;
                overlayDashboard.newBoard = true;
            "
        >
            New board
        </button>
        <button
            @click="
                store.state.itemsDraggable = false;
                overlayDashboard.findBoard = true;
            "
        >
            Find Board
        </button>
        <Overlay
            v-if="!store.state.itemsDraggable"
            :newBoard="overlayDashboard.newBoard"
            :findBoard="overlayDashboard.findBoard"
            @close="overlayDashboard = { newBoard: false, findBoard: false }"
        />
    </div>
</template>

<style scoped>
.history-container {
    margin: 0 2rem;
    padding: 0.5rem;
    background-color: teal;
}
.history-container h2 {
    margin: 0;
    padding: 0.75rem 0;
}
.history-list {
    margin: 0;
    padding: 0.75rem 0;
    list-style-type: none;
}
.history-list li {
    background-color: tomato;
    text-align: left;
    margin: 0.25rem;
    padding: 0 1rem;
    display: flex;
}
.history-list li a {
    margin: 0 0.5rem;
    padding: 0;
}
</style>
