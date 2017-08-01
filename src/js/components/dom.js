const toA = list => Array.prototype.concat.apply([], list);

function createElement() {
  const args = toA(arguments);
  const name = args.shift();
  const options = args.shift();
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
  if (options.src != null) {
    el.src = src;
  }

  if (children.length > 0) {
    for (const child of children) {
      el.appendChild(child);
    }
  }
  return el;
}

const factory = name => () => {
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