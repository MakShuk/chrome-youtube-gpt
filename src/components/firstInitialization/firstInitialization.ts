import { ExtensionLanguage, ResponseLanguage } from '../../enum/languages.enum';
import { ExtentionSelector } from '../../enum/selector.enum';
import { ISettings } from '../../interfaces/settings.interface';
import { EventType, PageElementService } from '../../services/page-element/page-elemen.service';
import { LocalStorageService } from '../../services/storage/localStorage.service';

export async function firstInitialization(settingsStorage: LocalStorageService) {
	const settingsStatus = await settingsStorage.load();

	if (settingsStatus.error) {
		const keyLength = 51;
		const addKeyArea = new PageElementService(ExtentionSelector.addKeyArea);
		const saveButton = new PageElementService(ExtentionSelector.saveKey);
		const firstKeyInput = new PageElementService(ExtentionSelector.firstAddKey);
		const startMessageEl = new PageElementService(ExtentionSelector.startMessage);

		startMessageEl.hide(true);
		addKeyArea.hide(false);

		firstKeyInput.addEvent(() => {
			var inputValue = firstKeyInput.node.element?.value || '';
			if (inputValue.length < keyLength) {
				saveButton.node.element ? (saveButton.node.element.disabled = true) : null;
			}
			if (inputValue.length === keyLength) {
				saveButton.node.element ? (saveButton.node.element.disabled = false) : null;
			}
			if (inputValue.length > keyLength) {
				saveButton.node.element ? (saveButton.node.element.disabled = true) : null;
			}
		}, EventType.Input);

		saveButton.addEvent(() => {
			var inputValue = firstKeyInput.node.element?.value || '';
			if (inputValue.length === keyLength) {
				const initData: ISettings = {
					extensionLanguage: ExtensionLanguage.ENGLISH,
					apiKey: inputValue,
					promptContext: `behave like a teacher who briefly explains the material, retell this information, in a businesslike tone`,
					responseLanguage: ResponseLanguage.ENGLISH,
				};
				settingsStorage.save(initData);
				addKeyArea.hide(true);
				startMessageEl.hide(false);
			}
		});
		return false;
	}
	return true;
}
