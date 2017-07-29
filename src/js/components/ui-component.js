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

export { UIComponent as default };
export { UIComponent };