var path = require('path');

module.exports = {
	entry : './src/root.js',
	output : {
		filename : 'bundle.js',
		//path : './'
	},
	module : {
		loaders : [
		{
			loader : 'babel-loader',
			exclude : /node_modules/,
			query : {
				presets : ['env','react']
			}
		},
		{
			test : /\.css$/,
			loader : 'style-loader!css-loader'
		}
		]
	},
}
