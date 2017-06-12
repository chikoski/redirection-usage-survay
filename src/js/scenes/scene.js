class Scene {
  constructor({ api, app, renderer }) {
    this.api = api;
    this.app = app;
    this.renderer = renderer;
  }
  start() {
  }
  props(config = {}) {
    config["app"] = config["app"] ? config["app"] : this.app;
    return config;
  }
  render() {
    return this.renderer(this.props());
  }
}

export { Scene as default };
export { Scene };