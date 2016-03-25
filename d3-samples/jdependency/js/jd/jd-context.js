var svg = rave;

function JDContext(container, urlContext, showExcel=false){
	this.container = svg.select(container);
	this.urlContext = urlContext;
	
	this.width = this.container.style("width");
	this.height = this.container.style("height");
	
	this.w = parseInt(this.width);
	this.h = parseInt(this.height);
	
	this.svg = this.container.append("svg");
	this.svg.attr("width", this.w);
	this.svg.attr("height", this.h);
	
	//show the excel background
	this.showExcel = showExcel;

	//the diagram's width & height
	this.TEXT_WIDTH = 16;
	this.TEXT_HEIGHT = 16;
	
	this.IMAGE_WIDTH = 32;
	this.IMAGE_HEIGHT = 32;
	
	this.xUnit = this.IMAGE_WIDTH;
	this.yUnit = this.TEXT_HEIGHT + this.IMAGE_HEIGHT;

	this.xCount = Math.floor(this.w / this.xUnit);
	this.yCount = Math.floor(this.h / this.yUnit);
	
	this.W = this.xUnit * this.xCount;
	this.H = this.yUnit * this.yCount;

	//create the maker
	var defs = this.svg.append("defs");
	var marker = defs.append("marker")
		.attr("id","arrow")
		.attr("markerUnits","strokeWidth")
		.attr("markerWidth","12")
		.attr("markerHeight","12")
		.attr("viewBox","0 0 12 12")
		.attr("refX","6")
		.attr("refY","6")
		.attr("orient","auto");
	var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";	
	marker.append("path").attr("d", arrow_path).attr("fill", "#000000;");
}

function JDPosition(context, cx, cy){
	this.context = context;
	this.cx = cx;
	this.cy = cy;
	this.x = cx * context.xUnit;
	this.y = cy * context.yUnit;
	
	this.getCenterPosition = function(){
		var x = this.x + this.context.xUnit / 2;
		var y = (this.y + this.context.TEXT_HEIGHT ) + this.context.IMAGE_HEIGHT / 2;	
		return {x: x, y: y};
	}
}