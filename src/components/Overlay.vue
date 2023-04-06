<script setup>
	import { ref, inject } from "vue";
	import OverlayCard from "./OverlayCard.vue";
	import OverlayLabels from "./OverlayLabels.vue";

	const store = inject("store");

	const emit = defineEmits(["close"]);

	function closeOverlay() {
		store.state.itemsDraggable = true;
		store.state.editingData = {};
	}
</script>

<template>
	<div class="overlay" @click="closeOverlay">
		<div class="overlay-content" @click.stop>
			<OverlayCard
				:taskData="store.state.editingData.taskData"
				:listData="store.state.editingData.listData"
				@close="closeOverlay"
			/>
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
