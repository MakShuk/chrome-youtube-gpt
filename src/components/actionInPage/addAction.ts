import { LocalStorageService } from '../../services/storage/localStorage.service';
import { ExtensionSelector } from '../../enum/selector.enum';
import { OpenaiService } from '../../services/openai/openai.service';
import { Stream } from 'openai/streaming';

export function addEventPaginationElement() {
	const childPaginationElements = document.querySelectorAll(ExtensionSelector.paginationEl);

	function disableAllElements() {
		childPaginationElements.forEach(element => {
			element.classList.remove('enabled');
			element.classList.add('disabled');
		});
	}
	function showContentElement(key: string) {
		const elements = document.querySelectorAll(
			ExtensionSelector.contentEl,
		) as NodeListOf<HTMLDivElement>;
		elements.forEach(el => {
			el.style.display = 'none';
			if (el.getAttribute('key') === key) {
				el.style.display = '';
			}
		});
	}

	childPaginationElements.forEach(element => {
		element.addEventListener('click', () => {
			disableAllElements();
			showContentElement(element.getAttribute('key') || '1');
			element.classList.remove('disabled');
			element.classList.add('enabled');
		});
	});
}

export function addEventContentElement() {
	const  childContentElement = document.querySelectorAll(ExtensionSelector.paginationTopСhild);

	function disabledAllEl(n: string) {
		const childContentElements = document.querySelectorAll(`.group-${n}`);
		childContentElements.forEach(element => {
			element.classList.remove('enabled');
			element.classList.add('disabled');
		});
	}

	function toggleTextArea(group: string, className: string) {
		const textareas = document.querySelectorAll(
			`.area-${group}`,
		) as NodeListOf<HTMLTextAreaElement>;

		textareas.forEach(el => {
			el.style.display = 'none';
		});
		const showElement = document.querySelector(
			`textarea.extention-textarea.${className}.area-${group}`,
		) as HTMLTextAreaElement;
		showElement.style.display = '';
	}

	childContentElement.forEach(element => {
		element.addEventListener('click', () => {
			const response = element.getAttribute('response') || 'false';

			const group = element.getAttribute('group') || 'group-1';
			disabledAllEl(group);
			const textarea = element.getAttribute('textarea') || 'subtitles';
			element.classList.remove('disabled');
			element.classList.add('enabled');
			toggleTextArea(group, textarea);
			console.log(response);
			console.log(textarea === 'answer');
			if (textarea === 'answer' && response !== 'received') {
				console.log('Делаем запрос');
				addEventAnswerElement(group);
				element.setAttribute('response', 'received');
			}
		});
	});
}

export async function addEventAnswerElement(group: string) {
	const subtitlesTextArea = document.querySelector(
		`textarea.extention-textarea.subtitles.area-${group}`,
	);
	const answerTextArea = document.querySelector(`textarea.extention-textarea.answer.area-${group}`);
	const settingsStorage = new LocalStorageService('settings');
	const settings = await settingsStorage.load();
	const chat = new OpenaiService(settings.data.apiKey);
	const messages = [
		chat.createAssistantMessage(
			`${settings.data.promptContext}. Answer in ${settings.data.responseLanguage}`,
		),
	];
	messages.push(chat.createUserMessage(`${subtitlesTextArea?.textContent}`));
	const stream = await chat.streamResponse(messages);

	if (stream instanceof Stream) {
		for await (const part of stream) {
			const content = part.choices[0]?.delta?.content || '';
			answerTextArea ? (answerTextArea.innerHTML += content) : null;
		}
	} else {
		answerTextArea ? (answerTextArea.textContent = stream.content) : null;
	}
}
