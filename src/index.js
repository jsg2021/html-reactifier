const ATTR_NAME = {
	'class': 'className'
};

const getAName = n => ATTR_NAME[n.name] || n.name;
const attributes = (domNode) => Array.from(domNode.attributes || {}).reduce((_, a) => (_[getAName(a)] = a.value, _), {});
const getLiteral = (str) =>
	(typeof str !== 'string')
		? (str == null ? '' : String(str))
		: (
			(str = str
				.replace(/"/g, '\\"') //escape double quotes
				.replace(/\n/g, '\\n')//escape new lines
				.replace(/\r/g, '\\r')//escape carage returns
			),
			`"${str}"`
		);


function reactifyElement (element, props, children, customFunc) {

	delete props.style; // TODO: convert styles to react
	props = JSON.stringify(props);

	children = (children == null) ? [] : (Array.isArray(children) ? children : [children]);

	children = children.length > 0 ? children.join(',') : 'undefined';

	const renderer = customFunc || 'React.createElement';

	return `${renderer}(${element}, ${props}, ${children})`;
}



function processNode (n, isWidget) {
	if (n.nodeType === 3) {
		return getLiteral(n.nodeValue);
	}

	const tag = n.tagName.toLowerCase();
	const attrs = attributes(n);

	const renderFunction = (isWidget && isWidget(tag, attrs, n)) ? 'renderWidget' : void 0;

	return reactifyElement(
		getLiteral(tag),
		attrs,
		processChildren(n, isWidget),
		renderFunction
	);
}



function processChildren (n, isWidget) {
	return Array.from(n.childNodes).map(x => processNode(x, isWidget));
}



export default function (html, isWidgetCallback) {
	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		const [body] = doc.getElementsByTagName('body');

		const children = processChildren(body, isWidgetCallback);

		const out = 'return ' + reactifyElement('"div"', {}, children);
		//Not evil in this case. Building a Template function.
		return new Function(// eslint-disable-line no-new-func
			'React, renderWidget', //arguments
			'renderWidget = renderWidget || React.createElement.bind(React);' + out // function body
			);
	}
	catch (e) {
		throw new Error(`There was an error processing HTML into a React render Function: ${e.stack || e.message || e}`);
	}
}
