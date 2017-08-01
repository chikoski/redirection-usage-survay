import { Scene as View } from "../components/scene";

class Scene {
  constructor({ el, eventQueue }) {
    this.view = new View({ el: el, eventQueue: eventQueue });
    this.view.hide();
    this.eventQueue = eventQueue;
    this.eventQueue.subscribe("scene-transition", nextScene => {
      if (nextScene == this) {
        this.view.show();
      } else {
        this.view.hide();
      }
    });
  }
}

export { Scene as default };
export { Scene };