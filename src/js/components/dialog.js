import UIComponent from "./ui-component";

class Dialog extends UIComponent {
  constructor({ el, eventQueue, onCreate }) {
    super({ el, eventQueue, eventName: "show-dialog" });
    eventQueue.subscribe("start", data => this.hide());
    el.querySelector("button").addEventListener("click", e => this.hide());
    if (typeof onCreate === "function") {
      onCreate.call(this);
    }
  }
}

export { Dialog as default };
export { Dialog };