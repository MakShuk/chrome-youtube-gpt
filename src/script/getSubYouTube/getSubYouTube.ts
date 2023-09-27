interface IGetSubYouTubeResult {
	error: boolean;
	content: string;
}

export async function getSubYouTube(): Promise<IGetSubYouTubeResult> {
	try {
		const nodesSeletctor = '#segments-container > ytd-transcript-segment-renderer';
		let nodes = document.querySelectorAll(nodesSeletctor);
		if (nodes.length > 0) {
			return { error: false, content: 'Элемент присуствует' };
		}

		const description = '#description-inner';
		const menuBtn = document.querySelector(description) as HTMLBaseElement;
		if (!menuBtn) {
			throw new Error(`Элемент не найден, проверте селектор ${description}`);
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
			nodes = document.querySelectorAll(nodesSeletctor);
		}

		return { error: false, content: 'Субитры отоборажены на странице' };
	} catch (error) {
		return {
			error: true,
			content: `Субитры отоборажения субтитров на странице: ${error}`,
		};
	}
}
