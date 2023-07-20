<script setup>
import { ref } from "vue";
import api from "../api";
import router from "../router";

const emit = defineEmits(["close"]);

const newBoard = ref({
    boardTitle: "",
    boardPassword: "",
});

async function createBoard() {
    try {
        if (
            newBoard.value.boardPassword.trim("").length < 1 ||
            newBoard.value.boardTitle.trim("").length < 1
        ) {
            alert("no field should be empty");
            return;
        }
        const response = await api.postBoard({
            title: newBoard.value.boardTitle,
            password: newBoard.value.boardPassword,
        });

        const redirectTo = `/vue-kanban/board/${response.data.data[0].id}`;

        emit("close");
        router.push(redirectTo);
    } catch (e) {
        console.error(e);
    }
}
</script>

<template>
    <!-- header -->
    <div class="header-container">
        <h1>Create board</h1>
    </div>

    <hr />

    <!-- content -->
    <div class="content-container">
        Board name:
        <input
            type="text"
            placeholder="Board name"
            v-model="newBoard.boardTitle"
            @keyup.enter="createBoard"
            autofocus
        />
        <br />
        Board password:
        <input
            type="password"
            placeholder="Board password"
            v-model="newBoard.boardPassword"
            @keyup.enter="createBoard"
        />
    </div>

    <!-- footer -->
    <div class="footer-container">
        <button @click="createBoard">create board</button>
        <button @click="$emit('close')">cancel</button>
    </div>
</template>

<style scoped>
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
}
.header-container h1 {
    margin: 0 0;
    white-space: normal;
    word-break: break-all;
    width: 100%;
}
.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
}
</style>
