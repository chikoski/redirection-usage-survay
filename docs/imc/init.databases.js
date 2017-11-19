const endpoint = "http://dblog.kaetsu.ac.jp/click_logs";

function findAll(selector) {
	return Array.prototype.concat.apply([], document.querySelectorAll(selector));
}

function setHandler(selector, event, handler) {
	const list = findAll(selector);
	for (const item of list) {
		item.addEventListener(event, handler);
	}
}

function resetOnClick(selector) {
	const handler = event => {
		event.target.value = "";
	};
	setHandler(selector, "click", handler);
}

function logger(element) {
	return event => {
		const destination = element.href;
		if (destination == null) {
			return;
		}
		const url = `${endpoint}/${encodeURI(destination)}`;
		fetch(url, { mode: "no-cors" })
			.then(() => { }, () => { });
	}
}

function setLogger(selector) {
	findAll(selector)
		.map(i => [i, logger(i)])
		.forEach(i => i[0].addEventListener("click", i[1]));
}

function start() {
	if (typeof create_toc === "function") {
		create_toc("toc");
	}
	resetOnClick("input[type=text]");
	setLogger("[target=_blank]");
}

window.addEventListener("DOMContentLoaded", start);