export class BackgroundScript {
	static async run(func: any, arr?: any): Promise<any> {
		const [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});

		if (typeof tab?.id === 'number') {
			const result = await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func,
				args: arr || [],
			});

			const funcResult = result[0]?.result;
			return funcResult;
		}
	}
}
