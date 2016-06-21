
var fs = require('fs');
var path = require('path');
var loaderUtils = require("loader-utils");

module.exports = function(fileContent) {
	var query = loaderUtils.parseQuery(this.query);
	if(query.deep !== false) fileContent = loadDeep(fileContent, this.context, this.query);
	return "module.exports = '"+replaceSrc(fileContent, query.min)+"'";
};


function replaceSrc(fileContent, min) {
	fileContent = min === false?fileContent.replace(/\n/g, '\\n'):fileContent.replace(/\n/g, '');
	fileContent = fileContent.replace(/\<img[^\<\>]+?src=[\"\']?\.?\.?\/[^\'\"\<\>]+?[\'\"][^\<\>]*?\>/g, function(str){
		var reg = /src=[\'\"][^\"\']+[\'\"]/i;
		var regResult = reg.exec(str);
		var imgUrl = regResult[0].replace('src=', '').replace(/\\|\'|\"/g, '');
		return str.replace(reg, "src=\"\'+require(\""+imgUrl+"\")+\'\"");
	});
	return fileContent;
}

function loadDeep(fileContent, context, queryStr) {
	return fileContent.replace(/#include\(['"][^'"]+['"]\);?/g, function(str){
		var childFileSrc = str.replace(/[\'\"\>\(\);]/g, '').replace('#include', '');
		return "\'+require(\"html-withimg-loader"+queryStr+"!"+childFileSrc+"\")+\'";
	});
}

