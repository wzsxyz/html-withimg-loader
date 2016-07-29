
var fs = require('fs');
var path = require('path');
var loaderUtils = require("loader-utils");

module.exports = function(fileContent) {

	var query = loaderUtils.parseQuery(this.query);
	fileContent = query.min === false?fileContent:fileContent.replace(/\n/g, '');
	
	if(/module\.exports\s?=/.test(fileContent)) {
		fileContent = fileContent.replace(/module\.exports\s?=\s?/, '');
	}
	else fileContent = JSON.stringify(fileContent);

	if(query.deep !== false) fileContent = loadDeep(fileContent, this.query);
	
	return "module.exports = "+replaceSrc(fileContent, query.exclude);
};


function replaceSrc(fileContent, exclude) {
	fileContent = fileContent.replace(/((\<img[^\<\>]*? src)|(\<link[^\<\>]*? href))=\\?[\"\']?[^\'\"\<\>\+]+?\\?[\'\"][^\<\>]*?\>/ig, function(str){
		var reg = /((src)|(href))=\\?[\'\"][^\"\']+\\?[\'\"]/i;
		var regResult = reg.exec(str);
		if(!regResult) return str;
		var attrName = /\w+=/.exec(regResult[0])[0].replace('=', '');
		var imgUrl = regResult[0].replace(attrName+'=', '').replace(/[\\\'\"]/g, '');
		if(!imgUrl) return str; // 避免空src引起编译失败
		if(/^(http(s?):)?\/\//.test(imgUrl)) return str; // 绝对路径的图片不处理
		if(!/\.(jpg|jpeg|png|gif)/i.test(imgUrl)) return str; // 非静态图片不处理
		if(exclude && imgUrl.indexOf(exclude) != -1) return str; // 不处理被排除的
		if(!(/^[\.\/]/).test(imgUrl)) {
			imgUrl = './' + imgUrl;
		}
		return str.replace(reg, attrName+"=\"+JSON.stringify(require("+JSON.stringify(imgUrl)+"))+\"");
	});
	return fileContent;
}


function loadDeep(fileContent, queryStr) {
	return fileContent.replace(/#include\(\\?[\'\"][^\'\"]+\\?[\'\"]\);?/g, function(str){
		var childFileSrc = str.replace(/[\\\'\"\>\(\);]/g, '').replace('#include', '');
		return "\"+require("+JSON.stringify("html-withimg-loader"+queryStr+"!"+childFileSrc)+")+\"";
	});
}

