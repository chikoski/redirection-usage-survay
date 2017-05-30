import { Cachable, CREATED } from "./cachable";

class Sheet extends Cachable {
  constructor(id, title) {
    super();
    this.properties = {
      id: id,
      title: title
    }
    this.rows = [];
  }
  get id() {
    return this.properties.id;
  }
  get title() {
    return this.properties.title;
  }
  set title(newTitle) {
    this.properties.title = newTitle;
  }
  notModified() {
    super.notModified();
    for (const row of this.rows) {
      row.notModified();
    }
  }
  static create(id, title) {
    const product = new Sheet(id, title);
    product.created();
    return product;
  }
}

export { Sheet as default };
export { Sheet };