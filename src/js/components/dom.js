const toA = list => Array.prototype.concat.apply([], list);

function createElement() {
  const args = toA(arguments);
  const name = args.shift();
  const options = args.shift() || {};
  const children = args;

  if (name == null) {
    return null;
  }
  const el = document.createElement(name);
  if ((options.className || {}).length > 0) {
    for (const klass of options.className) {
      el.classList.add(klass);
    }
  }
  if (options.href != null) {
    el.href = options.href;
  }

  if (children.length > 0) {
    for (let child of children) {
      if (typeof child === "string") {
        child = document.createTextNode(child);
      }
      el.appendChild(child);
    }
  }
  return el;
}

const factory = name => function () {
  const args = toA(arguments);
  args.unshift(name);
  return createElement.apply(null, args)
};

const tr = factory("tr");
const td = factory("td");
const a = factory("a");

const dom = {
  tr: tr,
  td: td,
  a: a,
  createElement: createElement
};

export { dom as default };
export { tr, td, a, createElement };  