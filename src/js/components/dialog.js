import UIComponent from "./ui-component";

class Dialog extends UIComponent {
  constructor({ el, eventQueue }) {
    super({ el, eventQueue, eventName: "show-dialog" });
    eventQueue.subscribe("start", data => this.hide());
    el.querySelector("button").addEventListener("click", e => this.hide());
  }
}

export { Dialog as default };
export { Dialog };