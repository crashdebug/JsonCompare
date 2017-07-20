const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

var mimeTypes = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css'
}

const server = http.createServer((req, res) => {
	var uri = url.parse(req.url).pathname;
	var filename = path.join(process.cwd(), uri);
	fs.exists(filename, exists => {
		if (!exists) {
			res.statusCode = 200;
			res.end();
		} else {
			if (fs.statSync(filename).isDirectory()) {
				filename += 'index.html';
			}
			var ext = path.extname(filename);
			var mimeType = mimeTypes[ext] || 'application/octet-stream';
			res.statusCode = 200;
			res.setHeader('Content-Type', mimeType);

			var fileStream = fs.createReadStream(filename);
			fileStream.pipe(res);
		}
	});
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
