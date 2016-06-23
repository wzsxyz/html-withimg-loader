
var fs = require('fs');
var path = require('path');
var loaderUtils = require("loader-utils");

module.exports = function(fileContent) {
	var query = loaderUtils.parseQuery(this.query);
	fileContent = query.min === false?fileContent.replace(/\n/g, '\\n'):fileContent.replace(/\n/g, '');
	fileContent = JSON.stringify(fileContent);
	if(query.deep !== false) fileContent = loadDeep(fileContent, this.query);
	return "module.exports = "+replaceSrc(fileContent);
};


function replaceSrc(fileContent) {
	fileContent = fileContent.replace(/\<img[^\<\>]+?src=\\?[\"\']?(\.?\.?\/)?[^\'\"\<\>]+?\\?[\'\"][^\<\>]*?\>/g, function(str){
		var reg = /src=\\?[\'\"][^\"\']+\\?[\'\"]/i;
		var regResult = reg.exec(str);
		var imgUrl = regResult[0].replace('src=', '').replace(/[\\\'\"]/g, '');
		if(!(/^[\.\/]/).test(imgUrl)) {
			imgUrl = './' + imgUrl;
		}
		return str.replace(reg, "src=\"+require("+JSON.stringify(imgUrl)+")+\"");
	});
	return fileContent;
}

function loadDeep(fileContent, queryStr) {
	return fileContent.replace(/#include\(\\?[\'\"][^\'\"]+\\?[\'\"]\);?/g, function(str){
		var childFileSrc = str.replace(/[\\\'\"\>\(\);]/g, '').replace('#include', '');
		return "\"+require("+JSON.stringify("html-withimg-loader"+queryStr+"!"+childFileSrc)+")+\"";
	});
}

