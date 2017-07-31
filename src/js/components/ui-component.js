class UIComponent {
  constructor({ el, eventQueue, eventName }) {
    this.el = el;
    this.id = el.id;
    this.hidden = false;
    this.eventQueue = eventQueue;
    if (eventName != null) {
      eventQueue.subscribe(eventName, data => {
        if (data.id === this.id) {
          return this.show();
        } else {
          return this.hide();
        }
      });
    }
  }
  hide() {
    if (!this.hidden) {
      this.el.classList.add("hidden");
      this.hidden = true;
    }
    return this;
  }
  show() {
    if (this.hidden) {
      this.el.classList.remove("hidden");
      this.hidden = false;
    }
    return this;
  }
}

export { UIComponent as default };
export { UIComponent };