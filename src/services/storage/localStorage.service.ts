export class LocalStorageService {
	constructor(private key: string) {}

	async save(data: any) {
		try {
			if (data.length === 0) throw new Error(`Не верный ключ: ${this.key}`);
			const jsonData = JSON.stringify(data);

			await new Promise<void>(resolve => {
				window.localStorage.setItem(this.key, jsonData);
				resolve();
			});

			return {
				content: `Данные успешно сохранены в localStorage под ключом "${this.key}".`,
				error: false,
			};
		} catch (error) {
			return {
				content: `Ошибка создания данных в localStorage под ключом ${this.key}: ${error}`,
				error: true,
			};
		}
	}

	async load() {
		try {
			const data = await new Promise<any>(resolve => {
				const jsonData = window.localStorage.getItem(this.key);
				if (!jsonData) throw new Error(`Сохраненных данных под ключом ${this.key} нет`);
				resolve(JSON.parse(jsonData));
			});

			return { content: `Полученны данные под ключом ${this.key}`, error: false, data: data };
		} catch (error) {
			return {
				content: `Ошибка получения данных в localStorage под ключом ${this.key}: ${error}`,
				error: true,
			};
		}
	}
}
