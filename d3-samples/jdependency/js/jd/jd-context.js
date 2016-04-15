var svg = rave;

function JDContext(container, urlContext, showExcel, i18n){
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
	this.showExcel = false;
	if(showExcel && showExcel == true) this.showExcel = true;
	
	/* i18n messages */	
	this.i18n = (i18n != null) ? i18n: new JDI18n();
	
	//the diagram's width & height
	this.TEXT_WIDTH = 16;
	this.TEXT_HEIGHT = 16;
	
	this.IMAGE_WIDTH = 32;
	this.IMAGE_HEIGHT = 32;
	
	this.xUnit = this.IMAGE_WIDTH;
	this.yUnit = this.TEXT_HEIGHT + this.IMAGE_HEIGHT;

	this.xCount = Math.floor(this.w / this.xUnit);
	this.yCount = Math.floor(this.h / this.yUnit);
	
	this.center = {};
	this.center.x = Math.floor(this.xCount / 2) * this.xUnit;
	this.center.y = Math.floor(this.yCount / 2) * this.yUnit;
	
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
	
	this.matrix = new JDMatrix(this);
}

function JDPosition(context, x, y){
	this.context = context;
	this.x = x;
	this.y = y;
	
	this.center = {};
	this.center.x = this.x + this.context.xUnit / 2;
	this.center.y = (this.y + this.context.TEXT_HEIGHT ) + this.context.IMAGE_HEIGHT / 2;
	
	this.text = {};
	this.text.x = this.x;
	this.text.y = this.y + this.context.TEXT_HEIGHT / 2 + this.context.TEXT_HEIGHT / 3;
	
	this.image = {};
	this.image.x = this.x;
	this.image.y = this.y + this.context.TEXT_HEIGHT;
	
	this.equals = function(position){
		var r = false;
		if(position.x == this.x && position.y == this.y) r = true;
		return r;
	}
}

function JDRecord(){
	this.position;
	this.items = [];
}

function JDMatrix(context){
	this.context = context;
	this.records = [];
	
	this.add = function(position, item){
		var record = null;
		for(var i=0;i<this.records.length;i++){
			var r = this.records[i];
			var rItems = r.items;
			for(var j=0;j<rItems.length;j++){
				var rItem = rItems[j];
				if(rItem != null && rItem.position.x == position.x){
					record = r;
					break;
				}
			}
		}
		
		if(record != null){
			record.items.push(item);
		}else{
			record = new JDRecord();
			record.position = position;
			record.items.push(item);
			this.records.push(record);
		}
	}
	
	this.sort = function(){
		//re-setting the position of the item base on the size of canvas
		//but, the principle is to let the diagram visible!
		//so, if there has not enought cells to fit for these items, resize the canvas!
		//the other solution is to resize the diagram's width/height, but is lower.
		//console.log(this.context.yCount + "|" + this.items.length);
		for(var i=0;i<this.records.length;i++){
			var record = this.records[i];
			var rPosition = record.position;
			var rItems = record.items;
			
			var step = (this.context.yCount * this.context.yUnit) / rItems.length;
			for(var j=0;j<rItems.length;j++){
				//the cx not be change, only focus on the cy
				var y = step * j;
				var position = new JDPosition(this.context, rPosition.x, y);
				rItems[j].move(position);
			}
		}
	}
}
