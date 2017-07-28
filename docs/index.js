const App = (() => {
  const toA = list => Array.prototype.concat.apply([], list);
  const promise = f => new Promise((resolve, reject) => f());

  class EventQueue {
    constructor(names = []) {
      this.map = names.reduce((map, name) => {
        map.set(name, []);
        return map;
      }, new Map());
    }
    subscribe(name, listener) {
      if (this.map.has(name)) {
        const queue = this.map.get(name);
        queue.push(listener);
      }
    }
    publish(name, data) {
      if (this.map.has(name)) {
        const queue = this.map.get(name);
        console.log(`Event "${name}" has been sent to ${queue.length} subscribers`);
        for (const subscriber of queue) {
          subscriber(data);
        }
      }
    }
  }

  class UIComponent {
    constructor({ el, eventQueue, eventName }) {
      this.el = el;
      this.id = el.id;

      eventQueue.subscribe(eventName, data => {
        if (data.id === this.id) {
          return this.show();
        } else {
          return this.hide();
        }
      });
    }
    hide() {
      this.el.classList.add("hidden");
      return this;
    }
    show() {
      this.el.classList.remove("hidden");
      return this;
    }
  }

  class Scene extends UIComponent {
    constructor({ el, eventQueue }) {
      super({ el, eventQueue, eventName: "scene-changed" });
    }
  }

  class Dialog extends UIComponent {
    constructor({ el, eventQueue }) {
      super({ el, eventQueue, eventName: "error-raised" });
      eventQueue.subscribe("start", data => this.hide());
      el.querySelector("button").addEventListener("click", e => this.hide());
    }
  }

  const createComponentMap = (base, queue) =>
    (selector, klass) => toA(base.querySelectorAll(selector)).reduce((map, el) => {
      const component = new klass({ el: el, eventQueue: queue });
      map.set(component.id, component);
      return map;
    }, new Map());

  class App {
    constructor({ el }) {
      this.el = el;
      this.queue = new EventQueue(["scene-changed", "error", "start"]);
      const createMap = createComponentMap(this.el, this.queue);
      this.scenes = createMap(".scene", Scene);
      this.dialogs = createMap(".dialog", Dialog);

      this.queue.subscribe("error", error => {
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
    transite(newScene) {
      return promise(() => {
        if (this.scenes.has(newScene)) {
          this.scene = this.scenes.get(newScene);
          this.queue.publish("scene-changed", this.scene);
          return Promise.resolve(this);
        }
        return Promise.reject(`No corresponding scene is available for ${newScene}`);
      });
    }
    send(error) {
      switch (error) {
        case "api-error":
        case "load-error":
          this.queue.publish("error", { type: error });
          break;
        default:
      }
    }
    start() {
      this.transite("start").then(result => console.log("Transite to start scene"));
      this.queue.publish("start", {});
    }
  }
  return App;
})();

window.addEventListener("DOMContentLoaded", e => {
  window.app = new App({ el: document.querySelector("#app") });
  window.app.start();
  window.controls = {
    start: () => app.transite("start"),
    signin: () => app.transite("signin"),
    dashboard: () => app.transite("dashboard"),
    apiError: () => app.send("api-error"),
    loadError: () => app.send("load-error")
  };
  window.onSignIn = event => console.log(event);
});