const NOT_MODIFIED = 0;
const CREATED = 1;
const MODIFIED = 2;

class Cachable {
  constructor(flag = NOT_MODIFIED) {
    this.flag = flag;
  }
  get isNotModified() {
    return this.flag == NOT_MODIFIED;
  }
  get isModified() {
    return this.flag == MODIFIED;
  }
  get isCreated() {
    return this.flag & CREATED;
  }
  created() {
    this.flag = CREATED;
    return this;
  }
  modified() {
    this.flag = MODIFIED;
    return this;
  }
  notModified() {
    this.flag = NOT_MODIFIED;
  }
}

export { Cachable as default };
export { Cachable, CREATED, NOT_MODIFIED };