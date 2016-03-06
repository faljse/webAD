/*
 Software License Agreement (BSD License)
 http://wwwlab.cs.univie.ac.at/~a1100570/webAD/
 Copyright (c), Volodimir Begy
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function UnweightedDirectedGraphView(_model){
	this.model=_model;
	this.scale=1;
}

UnweightedDirectedGraphView.prototype.initStage=function(cont){
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}

function intL(number) {
	if(number!=undefined)
		return number.toString().length;
	else return 0;
}

UnweightedDirectedGraphView.prototype.zoomIn=function(){
  if(this.scale<2.5)this.scale=this.scale+0.1;
  this.draw();
}

UnweightedDirectedGraphView.prototype.zoomOut=function(){
  if(this.scale>0.5)this.scale=this.scale-0.1;
  this.draw();
}

UnweightedDirectedGraphView.prototype.draw=function(){
	
	var _radius=25*this.scale;
	
	var layer = new Kinetic.Layer();
	this.layer=layer;
	var lines=[];
	var circles=[];
	var vals=[];

	var H=undefined;
	var W=undefined;
	var drawn=[];
	
	if(this.model.stack!=undefined){
		var visited="";
		
		for(var i=0;i<this.model.visited.length;i++){
			visited+=this.model.visited[i].index;
			if(i<this.model.visited.length-1)
				visited+=", ";
		}
		
		var stack = new Kinetic.Text({
			x: 10,
			y: 0,
			text: 'Stack:',
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		
		var visited = new Kinetic.Text({
			x: stack.getX()+stack.getWidth()+5*this.scale,
			y: 0,
			text: visited,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		
		layer.add(stack);
		layer.add(visited);
		var scRadius=15*this.scale;
		W=visited.getX()+visited.getWidth()+15*this.scale;
		for(var i=this.model.stack.length-1;i>-1;i--){
			
			var sc = new Kinetic.Circle({
				x: stack.getX()+stack.getWidth()/2,
				y: (stack.getY()+stack.getFontSize()*2)+35*this.scale*i,
				radius:scRadius,
				fill: 'red'
			});
			
			var sct = new Kinetic.Text({
				x: sc.getX()-scRadius,
				y: sc.getY()-scRadius/4,
				text: this.model.stack[this.model.stack.length-1-i].index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:scRadius*2,
				align:'center'
			});
			
			layer.add(sc);
			layer.add(sct);
			lastY=sc.getY();
		}
		
		var sl1 = new Kinetic.Line({
			points: [stack.getX()+stack.getWidth()/2-scRadius-5*this.scale,stack.getY()+stack.getFontSize()+10*this.scale,stack.getX()+stack.getWidth()/2-scRadius-5*this.scale,(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var sl2 = new Kinetic.Line({
			points: [stack.getX()+stack.getWidth()/2+scRadius+5*this.scale,stack.getY()+stack.getFontSize()+10*this.scale,stack.getX()+stack.getWidth()/2+scRadius+5*this.scale,(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var sl3 = new Kinetic.Line({
			points:[stack.getX()+stack.getWidth()/2-scRadius-5*this.scale,(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale,stack.getX()+stack.getWidth()/2+scRadius+5*this.scale,(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		H=(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale+15*this.scale;
		
		layer.add(sl1);
		layer.add(sl2);
		layer.add(sl3);
	}
	
	else if(this.model.queue!=undefined){
		var visited="";
		
		for(var i=0;i<this.model.visited.length;i++){
			visited+=this.model.visited[i].index;
			if(i<this.model.visited.length-1)
				visited+=", ";
		}
		
		var queue = new Kinetic.Text({
			x: 10,
			y: 0,
			text: 'Queue:',
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		
		var visited = new Kinetic.Text({
			x: queue.getX()+queue.getWidth()+5*this.scale,
			y: 0,
			text: visited,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		
		layer.add(queue);
		layer.add(visited);
		var scRadius=15*this.scale;
		W=visited.getX()+visited.getWidth()+15*this.scale;
		for(var i=this.model.queue.length-1;i>-1;i--){
			
			var sc = new Kinetic.Circle({
				x: queue.getX()+queue.getWidth()/2,
				y: (queue.getY()+queue.getFontSize()*2)+35*this.scale*i,
				radius:scRadius,
				fill: 'red'
			});
			
			var sct = new Kinetic.Text({
				x: sc.getX()-scRadius,
				y: sc.getY()-scRadius/4,
				text: this.model.queue[this.model.queue.length-1-i].index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:scRadius*2,
				align:'center'
			});
			
			layer.add(sc);
			layer.add(sct);
			lastY=sc.getY();
		}
		
		var sl1 = new Kinetic.Line({
			points: [queue.getX()+queue.getWidth()/2-scRadius-5*this.scale,queue.getY()+queue.getFontSize()+10*this.scale,queue.getX()+queue.getWidth()/2-scRadius-5*this.scale,(queue.getY()+queue.getFontSize()*2)+(35*this.scale*this.model.queue.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var sl2 = new Kinetic.Line({
			points: [queue.getX()+queue.getWidth()/2+scRadius+5*this.scale,queue.getY()+queue.getFontSize()+10*this.scale,queue.getX()+queue.getWidth()/2+scRadius+5*this.scale,(queue.getY()+queue.getFontSize()*2)+(35*this.scale*this.model.queue.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		H=(queue.getY()+queue.getFontSize()*2)+(35*this.scale*this.model.queue.length-1)-15*this.scale+15*this.scale;
		
		layer.add(sl1);
		layer.add(sl2);
	}
	
	if(this.model.S!=undefined && this.model.S.length>0){
	
		var outerX=0;
		for(var i=0;i<this.model.nodes.length;i++){
			if(this.model.nodes[i].xPosition>outerX)
				outerX=this.model.nodes[i].xPosition;
		}
		
		outerX+=2*_radius;
		
		
		
		var dist = new Kinetic.Rect({
				x: outerX,
				y: 50*this.scale,
				width: 120*this.scale,
				height: 50*this.scale,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 2*this.scale
		});

		
		
		
		var dt = new Kinetic.Text({
			x: dist.getX()+5*this.scale,
			y: dist.getY()+dist.getHeight()/2,
			text: "Distance",
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		
		var processed = new Kinetic.Rect({
			x: outerX,
			y: dist.getY()+dist.getHeight(),
			width: 120*this.scale,
			height: 50*this.scale,
			fill: 'white',
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var pt = new Kinetic.Text({
			x: processed.getX()+5*this.scale,
			y: processed.getY()+processed.getHeight()/2,
			text: "Processed?",
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		
		var previous = new Kinetic.Rect({
			x: outerX,
			y: processed.getY()+processed.getHeight(),
			width: 120*this.scale,
			height: 50*this.scale,
			fill: 'white',
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var prt = new Kinetic.Text({
			x: previous.getX()+5*this.scale,
			y: previous.getY()+previous.getHeight()/2,
			text: "Previous",
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		var lastX=previous.getX()+previous.getWidth();
		
		//nodes list:
		for(var i=0;i<this.model.nodes.length;i++){
			var nodeRect = new Kinetic.Rect({
				x: lastX,
				y: 0,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			var nodeText = new Kinetic.Text({
				x: nodeRect.getX()+5*this.scale,
				y: nodeRect.getY()+nodeRect.getHeight()/2,
				text: this.model.nodes[i].index,
				fontSize: 25*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
			});
			
			var distanceRect = new Kinetic.Rect({
				x: lastX,
				y: 50*this.scale,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			var fSize=25*this.scale;
			
			var dTxt=""+this.model.dist[this.model.nodes[i].index];
			if(dTxt==""+Number.MAX_VALUE)
				dTxt="∞";
			else{
				if(intL(this.model.dist[this.model.nodes[i].index])>3){
					var len=intL(this.model.dist[this.model.nodes[i].index]);
					var diff=len-3;
					fSize=(25-(25/4*diff))*this.scale;
				}
			}
	  	  	
			var distanceText = new Kinetic.Text({
				x: distanceRect.getX()+5*this.scale,
				y: distanceRect.getY()+distanceRect.getHeight()/2,
				text: dTxt,
				fontSize: fSize,
				fontFamily: 'Calibri',
				fill: 'black',
			});
			
			var pfill="lime";
			var procText="No";
			for(var j=0;j<this.model.S.length;j++){
				if(this.model.S[j].index==this.model.nodes[i].index){
					pfill="#00FFFF";procText="Yes";break
				}
			}
			
			var processedRect = new Kinetic.Rect({
				x: lastX,
				y: 100*this.scale,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: pfill,
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			var processedText = new Kinetic.Text({
				x: processedRect.getX()+5*this.scale,
				y: processedRect.getY()+processedRect.getHeight()/2,
				text: procText,
				fontSize: 25*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
			});
			
			var prevRect = new Kinetic.Rect({
				x: lastX,
				y: 150*this.scale,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			var pTxt="-";
			
			if(this.model.prev[this.model.nodes[i].index]!=undefined){
				pTxt=this.model.prev[this.model.nodes[i].index].index;
			}
			
			var prevText = new Kinetic.Text({
				x: prevRect.getX()+5*this.scale,
				y: prevRect.getY()+prevRect.getHeight()/2,
				text: pTxt,
				fontSize: 25*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
			});
			
			lastX=nodeRect.getX()+nodeRect.getWidth();
			layer.add(nodeRect);
			layer.add(nodeText);
			layer.add(distanceRect);
			layer.add(distanceText);
			layer.add(processedRect);
			layer.add(processedText);
			layer.add(prevRect);
			layer.add(prevText);
		}
		
		W=lastX+100*this.scale;
		
		layer.add(dist);
		layer.add(processed);
		layer.add(previous);
		
		layer.add(dt);
		layer.add(pt);
		layer.add(prt);
		
	}
	
	for(var i=0;i<this.model.edges.length;i++){
	
		var exists=false;
		
		var on=undefined;
		var tn=undefined;
		
		for(var j=0;j<drawn.length;j++){
			if(drawn[j]==this.model.edges[i].u){
				exists=true;break;
			}
		}
		
		var xFrom=this.model.edges[i].u.xPosition;
		var yFrom=this.model.edges[i].u.yPosition;
		
		if(!exists){
		
			drawn.push(this.model.edges[i].u);
			
			var circleFrom = new Kinetic.Circle({
				x: xFrom,
				y: yFrom,
				radius:_radius,
				fill: this.model.edges[i].u.color,
				stroke: 'black',
				draggable:true,
				strokeWidth: 2*this.scale
			});
			
			var valFrom = new Kinetic.Text({
				x: circleFrom.getX()-_radius,
				y: circleFrom.getY()-_radius/4,
				text: this.model.edges[i].u.index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:_radius*2,
				draggable:true,
				align:'center'
			});
			
			circleFrom.val=valFrom;
			valFrom.circle=circleFrom;
			
			v=this;	
			
			valFrom.on('dragmove', function() {
				for(var k=0;k<this.circle.lines.length;k++){
					//window.alert("in1");
					var xTo=undefined;
					var xFrom=undefined;
					var yTo=undefined;
					var xFrom=undefined;
					var headlen = 15;
					if(this.circle.lines[k].on==this.circle){
						xFrom=parseInt(this.circle.getX());
						yFrom=parseInt(this.circle.getY());
						xTo=parseInt(this.circle.lines[k].tn.getX());
						yTo=parseInt(this.circle.lines[k].tn.getY());
						
					    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
					}
					else if(this.circle.lines[k].tn==this.circle){
						xTo=parseInt(this.circle.getX());
						yTo=parseInt(this.circle.getY());
						xFrom=parseInt(this.circle.lines[k].on.getX());
						yFrom=parseInt(this.circle.lines[k].on.getY());
						
						var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
					}
					
					var xDiff=xTo-xFrom;
					if(Math.abs(xDiff)>_radius){
					    if(xDiff>0){xDiff=_radius;}
					    else{xDiff=-_radius;}
					 }
					 
					 xTo=xTo-xDiff;
					 
					 var yDiff=yTo-yFrom;
					 if(Math.abs(yDiff)>_radius){
					    if(yDiff>0){yDiff=_radius;}
					    else{yDiff=-_radius;}
					 }
					 
					 yTo=yTo-yDiff;
					 //[34]
					 this.circle.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]); 
				}
				
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].xPosition=parseInt(this.circle.getX());
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].yPosition=parseInt(this.circle.getY());
				
				this.circle.setX(parseInt(this.getX())+_radius);
				this.circle.setY(parseInt(this.getY())+_radius/4);
		    });
			
			circles.push(circleFrom);
			vals.push(valFrom);
			
			on=circleFrom;
		}
		else{
			for(var j=0;j<circles.length;j++){
				if(circles[j].val.getText()==this.model.edges[i].u.index){
					on=circles[j];break;
				}
			}
		}
		
		exists=false;
			
		for(var j=0;j<drawn.length;j++){
			if(drawn[j]==this.model.edges[i].v){
				exists=true;break;
			}
		}
			
		var xTo=this.model.edges[i].v.xPosition;
		var yTo=this.model.edges[i].v.yPosition;
			
		if(!exists){
			
			drawn.push(this.model.edges[i].v);
				
			var circleTo = new Kinetic.Circle({
				x: xTo,
				y: yTo,
				radius:_radius,
				fill: this.model.edges[i].v.color,
				stroke: 'black',
				draggable:true,
				strokeWidth: 2*this.scale
			});
				
			var valTo = new Kinetic.Text({
				x: circleTo.getX()-_radius,
				y: circleTo.getY()-_radius/4,
				text: this.model.edges[i].v.index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:_radius*2,
				draggable:true,
				align:'center'
			});	
			
			circleTo.val=valTo;
			valTo.circle=circleTo;
			
			v=this;	
			
			valTo.on('dragmove', function() {
				for(var k=0;k<this.circle.lines.length;k++){
					//window.alert("in1");
					var xTo=undefined;
					var xFrom=undefined;
					var yTo=undefined;
					var xFrom=undefined;
					var headlen = 15;
					if(this.circle.lines[k].on==this.circle){
						xFrom=parseInt(this.circle.getX());
						yFrom=parseInt(this.circle.getY());
						xTo=parseInt(this.circle.lines[k].tn.getX());
						yTo=parseInt(this.circle.lines[k].tn.getY());
						
					    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
					}
					else if(this.circle.lines[k].tn==this.circle){
						xTo=parseInt(this.circle.getX());
						yTo=parseInt(this.circle.getY());
						xFrom=parseInt(this.circle.lines[k].on.getX());
						yFrom=parseInt(this.circle.lines[k].on.getY());
						
						var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
					}
					
					var xDiff=xTo-xFrom;
					if(Math.abs(xDiff)>_radius){
					    if(xDiff>0){xDiff=_radius;}
					    else{xDiff=-_radius;}
					 }
					 
					 xTo=xTo-xDiff;
					 
					 var yDiff=yTo-yFrom;
					 if(Math.abs(yDiff)>_radius){
					    if(yDiff>0){yDiff=_radius;}
					    else{yDiff=-_radius;}
					 }
					 
					 yTo=yTo-yDiff;
					 //[34]
					 this.circle.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]); 
				}
				
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].xPosition=parseInt(this.circle.getX());
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].yPosition=parseInt(this.circle.getY());

				this.circle.setX(parseInt(this.getX())+_radius);
				this.circle.setY(parseInt(this.getY())+_radius/4);
		    });
			
			circles.push(circleTo);
			vals.push(valTo);
			
			tn=circleTo;
		}
		
		else{
			for(var j=0;j<circles.length;j++){
				if(circles[j].val.getText()==this.model.edges[i].v.index){
					tn=circles[j];break;
				}
			}
		}
		
		var headlen = 15;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.
	    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);

	    var xDiff=tn.getX()-xFrom;
	    if(Math.abs(xDiff)>_radius){
	    	if(xDiff>0)xDiff=_radius;
	    	else xDiff=-_radius;
	    }
	    
	    xTo=xTo-xDiff;
	    
	    var yDiff=tn.getY()-yFrom;
	    if(Math.abs(yDiff)>_radius){
	    	if(yDiff>0)yDiff=_radius;
	    	else yDiff=-_radius;
	    }
	    
	    yTo=yTo-yDiff;
	    var col=this.model.edges[i].color;
		var _stroke=0;
		if(col=="#6699FF")
			_stroke=1*this.scale;
		else if(col=="black")
			_stroke=2*this.scale;
		else
			_stroke=5*this.scale;
	    
	    var line = new Kinetic.Line({
	    	//[34]
	        points: [xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)],
	        stroke: this.model.edges[i].color,
			strokeWidth: _stroke,
			shapeType: "line",
			lineCap: 'round',
			lineJoin: 'round'
	    });

		
		line.on=on;
		line.tn=tn;
		
		lines.push(line);
		
		var wX=undefined
		var wY=undefined;
		
		if(xTo>xFrom)
			var wX=xTo+10;
		else
			var wX=xTo-25;
		
		if(yTo>yFrom)
			var wY=yTo-30;
		else
			var wY=yTo+10;
		
		if(yDiff>0)
			 wY=yTo-30;
		 else
			 wY=yTo+10;
		
		if(xDiff>0)
			 wX=xTo-25;
		 else
			 wX=xTo+10;
  	  	
		var fSize=25*this.scale;
		
		if(on.connectedTo==undefined){
			on.connectedTo=[];
			on.lines=[];
		}
		
		on.connectedTo.push(tn);
		on.lines.push(line);
		
		if(tn.connectedTo==undefined){
			tn.connectedTo=[];
			tn.lines=[];
			tn.connectedTo.push(on);
			tn.lines.push(line);
		}
		
		else{
			var alreadyConnected;
			for(var j=0;j<tn.lines;j++){
				if(tn.lines[j].tn==on){
					alreadyConnected=true;
				}
			}
			if(!alreadyConnected){
				tn.connectedTo.push(on);
				tn.lines.push(line);
			}
		}
		
		v=this;	
		
		on.on('dragmove', function() {
			for(var k=0;k<this.lines.length;k++){
				//window.alert("in1");
				var xTo=undefined;
				var xFrom=undefined;
				var yTo=undefined;
				var xFrom=undefined;
				var headlen = 15;
				if(this.lines[k].on==this){
					xFrom=this.getX();
					yFrom=this.getY();
					xTo=this.lines[k].tn.getX();
					yTo=this.lines[k].tn.getY();
					
				    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
				}
				else if(this.lines[k].tn==this){
					xTo=this.getX();
					yTo=this.getY();
					xFrom=this.lines[k].on.getX();
					yFrom=this.lines[k].on.getY();
					
					var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
				}
				
				var xDiff=xTo-xFrom;
				if(Math.abs(xDiff)>_radius){
				    if(xDiff>0){xDiff=_radius;}
				    else{xDiff=-_radius;}
				 }
				 
				 xTo=xTo-xDiff;
				 
				 var yDiff=yTo-yFrom;
				 if(Math.abs(yDiff)>_radius){
				    if(yDiff>0){yDiff=_radius;}
				    else{yDiff=-_radius;}
				 }
				 
				 yTo=yTo-yDiff;
				 //[34]
				 this.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]); 
			}
			
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].xPosition=parseInt(this.getX());
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].yPosition=parseInt(this.getY());
			
			this.val.setX(parseInt(this.getX())-_radius);
			this.val.setY(this.getY()-_radius/4);
	    });
		
		tn.on('dragmove', function() {
			for(var k=0;k<this.lines.length;k++){
				//window.alert("in1");
				var xTo=undefined;
				var xFrom=undefined;
				var yTo=undefined;
				var xFrom=undefined;
				var headlen = 15;
				if(this.lines[k].on==this){
					xFrom=this.getX();
					yFrom=this.getY();
					xTo=this.lines[k].tn.getX();
					yTo=this.lines[k].tn.getY();
					
				    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
				}
				else if(this.lines[k].tn==this){
					xTo=this.getX();
					yTo=this.getY();
					xFrom=this.lines[k].on.getX();
					yFrom=this.lines[k].on.getY();
					
					var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
				}
				
				var xDiff=xTo-xFrom;
				if(Math.abs(xDiff)>_radius){
				    if(xDiff>0){xDiff=_radius;}
				    else{xDiff=-_radius;}
				 }
				 
				 xTo=xTo-xDiff;
				 
				 var yDiff=yTo-yFrom;
				 if(Math.abs(yDiff)>_radius){
				    if(yDiff>0){yDiff=_radius;}
				    else{yDiff=-_radius;}
				 }
				 
				 yTo=yTo-yDiff;
				 //[34]
				 this.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]);
			}
			
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].xPosition=parseInt(this.getX());
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].yPosition=parseInt(this.getY());
			
			this.val.setX(parseInt(this.getX())-_radius);
			this.val.setY(this.getY()-_radius/4);
	    });
	}
	
	if(this.model.nodes.length==1){
		var v=this;
		
		var circleFrom = new Kinetic.Circle({
			x: this.model.nodes[0].xPosition,
			y: this.model.nodes[0].yPosition,
			radius:_radius,
			fill: this.model.nodes[0].color,
			stroke: 'black',
			draggable:true,
			strokeWidth: 2*this.scale
		});
		
		var valFrom = new Kinetic.Text({
			x: circleFrom.getX()-_radius,
			y: circleFrom.getY()-_radius/4,
			text: this.model.nodes[0].index,
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
			width:_radius*2,
			draggable:true,
			align:'center'
		});
		
		circleFrom.val=valFrom;
		valFrom.circle=circleFrom;
		
		
		valFrom.on('dragmove', function() {
			this.circle.setX(parseInt(this.getX())+_radius);
			this.circle.setY(parseInt(this.getY())+_radius/4);
	    });
		
		valFrom.on('mouseover', function() {
			this.circle.setFill("orange");
			var ai=parseInt(this.getText());
			v.model.nodes[v.model.matrixLink[ai]].color="orange";
			layer.draw();
	    });
		
		valFrom.on('mouseout', function() {
			var ai=parseInt(this.getText());
			this.circle.setFill(v.model.nodes[v.model.matrixLink[ai]].oColor);
			v.model.nodes[v.model.matrixLink[ai]].color=v.model.nodes[v.model.matrixLink[ai]].oColor;
			layer.draw();
	    });
		
		circleFrom.on('dragmove', function() {
			v.model.nodes[0].xPosition=parseInt(this.getX());
			v.model.nodes[0].yPosition=parseInt(this.getY());
			
			this.val.setX(parseInt(this.getX())-_radius);
			this.val.setY(this.getY()-_radius/4);
	    });
		
		circleFrom.on('mouseover', function() {
			this.setFill("orange");
			var ai=parseInt(this.val.getText());
			v.model.nodes[v.model.matrixLink[ai]].color="orange";
			layer.draw();
	    });
		
		circleFrom.on('mouseout', function() {
			var ai=parseInt(this.val.getText());
			this.setFill(v.model.nodes[v.model.matrixLink[ai]].oColor);
			v.model.nodes[v.model.matrixLink[ai]].color=v.model.nodes[v.model.matrixLink[ai]].oColor;
			layer.draw();			
	    });
		
		circles.push(circleFrom);
		vals.push(valFrom);
	}

	for(var i=0;i<lines.length;i++){
		layer.add(lines[i]);
	}
	
	for(var i=0;i<circles.length;i++){
		layer.add(circles[i]);
		layer.add(vals[i]);
	}
	
	var w=(25+150*this.model.gridSize)*this.scale;
	var h=(25+150*this.model.gridSize)*this.scale;
	
	if(w<1000)w=1000;
	if(h<500)h=500
	
	if(H>h)h=H;
	if(W>w)w=W;
	
	this.stage.setHeight(h);
	this.stage.setWidth(w);
	this.stage.removeChildren();
	this.stage.add(layer);
						  
}