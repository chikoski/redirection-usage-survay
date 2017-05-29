import { Component, DOM as dom, createFactory } from "react";

class Item extends Component {
  render() {
    const model = this.props.model;
    return dom.li({},
      dom.span({ className: "id" }, model.id),
      dom.span({ className: "long-url" },
        dom.a({ href: model.longUrl }, model.longUrl)
      ),
      dom.span({ className: "stats" }, "n/a")
    )
  }
}

const li = createFactory(Item);

class History extends Component {
  render() {
    return dom.ul({
      className: "histories"
    },
      dom.li({ className: "header" },
        dom.span({ className: "id" }, "短縮URL"),
        dom.span({ className: "long-url" }, "リンク先"),
        dom.span({ className: "stats" }, "今月の利用者数")
      ),
      this.props.histories.map((item, index) => li({
        key: index,
        model: item
      }))
    )
  }
}

export { History as default };
export { History };