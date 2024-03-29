import { ExtentionSelector } from '../../enum/selector.enum';
import { BackgroundSript } from '../../script/runBackgroundScript/runBackgroundScript';
import { youTubeSubtitlesParser } from '../../script/youTubeSubtitlesParser/youTubeSubtitlesParser';
import { PageElementService } from '../../services/page-element/page-elemen.service';
import { createContentElement, createPaginationElement } from '../createElements/createElements';
import { addEventContentElement, addEventPaginationElement } from '../actionInPage/addAction';
import { splitTextIntoChunks } from '../../script/splitTextIntoChunks/splitTextIntoChunks';

export async function buttonAction() {
	const startMessageEl = new PageElementService('.start_message');
	const body = new PageElementService(ExtentionSelector.body);
	startMessageEl.hide(true);
	const sub = await BackgroundSript.run(youTubeSubtitlesParser);

	const textArray = splitTextIntoChunks(sub.content, 15000);

	const contentElement = createContentElement(textArray);
	const paginationElement = createPaginationElement(textArray);

	body.addHTML(contentElement);
	paginationElement ? body.addHTML(paginationElement) : null;

	addEventPaginationElement();
	addEventContentElement();
}
