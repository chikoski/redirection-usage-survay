import Cachable from "./cachable";

class Row extends Cachable {
  constructor(values = []) {
    super();
    this.values = values;
  }
}

export { Row as default };
export { Row };