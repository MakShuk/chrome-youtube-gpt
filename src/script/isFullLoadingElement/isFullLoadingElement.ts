export async function isFullLoadingElement(selector: string) {
	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
	console.log('Скрипт isFullLoadingElement запущен', selector);
	try {
		const loadingElement = document.querySelector(selector);
		if (!loadingElement) {
			throw new Error(`Элемент не найден, селектор ${selector}`);
		}

		const finalObj = {
			error: false,
			content: `Элемент с селектором ${selector} загрузился`,
		};

		const res = await new Promise<boolean>(async (resolve, reject) => {
			let iteration = 0;
			while (!loadingElement.innerHTML && iteration <= 10) {
				await delay(1000);
				iteration++;
			}
			if (iteration >= 10) {
				reject(false);
			}
			resolve(true);
		});

		if (!res) {
			throw new Error(`Превышено время загрузки элементов субтитров`);
		}
		return finalObj;
	} catch (error) {
		const errorObj = {
			error: true,
			content: `Ошибка: ${error}`,
		};
		return errorObj;
	}
}
