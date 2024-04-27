interface IGetSubYouTubeResult {
	error: boolean;
	content: string;
}

export async function getSubYouTube(): Promise<IGetSubYouTubeResult> {
	try {
		const nodesSelector = '#segments-container > ytd-transcript-segment-renderer';
		let nodes = document.querySelectorAll(nodesSelector);
		if (nodes.length > 0) {
			return { error: false, content: 'Элемент присутствует' };
		}

		const description = '#description-inner';
		const menuBtn = document.querySelector(description) as HTMLBaseElement;
		if (!menuBtn) {
			throw new Error(`Элемент не найден, селектор ${description}`);
		}
		menuBtn?.click();

		const subBtnSelector =
			'#primary-button > ytd-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill';
		let getSubBtn = document.querySelector(subBtnSelector) as HTMLBaseElement;

		while (!getSubBtn) {
			await new Promise(resolve => setTimeout(resolve, 100));
			getSubBtn = document.querySelector(subBtnSelector) as HTMLBaseElement;
		}
		getSubBtn?.click();

		while (nodes.length <= 0) {
			await new Promise(resolve => setTimeout(resolve, 100));
			nodes = document.querySelectorAll(nodesSelector);
		}

		return { error: false, content: 'Субтитры отображены на странице' };
	} catch (error) {
		return {
			error: true,
			content: `Субтитры отображения субтитров на странице: ${error}`,
		};
	}
}
