---
to: src/components/<%= name %>.tsx
---
<% const compName = h.inflection.undasherize(name) -%>
import { Component } from 'solid-js';

const <%= compName %>: Component<{}> = function (props) {
  return (
    <div></div>
  );
};

export default <%= compName %>;
