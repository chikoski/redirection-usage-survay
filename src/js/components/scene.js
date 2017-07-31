import UIComponent from "./ui-component";

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

export { Scene as default };
export { Scene };