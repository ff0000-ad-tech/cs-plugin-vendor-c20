const fs = require('fs-extra')
const path = require('path')

const debug = require('debug')
var log = debug('cs-plugin-vendor-c20:packager')

/*
MONET:
- container_source > 
	- 1-build
		- size, package.json, package-lock.json, common/
	- package.json, 
	- package-lock.json, 
	- webpack.config.js, 
	- plugins.json, 
	- .eslintrc 
- traffic_source >
	3-traffic (size) <- 300x250, 
*/

function createVendorPackage(profileName, targets) {
	log('createVendorPackage()')
	const fileWhiteList = ['.eslintrc', 'package.json', 'package-lock.json', 'plugins.json', 'webpack.config.js', '1-build/package.json', '1-build/package-lock.json']

	return new Promise((resolve, reject) => {
		const dir = './4-vendor/' + profileName + '/'
		fs.emptyDirSync(dir)
	
		Object.keys(targets).forEach(target => {		
			const filePath = '.' + targets[target]
			const filePathSplit = filePath.split(path.sep)
			filePathSplit.pop()
			const folderName = filePathSplit.pop()

			let promises = []
			log(folderName, target, '|', filePath)

			// Folders first
			const dirSize = dir + folderName
			fs.emptyDirSync(dirSize)

			const dirContainer = dirSize + '/container_source/1-build/'
			fs.emptyDirSync(dirContainer)
			
			// copy 1-build to traffic_source
			promises.push(
				fs.copy(filePath, dirSize + '/traffic_source/')
					.then(() => log(folderName, 'traffic_source success'))
			)
				
			for (let key of fileWhiteList) {
				promises.push(
					fs.copy('./' + key, dirSize + '/container_source/' + key)
						.then(() => log(folderName, ' - file:', key, 'success'))
				)
			}
			
			promises.push(
				fs.copy('./1-build/' + folderName, dirContainer + '/' + folderName)
					.then(() => log(folderName, ' - folder: 1-build/' + folderName + ' success'))
			)
					
			// check if there is a common/ folder in the 1-build/
			const dirCommon = './1-build/common/' 
			const hasCommon = fs.pathExistsSync(dirCommon)
			if (hasCommon) {
				promises.push(
					fs.copy(dirCommon, dirContainer + '/common/')
						.then(() => log(folderName, ' - folder: 1-build/common/ success'))
				)
			}

			Promise.all(promises)
				.then(() => {
					log(folderName, 'ALL DONE!')
					
				})
				.catch(err => console.error(err))
		})
	})	
}

module.exports = {
	createVendorPackage
}
