if(process.env.NODE_ENV === 'production'){
	module.exports = {
		mongoURI: 'mongodb://astrone3:astrone3@ds257485.mlab.com:57485/vidjotprod'
	}
} else {
	module.exports = {
		mongoURI: 'mongodb://localhost/vidjot-dev'
	}
}