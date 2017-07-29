import UIComponent from "./ui-component";

class Scene extends UIComponent {
  constructor({ el, eventQueue }) {
    super({ el, eventQueue, eventName: "scene-change" });
  }
}

export { Scene as default };
export { Scene };