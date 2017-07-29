import EventQueue from "./event-queue";
import { Scene, Dialog } from "./component";

const toA = list => Array.prototype.concat.apply([], list);

const promise = f => new Promise((resolve, reject) => f());

const createComponentMap = (base, queue) =>
  (selector, klass) => toA(base.querySelectorAll(selector)).reduce((map, el) => {
    const component = new klass({ el: el, eventQueue: queue });
    map.set(component.id, component);
    return map;
  }, new Map());

class App {
  constructor({ el, settings = {} }) {
    this.el = el;
    this.settings = settings;
    this.queue = new EventQueue(["scene-change", "show-dialog", "start"]);

    const createMap = createComponentMap(this.el, this.queue);
    this.scenes = createMap(".scene", Scene);
    this.dialogs = createMap(".dialog", Dialog);

    this.queue.subscribe("show-dialog", error => {
      let dialog = null;
      switch (error.type) {
        case "api-error":
          dialog = this.dialogs.get("api-load-error");
          break;
        case "load-error":
          dialog = this.dialogs.get("data-load-error");
        default:
      }
      if (dialog) {
        dialog.show();
      }
    });
  }
  start() {
    this.transite("start").then(result => console.log("Transite to start scene"));
    this.queue.publish("start", {});
  }
  transite(newScene) {
    return promise(() => {
      if (this.scenes.has(newScene)) {
        this.scene = this.scenes.get(newScene);
        this.queue.publish("scene-change", this.scene);
        return Promise.resolve(this);
      }
      return Promise.reject(`No corresponding scene is available for ${newScene}`);
    });
  }
}

export { App as default };
export { App };

