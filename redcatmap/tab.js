var chart = document.getElementById("chart");
var width = chart.offsetWidth;
var height = chart.offsetHeight;
var valueFunc = function(data) { return data.redcat; }
var textFunc = function(data) { return data.district; }
var columns = ["District", "Category"];
drawTable(myData, "#chart", { width: width, height: height }, valueFunc, textFunc, columns);