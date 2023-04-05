<script setup>
	const emit = defineEmits(["close"]);
</script>

<template>
	<div class="overlay" @click="$emit('close')">
		<div class="overlay-content" @click.stop>
			<slot />
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
