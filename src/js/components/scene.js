import UIComponent from "./ui-component";
import dom from "./dom";

class Scene extends UIComponent {
  constructor({ el, eventQueue }) {
    super({ el, eventQueue, eventName: "show-scene" });
  }
  hide() {
    if (!this.hidden) {
      this.eventQueue.publish("before-hide", this);
    }
    super.hide();
  }
  show() {
    if (this.hidden) {
      this.eventQueue.publish("before-show", this);
    }
    super.show();
  }
}

window.dom = dom;

const renderHistory = history => {
  const tr = dom.tr({},
    dom.td({}, dom.a({ href: history.longUrl }, history.longUrl)),
    dom.td({}, history.clicks),
    dom.td({}, dom.a({ href: `https://goo.gl/info/${history.id}` }, "こちら"))
  );
  return tr;
};

class DashBoard extends Scene {
  constructor(conf) {
    super(conf);
    this.csvButton = this.el.querySelector("[data-export=csv]");
    this.spreadsheetButton = this.el.querySelector("[data-export=spreadsheet]");

    this.csvButton.disabled = true;
    this.csvButton.addEventListener("click", e => {
      this.eventQueue.publish("export-csv", this.histories);
    });
    /*
    this.spreadsheetButton.disabled = true;
    this.spreadsheetButton.addEventListener("click", e => {
      this.eventQueue.publish("export-spreadsheet", this.histories);
    });
    */
  }
  update(histories) {
    const joint = this.el.querySelector("tbody");
    const root = document.createDocumentFragment();
    for (const history of histories) {
      const el = renderHistory(history);
      root.appendChild(el);
    }
    this.empty();
    joint.appendChild(root);
    this.csvButton.disabled = false;

    this.histories = histories;
  }
  empty() {
    const joint = this.el.querySelector("tbody");
    while (joint.firstChild) {
      joint.removeChild(joint.firstChild);
    }
  }
}

export { Scene as default };
export { Scene, DashBoard };