export function splitTextIntoChunks(text: string, chunkSize: number): string[] {
	const textArray: string[] = [];
	let currentIndex = 0;

	while (currentIndex < text.length) {
		const chunk = text.substring(currentIndex, currentIndex + chunkSize);
		const lastSpaceIndex = chunk.lastIndexOf(' ');

		if (chunk.length < 300) {
			console.log(chunk);
			textArray[textArray.length - 1] = `${textArray[textArray.length - 1]} ${chunk}`;
			break;
		}
		if (lastSpaceIndex !== -1) {
			textArray.push(chunk.substring(0, lastSpaceIndex));
			currentIndex += lastSpaceIndex + 1;
		} else {
			textArray.push(chunk);
			currentIndex += chunkSize;
		}
	}

	return textArray;
}
