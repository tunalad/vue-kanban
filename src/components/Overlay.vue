<template>
	<div class="overlay">
		<div class="overlay-content">
			<div class="header-container">
				<h1>Task title</h1>
				<p class="small-text">Date created: 02.02.2222</p>
			</div>
			<div class="task-description">
				<h3>Description:</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
					auctor, magna non tincidunt iaculis, nulla ipsum tempus
					risus, a blandit nibh augue eget est.
				</p>
			</div>
			<button>Submit</button>
		</div>
	</div>
</template>

<style scoped>
	button {
		margin: 1rem 0;
		text-align: right;
	}
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1;
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
		max-width: 400px;
		min-width: 400px;
	}

	.task-description {
		padding: 0.5rem 0.5rem;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.task-description h3 {
		margin: 0;
	}
	.task-description p {
		margin: 0;
	}
	.small-text {
		font-size: 12px;
		text-align: right;
	}

	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
