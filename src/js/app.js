import EventQueue from "./event-queue";

class App {
  constructor({ el, settings = {} }) {
    this.settings = settings;
    this.el = el;
    this.queue = new EventQueue(["scene-change"]);
  }
  start() {

  }
}

export { App as default };
export { App };