'strict mode';

module.exports = function (api) {
	if (api && api.cache) {
		api.cache(() => process.env.NODE_ENV);
	}

	return {
		sourceType: 'unambiguous',
		compact: false,
		"presets": [
			['@babel/preset-env', {
				useBuiltIns: false,
				shippedProposals: true,
				targets: {
					browsers: [
						"last 2 versions",
						"not dead"
					]
				}
			}]
		],
		"sourceMaps": "both"
	};
}
