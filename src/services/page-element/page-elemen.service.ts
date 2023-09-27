type ElementType = HTMLButtonElement;
type RunFunction = () => void;

export enum EventType {
	Click = 'click',
	MouseOver = 'focus',
	Input = 'input',
}

export interface IElementAction {
	error: boolean;
	content: string;
}

export interface IPageElement extends IElementAction {
	element?: ElementType;
}

export class PageElementService {
	constructor(public selector: string) {
		this.node = this.getElement();
	}

	node: IPageElement;

	private getElement = (): IPageElement => {
		try {
			const element = document.querySelector(this.selector) as ElementType;
			if (!element) {
				throw new Error(`Элемент ${this.selector}не найден`);
			} else {
				return { element: element, content: 'Элемент получен', error: false };
			}
		} catch (error) {
			return { error: true, content: `Ошибка: ${error}` };
		}
	};

	public getTextContent = (): IElementAction => {
		try {
			if (this.node.error) throw new Error(this.node.content);
			let textContent: string = '';
			if (this.node.element && this.node.element.textContent) {
				textContent = this.node.element.textContent;
			}
			return { error: false, content: textContent };
		} catch (error) {
			return { error: true, content: `Ошибка: ${error}` };
		}
	};

	public setTextContent(value: string | number): IElementAction {
		try {
			if (this.node.error && !this.node.element) throw new Error(this.node.content);
			if (!this.node.element) throw new Error(this.node.content);
			this.node.element.textContent = String(value);
			return { error: false, content: `Значение: ${value} - записано` };
		} catch (error) {
			return { error: true, content: `Ошибка: ${error}` };
		}
	}

	addEvent(runFunction: RunFunction, typeEvent?: EventType) {
		try {
			if (this.node.error) throw new Error(this.node.content);
			if (!this.node.element) throw new Error(this.node.content);
			this.node.element.addEventListener(typeEvent || 'click', () => {
				runFunction();
			});
			return { error: false, content: `Событие добалено` };
		} catch (error) {
			return { error: true, content: `Ошибка: ${error}` };
		}
	}

	public hide(hideStatus: boolean) {
		try {
			if (this.node.error) throw new Error(this.node.content);
			if (!this.node.element) throw new Error(this.node.content);
			const status = hideStatus ? 'none' : '';
			this.node.element.style.display = status;
			return { error: false, content: `Элемент срыт: ${hideStatus}` };
		} catch (error) {
			return { error: true, content: `Ошибка: ${error}` };
		}
	}

	public addHTML(html: string, rewrite?: boolean) {
		try {
			if (this.node.error) throw new Error(this.node.content);
			if (!this.node.element) throw new Error(this.node.content);

			if (!rewrite) this.node.element.innerHTML += html;
			if (rewrite) this.node.element.innerHTML = html;

			return { error: false, content: `Добавлен HTML: ${html.slice(0, 10)}...` };
		} catch (error) {
			return { error: true, content: `Ошибка: ${error}` };
		}
	}
}
