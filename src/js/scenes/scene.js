class Scene {
  constructor({ api, app, renderer }) {
    this.api = api;
    this.app = app;
    this.renderer = renderer;
    this.errorMessage = null;
  }
  start() {
  }
  props(config = {}) {
    config["app"] = config["app"] ? config["app"] : this.app;
    return config;
  }
  render() {
    const el = this.renderer(this.props());
    return el;
  }
  error() {
    // XXX
  }
}

export { Scene as default };
export { Scene };