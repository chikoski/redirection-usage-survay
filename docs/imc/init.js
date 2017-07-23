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

function setLogger(selector) {
	const hander = event => {
		const destination = event.target.href;
		if (destination == null) {
			return;
		}
		const url = `${endpoint}/${encodeURI(destination)}`;
		fetch(url, { mode: "no-cors" })
			.then(() => { }, () => { });
	}
	setHandler(selector, "click", hander);
}

function start() {
	if (typeof create_toc === "function") {
		create_toc("toc");
	}
	resetOnClick("input[type=text]");
	setLogger(".logging");
}

window.addEventListener("DOMContentLoaded", start);