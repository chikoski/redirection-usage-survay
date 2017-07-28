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
      for (const subscriber of queue) {
        subscriber(data);
      }
    }
  }
}

export { EventQueue };
export { EventQueue as default };