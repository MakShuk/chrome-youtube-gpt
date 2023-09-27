export function createContentElement(dataArray: string[]) {
	let html = '';

	dataArray.forEach((str: string, i) => {
		const hide = i == 0 ? '' : 'display: none;';
		html += `
    <div class="content" style="${hide}" key="${i + 1}">
      <div class="pagination-top">
        <div class="pagination-top-child group-${i + 1} enabled" group="${
			i + 1
		}" textarea="subtitles">Запрос</div>
        <div class="pagination-top-child group-${i + 1} disabled" group="${
			i + 1
		}" response="not received" textarea="answer">Ответ</div>  
      </div>
      <textarea class="extention-textarea subtitles area-${i + 1}">${str}</textarea>
	  <textarea class="extention-textarea answer area-${i + 1} " style="display: none;"></textarea>
    </div>
  `;
	});
	return `<div class="main">${html}</div>`;
}

export function createPaginationElement(data: string[]) {
	if (data.length <= 1) {
		return null;
	}
	let html = '';

	data.forEach((_: string, i) => {
		const enabled = i === 0 ? 'enabled' : 'disabled';
		html += `<div class="pagination-el ${enabled}" key="${i + 1}">${i + 1}</div>
  `;
	});
	return ` <div class="pagination-bottom">${html}</div>`;
}
