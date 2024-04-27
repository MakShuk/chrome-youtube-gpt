interface IYouTubeSubtitlesParserResult {
	error: boolean;
	content: string;
}

export function youTubeSubtitlesParser(): IYouTubeSubtitlesParserResult {
	try {
		const nodeSelector = '#segments-container > ytd-transcript-segment-renderer';
		const subtitleSelector = 'yt-formatted-string';
		const nodes = document.querySelectorAll(nodeSelector);

		if (nodes.length === 0) {
			throw new Error(
				`nodes.length === 0, проверьте раздел субтитров, селектор ${nodeSelector}`,
			);
		}
		let text: string = '';
		nodes.forEach(e => {
			const content = e.querySelector(subtitleSelector)?.textContent || '';
			text += content;
		});

		if (text.length === 0) {
			throw new Error(`text.length === 0 проверьте селектор ${subtitleSelector}`);
		}

		const reset = document.querySelector('#guide-wrapper') as HTMLDivElement;
		reset ? reset.click() : null;
		return { error: false, content: text };
	} catch (error) {
		return {
			error: true,
			content: `Ошибка пирсинга субтитров ${error}`,
		};
	}
}
