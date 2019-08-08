# html-reactifier

[![Build Status](https://travis-ci.org/jsg2021/html-reactifier.svg?branch=master)](https://travis-ci.org/jsg2021/html-reactifier)

This allows you to have arbitrary markup AROUND your React component(s).


# pseudo code example usage:

```es6
import React from 'react';
import getRenderer from 'html-reactifier';

class RenderContent extends React.component {
	constructor (props) {
		super(props);

		const {template} = props;

		const widgets = this.widgets = {};
		let id = 0;

		//Process the string of html that resembles: <div>{ item.foo }</div>
		template = template.split(/({[^}]+})/).map(v => {
			if(v.startsWith('{') && v.endsWith('}')) {
				//do something with the value...
				widgets[id++] = v; //eg: "{ item.foo }"
				return `<widget id="${id}"/>` //xml placeholder
			}
			return v;
		});

		//can be any criteria... this is just an example...
		const identifyTemplateWidget = tag => tag === 'widget';

		this.state = {
			renderer: getRenderer(template.join(''), identifyTemplateWidget)
		};
	}


	render () {
		const {renderer} = this.state;
		return renderer ? renderer(React, (...args) => this.renderTemplateWidget(...args)) : (
			<div>Processing...</div>
		);
	}


	renderTemplateWidget (tagName, props, children) {
		//this is where you can render what ever you want for the "widget"
		//props will have the id... map it to this.widgets, or index of prop.children, or whatever.
	}
}
```
