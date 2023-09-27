import { ExtentionSelector } from './enum/selector.enum';
import { getSubYouTube } from './script/getSubYouTube/getSubYouTube';
import { BackgroundSript } from './script/runBackgroundScript/runBackgroundScript';
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
	const redyStateMessage = new PageElementService(ExtentionSelector.pageState);

	let isPageReadyState = await BackgroundSript.run(() => {
		return document.readyState === 'complete';
	});

	while (!isPageReadyState) {
		isPageReadyState = await BackgroundSript.run(() => {
			console.log('Ожидание загрузки станицы');
			return document.readyState === 'complete';
		});
	}

	//* Скрываем сообщение о загрузке
	redyStateMessage.hide(true);

	//* Проверяем что находимся на нуджной странице
	if (!(await isYouTubePage())) {
		const errorPageMessage = new PageElementService(ExtentionSelector.pageError);
		errorPageMessage.hide(false);
		return null;
	}

	//* Ототбражаем сообщении об ожидании субтитров
	const infoMess = new PageElementService(ExtentionSelector.info);
	infoMess.hide(false);

	//* Раскрывем субтитры на странице
	await BackgroundSript.run(getSubYouTube);

	//* Скрываем сообщении об ожидании субтитров
	infoMess.hide(true);

	//* Отображаем кнопку
	const buttion = new PageElementService(ExtentionSelector.button);
	buttion.addEvent(buttonAction);
	const startMessageEl = new PageElementService(ExtentionSelector.startMessage);
	(await firstInitialization(settingsStorage)) ? startMessageEl.hide(false) : null;
	return null;
}

init();
settingsInit();
