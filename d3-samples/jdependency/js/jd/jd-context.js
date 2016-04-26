var svg = rave;

function JDContext(container, urlContext, showExcel, i18n){
	this.container = svg.select(container);
	this.urlContext = urlContext;
	
	this.width = this.container.style("width");
	this.height = this.container.style("height");

	this._w = parseInt(this.width);
	this._h = parseInt(this.height);
	
	//the diagram's width & height
	this.TEXT_WIDTH = 16;
	this.TEXT_HEIGHT = 16;
	
	this.IMAGE_WIDTH = 32;
	this.IMAGE_HEIGHT = 32;

	this.IMAGE_XOFFSET = 3; 
	this.IMAGE_YOFFSET = 3;
	
	this.xOffset = this.IMAGE_WIDTH / 2;
	this.yOffset = this.TEXT_HEIGHT + this.IMAGE_HEIGHT / 2;
	
	this.xUnit = this.IMAGE_WIDTH;
	this.yUnit = this.TEXT_HEIGHT + this.IMAGE_HEIGHT;
	
	this.w = this._w - this.xUnit;
	this.h = this._h - this.yUnit;
	
	this.xCount = Math.floor(this.w / this.xUnit);
	this.yCount = Math.floor(this.h / this.yUnit);

	this.center = {};
	this.center.x = this.w * 0.6;
	this.center.y = this.h / 3;
	
	//the parent item's location between the start position to theend
	//2 - the point(100 / 2) of the length
	//3 - the point (100/3) of the length
	this.P_LOCATION_POINT = 3;
	
	//the parent item's location between the start position to theend
	this.C_LOCATION_POINT = 2;
	
	//show the excel background
	this.showExcel = false;
	if(showExcel && showExcel == true) this.showExcel = true;
	
	/* i18n messages */	
	this.i18n = (i18n != null) ? i18n: new JDI18n();

	this.svg = this.container.append("svg");
	this.svg.attr("width", this._w);
	this.svg.attr("height", this._h);
	
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
	
	//create path group
	this.pg = this.svg.append("g");
	this.pg.attr("id", "pg");
	
	//create diagram group
	this.dg = this.svg.append("g");
	this.dg.attr("id", "dg");
	
	//create background group
	this.bg = this.svg.append("g");
	this.bg.attr("id", "bg");
}

function JDPosition(context, x, y){
	this.context = context;
	this.x = x;
	this.y = y;
	
	this.line = {};
	this.line.x = this.x + this.context.xOffset;
	this.line.y = this.y + this.context.yOffset;
	
	this.image = {};
	this.image.x = this.x + this.context.xOffset - this.context.IMAGE_WIDTH / 2;
	this.image.y = this.y + this.context.yOffset - this.context.IMAGE_HEIGHT / 2;

	this.text = {};
	this.text.x = this.image.x;
	this.text.y = this.image.y;
	
	this.x0 = this.x + this.context.xOffset - this.context.xUnit / 2;
	this.y0 = this.y + this.context.yOffset - (this.context.yUnit - this.context.IMAGE_HEIGHT / 2);
}