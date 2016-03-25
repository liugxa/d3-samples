

function JDCanvas(context, data){
	this.context = context;
	this.data = data;
	
	this.show = function(){
		var cxOffset = 3; var cyOffset = 1;
		
		//get center cell and its position
		var cCell = this.getCenterCell();
		
		//show the item and sub items at firstChild
		//show item
		var item = this.data.item;
		var jdDiagram = new JDDiagram(this.context, cCell, "c", item.type, item.status);
		jdDiagram.show();
		
		//show subitems
		var subItems = this.data.subItems;
		for(var i=0;i<subItems.length;i++){
			var subItem = subItems[i];
			
			//get subitem's position
			var scx = cCell.cx + cxOffset;
			var scy = cCell.cy - cyOffset;
			var sCell = this.getCell(scx, scy + i);
			
			var jdSubDiagram = new JDDiagram(this.context, sCell, "s" + i, subItem.type, subItem.status);
			this.showDiagram(this.context, jdDiagram, jdSubDiagram);
		}
		
		//show the dependency
		var dcx = cCell.cx - cxOffset;
		var dcy = cCell.cy;
		var dCell = this.getCell(dcx, dcy);
		
		var dependency = this.data.dependency;
		var jdDependency = new JDDependency(this.context, dCell, "d", dependency, jdDiagram);
		jdDependency.show();
		
		//show the excel or not
		if(this.context.showExcel == true) this.showExcel();
	}
	
	this.showDiagram = function(context, jdStartDiagram, jdEndDiagram){
		//show line at first
		var sPosition = jdStartDiagram.cell.getCenterPosition();
		var ePosition = jdEndDiagram.cell.getCenterPosition();
		
		var jdLineId = jdStartDiagram.id + "_" + jdEndDiagram.id;
		var jdLine = new JDPathLine(context, sPosition.x, sPosition.y, ePosition.x, ePosition.y, jdLineId);
		jdLine.show();
		
		jdStartDiagram.outLines.push(jdLine);
		jdEndDiagram.inLines.push(jdLine);
		
		//show diagram
		jdEndDiagram.show();
	}
	
	this.showExcel = function(){
		//draw vertical line
		for(var i=0;i<=this.context.xCount;i++){
			var x1 = i * this.context.xUnit;
			var y1 = 0;
			
			var x2 = i * this.context.xUnit;
			var y2 = this.context.H;
			
			var jdDashLine = new JDine(this.context, x1, y1, x2, y2, "dash");
			jdDashLine.show();
		}
		
		//draw horizontal line
		for(var i=0;i<=this.context.yCount;i++){
			var x1 = 0;
			var y1 = i * this.context.yUnit;
			
			var x2 = this.context.W;
			var y2 = i * this.context.yUnit;
			
			var jdDashLine = new JDLine(this.context, x1, y1, x2, y2, "dash");
			jdDashLine.show();
		}
	}
	
	this.getCenterCell = function(){
		var cx = Math.floor(this.context.xCount / 2);
		var cy = Math.floor(this.context.yCount / 3);
		
		var cell = new JDCell(this.context, cx, cy);
		return cell;
	}
	
	this.getCell = function(cx, cy){
		var cell = new JDCell(this.context, cx, cy);
		return cell.getPosition();
	}
}

function JDDependency(context, cell, id, dependency, jdParentDiagram){
	this.context = context;
	this.cell = cell;
	this.id = id;
	this.dependency = dependency;
	this.jdParentDiagram = jdParentDiagram;
	
	this.show = function(){
		this.showDependency(this.context, this.cell, this.id, this.dependency, this.jdParentDiagram);
	}
	
	this.showDependency = function(context, cell, id, dependency, jdParentDiagram){
		var cxOffset = 2; var cyOffset = 1;
		
		var type = dependency.type;
		if(type != null){
			if(type == "and" || type == "or"){
				var andOrId = id + "_" + type;
				var jdAndOrDiagram = new JDDiagram(context, cell, andOrId, dependency);
				this.showDiagram(context, jdAndOrDiagram, jdParentDiagram);
				
				var items = dependency.items;
				if(items != null){
					for(var i=0;i<items.length;i++){
						var icx = cell.cx - cxOffset;
						var icy = cell.cy - cyOffset + i;
						var iCell = this.getCell(icx, icy);
						
						var itemId = andOrId + "_" + i;
						this.showDependency(context, iCell, itemId, items[i], jdAndOrDiagram);
					}
				}
			}else{
				var jdId = id + "_" + "d"
				var jdDiagram = new JDDiagram(context, cell, jdId, dependency);
				this.showDiagram(context, jdDiagram, jdParentDiagram);
			}
		}
	}
	
	this.showDiagram = function(context, jdStartDiagram, jdEndDiagram){
		//show line at first
		var sPosition = jdStartDiagram.cell.getCenterPosition();
		var ePosition = jdEndDiagram.cell.getCenterPosition();
		
		var jdLineId = jdStartDiagram.id + "_" + jdEndDiagram.id;
		var jdLine = new JDLine(context, sPosition.x, sPosition.y, ePosition.x, ePosition.y, jdLineId);
		jdLine.show();	
		
		jdStartDiagram.outLines.push(jdLine);
		jdEndDiagram.inLines.push(jdLine);
		
		//show diagram
		jdStartDiagram.show();
	}
	
	this.getCell = function(cx, cy){
		var cell = new JDCell(this.context, cx, cy);
		return cell.getPosition();
	}	
}
