import getRenderer from '../index';

describe('html-reactifier tests', () => {

	it('Basic: Ensure Export', () => {
		expect(getRenderer).toBeTruthy();
		expect(typeof getRenderer).toBe('function');
	});

	it('Basic: Ensure Returns function', () => {
		const f = getRenderer('<div>test</div>');
		expect(f).toBeTruthy();
		expect(typeof f).toBe('function');
	});

	it('Basic: Ensure returned render function calls React.createElement', () => {
		const f = getRenderer('<div>test</div>');
		const React = {createElement () { return [...arguments]; }};

		spyOn(React, 'createElement').and.callThrough();

		const result = f(React);

		expect(React.createElement).toHaveBeenCalledWith('div', {}, 'test');
		expect(React.createElement).toHaveBeenCalledWith('div', {}, ['div', {}, 'test']);

		//Typically this should be the return value of React.createElement... our test just verifies that it was called.
		expect(result).toEqual(['div', {}, ['div', {}, 'test']]);
	});

	it('Handles html entities in attributes', () => {
		const f = getRenderer('A<br><br><p>B</p><br> <br><p>C</p><p></p><p><span style="font-size: 11.0pt; font-family: &quot;Calibri&quot;,&quot;sans-serif&quot;;">D</span>   </p><br><br>E<br><br>F<br><br>G');
		const React = {createElement () { return [...arguments]; }};

		spyOn(React, 'createElement').and.callThrough();

		const result = f(React);

		const args = ['div', {},
			'A',
			['br', {}, undefined],
			['br', {}, undefined],
			['p', {}, 'B'],
			['br', {}, undefined],
			' ',
			['br', {}, undefined],
			['p', {}, 'C'],
			['p', {}, undefined],
			['p', {}, ['span', {}, 'D'], '   '],
			['br', {}, undefined],
			['br', {}, undefined],
			'E',
			['br', {}, undefined],
			['br', {}, undefined],
			'F',
			['br', {}, undefined],
			['br', {}, undefined],
			'G'
		];

		expect(React.createElement).toHaveBeenCalledWith(...args);

		//Typically this should be the return value of React.createElement... our test just verifies that it was called.
		expect(result).toEqual(args);
	});


	it('Identify Widgets/Components/Template-parts', () => {
		const self = {
			isWidget () {}
		};

		spyOn(self, 'isWidget');

		getRenderer('<div>test<w foo="bar"/></div>', self.isWidget);

		expect(self.isWidget).toHaveBeenCalledWith('w', {foo: 'bar'}, expect.any(Object));
	});
});
