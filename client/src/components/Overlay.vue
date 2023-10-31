<script setup>
import { ref, inject } from "vue";
import OverlayCard from "./OverlayCard.vue";
import OverlayLabels from "./OverlayLabels.vue";
import OverlayPassword from "./OverlayPassword.vue";
import OverlayBoard from "./OverlayBoard.vue";
import OverlayFindBoard from "./OverlayFindBoard.vue";
import OverlaySettings from "./OverlaySettings.vue";
import OverlayServer from "./OverlayServer.vue";
import router from "../router";

const store = inject("store");

const emit = defineEmits(["close"]);
const props = defineProps([
    "findBoard",
    "newBoard",
    "boardSettings",
    "checkServer",
]);

const labelManager = ref(false);
const boardPassword = ref(
    // checks if unlocked
    !store.state.boardsUnlocked.some(
        (i) => i.boardId === store.state.boardData.id,
    ),
);

function closeOverlay() {
    store.state.itemsDraggable = true;
    store.state.editingData = {};

    emit("close");
    // redirect to dashboard if we were on password page
    if (boardPassword.value) router.push("/vue-kanban/dashboard");
}
</script>

<template>
    <div class="overlay" @click="closeOverlay">
        <div class="overlay-content" @click.stop>
            <!-- SERVER WARNING -->
            <template v-if="props.checkServer">
                <OverlayServer />
            </template>
            <!-- DASHBOARD -->
            <template v-else-if="props.findBoard">
                <OverlayFindBoard @close="closeOverlay" />
            </template>
            <template v-else-if="props.newBoard">
                <OverlayBoard @close="closeOverlay" />
            </template>
            <!-- BOARD LOCKED -->
            <template v-else-if="boardPassword">
                <OverlayPassword />
            </template>
            <!-- BOARD UNLOCKED -->
            <template v-else>
                <OverlaySettings
                    v-if="!store.state.editingData.taskData && !labelManager"
                    @toggleLabelManager="labelManager = true"
                    @close="closeOverlay"
                    :boardData="store.state.boardData"
                />
                <OverlayCard
                    v-else
                    :taskData="store.state.editingData.taskData"
                    :listData="store.state.editingData.listData"
                    v-if="!labelManager"
                    @toggleLabelManager="labelManager = true"
                    @close="closeOverlay"
                />
                <OverlayLabels
                    v-if="labelManager"
                    @close="labelManager = false"
                />
            </template>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    user-select: text;
}
.overlay-content {
    text-align: left;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #333;
    padding: 0 2rem;
    margin: 0;
    max-width: 600px;
    min-width: 500px;
    overflow: auto;
    user-select: auto;
}
</style>
