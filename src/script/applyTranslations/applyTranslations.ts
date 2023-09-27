import { ExtensionLanguage } from '../../enum/languages.enum';

type TranslationObject = {
	russian: { [key: string]: string };
	english: { [key: string]: string };
};

export function applyTranslations(
	translations: TranslationObject,
	languages: ExtensionLanguage | string,
) {
	if (languages === ExtensionLanguage.ENGLISH) return null;
	const translation = translations.russian;
	for (const key in translation) {
		const element = document.getElementById(key);
		if (element) {
			element.textContent = translation[key] || '';
		}
	}
	return null;
}
