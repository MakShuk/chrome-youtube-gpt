import { ExtensionSelector } from './enum/selector.enum';
import { getSubYouTube } from './script/getSubYouTube/getSubYouTube';
import { BackgroundScript } from './script/runBackgroundScript/runBackgroundScript';
import { PageElementService } from './services/page-element/page-elemen.service';
import { settingsInit } from './components/settingsPage/settingsPage';
import { firstInitialization } from './components/firstInitialization/firstInitialization';
import { LocalStorageService } from './services/storage/localStorage.service';
import { ExtensionLanguage } from './enum/languages.enum';
import { applyTranslations } from '../src/script/applyTranslations/applyTranslations';
import { translations } from './languages/languages';
import { isYouTubePage } from './script/isYouTubePage/isYouTubePage';
import { buttonAction } from './components/mainButton/mainButton';

import './style.scss';

async function init() {
	const settingsStorage = new LocalStorageService('settings');
	const language =
		(await settingsStorage.load()).data?.extensionLanguage || ExtensionLanguage.ENGLISH;

	applyTranslations(translations, language);

	//* Ждем загрузки страницы
	const readyStateMessage = new PageElementService(ExtensionSelector.pageState);

	let isPageReadyState = await BackgroundScript.run(() => {
		return document.readyState === 'complete';
	});

	while (!isPageReadyState) {
		isPageReadyState = await BackgroundScript.run(() => {
			console.log('Ожидание загрузки станицы');
			return document.readyState === 'complete';
		});
	}

	//* Скрываем сообщение о загрузке
	readyStateMessage.hide(true);

	//* Проверяем что находимся на нужной странице
	if (!(await isYouTubePage())) {
		const errorPageMessage = new PageElementService(ExtensionSelector.pageError);
		errorPageMessage.hide(false);
		return null;
	}

	//* Отображаем сообщении об ожидании субтитров
	const infoMess = new PageElementService(ExtensionSelector.info);
	infoMess.hide(false);

	//* Раскрываем субтитры на странице
	await BackgroundScript.run(getSubYouTube);

	//* Скрываем сообщении об ожидании субтитров
	infoMess.hide(true);

	//* Отображаем кнопку
	const button = new PageElementService(ExtensionSelector.button);
	button.addEvent(buttonAction);
	const startMessageEl = new PageElementService(ExtensionSelector.startMessage);
	(await firstInitialization(settingsStorage)) ? startMessageEl.hide(false) : null;
	return null;
}

init();
settingsInit();
