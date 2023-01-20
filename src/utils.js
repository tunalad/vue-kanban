function moveInArray(array, fromPos, toPos) {
	if (
		fromPos < 0 ||
		fromPos >= array.length ||
		toPos < 0 ||
		toPos >= array.length
	) {
		console.log("Invalid positions.");
		return;
	}
	let object = array.splice(fromPos, 1)[0];
	array.splice(toPos, 0, object);
	for (let i = 0; i < array.length; i++) {
		array[i].position = i;
	}

	array.sort((a, b) => a.position - b.position);
}

export { moveInArray };
