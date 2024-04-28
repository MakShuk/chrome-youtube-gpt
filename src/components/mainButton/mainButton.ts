import { ExtensionSelector } from '../../enum/selector.enum';
import { BackgroundScript } from '../../script/runBackgroundScript/runBackgroundScript';
import { youTubeSubtitlesParser } from '../../script/youTubeSubtitlesParser/youTubeSubtitlesParser';
import { PageElementService } from '../../services/page-element/page-elemen.service';
import { createContentElement, createPaginationElement } from '../createElements/createElements';
import { addEventContentElement, addEventPaginationElement } from '../actionInPage/addAction';
import { splitTextIntoChunks } from '../../script/splitTextIntoChunks/splitTextIntoChunks';

export async function buttonAction() {
	const startMessageEl = new PageElementService('.start_message');
	const body = new PageElementService(ExtensionSelector.body);
	startMessageEl.hide(true);
	const sub = await BackgroundScript.run(youTubeSubtitlesParser);
	const textArray = splitTextIntoChunks(sub.content, 110_000);

	const contentElement = createContentElement(textArray);
	const paginationElement = createPaginationElement(textArray);

	body.addHTML(contentElement);
	paginationElement ? body.addHTML(paginationElement) : null;

	addEventPaginationElement();
	addEventContentElement();
}
