import { ISettings } from '../../interfaces/settings.interface';
import { ExtensionLanguage, ResponseLanguage } from '../../enum/languages.enum';
import { ExtentionSelector } from '../../enum/selector.enum';
import { EventType, PageElementService } from '../../services/page-element/page-elemen.service';
import { LocalStorageService } from '../../services/storage/localStorage.service';
import { translations } from '../../languages/languages';
import { applyTranslations } from '../../script/applyTranslations/applyTranslations';

type Languages = typeof ResponseLanguage | typeof ExtensionLanguage;

export async function settingsInit() {
	const settingsStorage = new LocalStorageService('settings');

	const startMessageEl = new PageElementService(ExtentionSelector.startMessage);
	const settingsButton = new PageElementService(ExtentionSelector.settingsButtion);
	const settingsArea = new PageElementService(ExtentionSelector.settingsArea);
	const settingsClose = new PageElementService(ExtentionSelector.settingsClose);

	const settingsContext = new PageElementService(ExtentionSelector.context);
	const extensionLanguage = new PageElementService(ExtentionSelector.extensionLanguage);
	const responseLanguage = new PageElementService(ExtentionSelector.responseLanguage);
	const setApiSettings = new PageElementService(ExtentionSelector.setApiSettings);

	const saveSettings = new PageElementService(ExtentionSelector.saveSettings);

	settingsButton.addEvent(async () => {
		const settingsStatus = await settingsStorage.load();
		settingsContext.setTextContent(settingsStatus.data.promptContext);

		extensionLanguage.addHTML(
			selectElementCreate(
				'Extension language: ',
				settingsStatus.data.extensionLanguage,
				ExtensionLanguage,
			),
			true,
		);

		responseLanguage.addHTML(
			selectElementCreate(
				'Response language: ',
				settingsStatus.data.responseLanguage,
				ResponseLanguage,
			),
			true,
		);
		setApiSettings.node.element
			? (setApiSettings.node.element.value = settingsStatus.data.apiKey)
			: null;

		startMessageEl.hide(true);
		settingsArea.hide(false);
	});

	settingsClose.addEvent(() => {
		settingsArea.hide(true);
		startMessageEl.hide(false);
	});

	settingsContext.addEvent(() => {
		saveSettings.node.element ? (saveSettings.node.element.disabled = false) : null;
	}, EventType.Input);

	extensionLanguage.addEvent(() => {
		saveSettings.node.element ? (saveSettings.node.element.disabled = false) : null;
	}, EventType.Input);

	responseLanguage.addEvent(() => {
		saveSettings.node.element ? (saveSettings.node.element.disabled = false) : null;
	}, EventType.Input);

	setApiSettings.addEvent(() => {
		saveSettings.node.element ? (saveSettings.node.element.disabled = false) : null;
	}, EventType.Input);

	saveSettings.addEvent(async () => {
		const newSettings = getSettingsInPage(
			settingsContext,
			extensionLanguage,
			responseLanguage,
			setApiSettings,
		);
		applyTranslations(translations, newSettings.extensionLanguage);
		await saveSettingsFunction(newSettings, settingsStorage);
		settingsArea.hide(true);
		startMessageEl.hide(false);
	});
}

function selectElementCreate(message: string, selected: string, Languages: Languages) {
	const selectOptions: string[] = Object.values(Languages);
	const filteredLanguages = selectOptions.filter(language => language !== selected);
	const optionsHTML = filteredLanguages.map(str => `<option>${str}</option>`).join('');
	const selectedMessage = `<option selected>${message} ${selected}</option>`;
	return `${selectedMessage}
	 ${optionsHTML}`;
}

async function saveSettingsFunction(newSettings: ISettings, settingsStorage: LocalStorageService) {
	try {
		if (!isSettingsValid(newSettings)) throw new Error(`Incorrect settings`);
		const saveStatus = await settingsStorage.save(newSettings);
		if (saveStatus.error) throw new Error(saveStatus.content);
		return { content: saveStatus.content, error: false };
	} catch (error) {
		return { content: `Setup error: ${error}`, error: true };
	}
}

function isSettingsValid(settings: ISettings): boolean {
	if (
		settings &&
		settings.promptContext !== null &&
		settings.promptContext !== undefined &&
		settings.promptContext.trim() !== '' &&
		settings.apiKey !== null &&
		settings.apiKey !== undefined &&
		settings.apiKey.trim() !== '' &&
		settings.extensionLanguage !== null &&
		settings.extensionLanguage !== undefined &&
		settings.extensionLanguage.trim() !== '' &&
		settings.responseLanguage !== null &&
		settings.responseLanguage !== undefined &&
		settings.responseLanguage.trim() !== ''
	) {
		return true;
	} else {
		return false;
	}
}

function getSettingsInPage(
	settingsContext: PageElementService,
	extensionLanguage: PageElementService,
	responseLanguage: PageElementService,
	setApiSettings: PageElementService,
) {
	const context = settingsContext.node.element ? settingsContext.node.element.value : '';
	const apiKey = setApiSettings.node.element?.value || '';
	console.log('context', context.trim());
	const extLanguage = getSelectElement(extensionLanguage);
	const resLanguage = getSelectElement(responseLanguage);

	const newSettings = {
		promptContext: context.trim(),
		extensionLanguage: extLanguage.content,
		responseLanguage: resLanguage.content,
		apiKey: apiKey.trim(),
	};
	return newSettings;
}

function getSelectElement(pageElement: PageElementService) {
	try {
		if (!pageElement.node.element) throw new Error(`get select error`);
		const selectElement = pageElement.node.element as unknown as HTMLSelectElement;
		const selectedOption = selectElement.options[selectElement.selectedIndex];
		if (!selectedOption) throw new Error(`get select error`);
		const selectedValue = getLastWordFromString(selectedOption.textContent || '');
		return { content: selectedValue, error: false };
	} catch (error) {
		return { content: `${error}`, error: true };
	}
}

function getLastWordFromString(inputString: string): string {
	const words = inputString.split(' ');
	const lastWord = words[words.length - 1] || '';
	const cleanedLastWord = lastWord.replace(/[^\wа-яА-Я]/g, '');
	return cleanedLastWord;
}
