const argv = require('minimist')(process.argv.slice(2))
const packager = require('./lib/packager.js')

const debug = require('debug')
var log = debug('cs-plugin-vendor-indexes')

global.api = `http://${argv.api}`

switch (argv.cmd) {
	case 'index+backups':
		log(argv.profile)
		const targets = JSON.parse(argv.targets)
		log(targets)
		packager.createVendorPackage(argv.profile, targets)
		break
}

/*

node index.js --cmd packager --api '10.0.7.126:5200' --profile 'off_channel' --targets '{"off_channel/300x250__generic/index.html":"/3-traffic/off_channel/300x250__generic/","off_channel/320x50__players/index.html":"/3-traffic/off_channel/320x50__players/","off_channel/728x90__team_away/index.html":"/3-traffic/off_channel/728x90__team_away/"}'

*/
