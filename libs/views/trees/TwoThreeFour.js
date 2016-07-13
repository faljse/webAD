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

function TwoThreeFourView(_model){
	this.model=_model;
	this.model.order=2;
	this.scale=1;
}

TwoThreeFourView.prototype.initStage=function(cont, listbox){
	this.listbox = listbox;
	this.stage = new Kinetic.Stage({
		container: cont,
		draggable: true,
		width: 0,
		height: 0
	});
}

TwoThreeFourView.prototype.zoomIn=function(){
	if(this.scale<3)this.scale=this.scale+0.1;
	this.draw();
}

TwoThreeFourView.prototype.zoomOut=function(){
	if(this.scale>0.5)this.scale=this.scale-0.1;
	this.draw();
}

TwoThreeFourView.prototype.draw=function(){

	var _radiusX=57*this.model.order*this.scale;
	var _radius=20*this.scale;
	var lastX=0,lastY=0;
	var layer = new Kinetic.Layer();

	var tmpNodes=[];
	if(this.model.root!=undefined)
		tmpNodes.push(this.model.root);
	var level=1;
	var finished=new Boolean();
	finished=false;

	var oldNodes=[];

	//determine x and y, draw
	do{

		for(var i=0;i<tmpNodes.length;i++){
			var xPos=50;

			if(tmpNodes[i]!=undefined){

				var prev=undefined;
				var ci=i;
				while(ci>0){
					if(tmpNodes[ci-1]!=undefined){
						prev=tmpNodes[ci-1];
						break;
					}
					ci--;
				}

				if(i>0 && prev!=undefined && prev.xPosition+_radiusX*1.5>xPos){
					while(prev.xPosition+_radiusX+15*this.scale>xPos)
						xPos++;
				}
			}

			tmpNodes[i].xPosition=xPos;
			yPos=_radius+level*2*_radius;
			tmpNodes[i].yPosition=yPos;
			if(i==tmpNodes.length-1){
				lastY=yPos+_radius;
				lastX=xPos+_radiusX;
			}
		}

		finished=true;

		var oldNodes2=tmpNodes;

		oldNodes=[];
		for(var i=0;i<tmpNodes.length;i++){
			if(tmpNodes[i]!=undefined)
				oldNodes.push(tmpNodes[i]);
		}

		tmpNodes=[];
		oldNodes3=tmpNodes;//to set X of last level
		do{
			if(oldNodes2[0]!=undefined){
				for(var i=0;i<oldNodes2[0].children.length;i++){
					tmpNodes.push(oldNodes2[0].children[i]);
				}
			}
			oldNodes2.shift();
		}while(oldNodes2.length!=0);

		for(var k=0;k<tmpNodes.length;k++){
			if(tmpNodes[k]!=undefined)
				finished=false;
		}

		if(finished){//if on last level
			tmpNodes=oldNodes3;
			for(var i=0;i<tmpNodes.length;i++){
				var xPos=50;

				if(tmpNodes[i]!=undefined){

					var prev=undefined;
					var ci=i;
					while(ci>0){
						if(tmpNodes[ci-1]!=undefined){
							prev=tmpNodes[ci-1];
							break;
						}
						ci--;
					}

					if(i>0 && prev!=undefined && prev.xPosition+_radiusX*1.5>xPos){
						while(prev.xPosition+_radiusX+15>xPos)
							xPos++;
					}
				}

				tmpNodes[i].xPosition=xPos;
				yPos=_radius+level*2*_radius;
				tmpNodes[i].yPosition=yPos;
			}
		}
		level++;
	}while(!finished);


	while(oldNodes.length!=0){
		for(var i=0;i<oldNodes.length;i++){
			if(oldNodes[i].parent!=undefined){
				var pLen=oldNodes[i].parent.children.length;
				if(pLen%2==0){
					var leftX=oldNodes[i].parent.children[pLen/2-1].xPosition;
					var rightX=oldNodes[i].parent.children[pLen/2].xPosition;
					oldNodes[i].parent.xPosition=(leftX+rightX)/2;
				}
				else{
					oldNodes[i].parent.xPosition=oldNodes[i].parent.children[pLen/2-0.5].xPosition;
				}
			}
		}
		var temp=[];
		for(var i=0;i<oldNodes.length;i++){
			temp.push(oldNodes[i]);
		}
		oldNodes=[];

		do{
			var _in=false;
			for(var i=0;i<oldNodes.length;i++){
				if(temp[0].parent!=undefined && oldNodes[i]==temp[0].parent){
					_in=true;break;
				}
			}
			if(!_in){
				if(temp[0].parent!=undefined)
					oldNodes.push(temp[0].parent);
			}
			temp.shift();
		}while(temp.length!=0);
	}

	tmpNodes=[];
	if(this.model.root!=undefined)
		tmpNodes.push(this.model.root);
	var level=1;
	var finished=new Boolean();
	finished=false;

	//determine x and y, draw
	do{
		for(var i=0;i<tmpNodes.length;i++){
			if(tmpNodes[i]!=undefined){

				for(var j=0;j<this.model.order*2;j++){

					var circle = new Kinetic.Rect({
						x: tmpNodes[i].xPosition+_radiusX/(this.model.order*2)*j,
						y: tmpNodes[i].yPosition,
						width: _radiusX/(this.model.order*2),
						height: _radius,
						fill: tmpNodes[i].color,
						stroke: 'black',
						strokeWidth: 2*this.scale,
						//draggable: true
					});

					var _val="x";
					if(tmpNodes[i].values[j]!=undefined)
						_val=tmpNodes[i].values[j];

					var val = new Kinetic.Text({
						x: circle.getX()+3*this.scale,
						y: circle.getY()+3*this.scale,
						text: _val,
						fontSize: 15*this.scale,
						fontFamily: 'Calibri',
						fill: 'black',
						width: 50+(0.6*_radiusX),
						//align: 'center'
					});

					layer.add(circle);
					layer.add(val);

				}

				if(tmpNodes[i]!=undefined && tmpNodes[i].parent!=undefined){

					var parX=tmpNodes[i].parent.xPosition;

					var j=0;
					for(;j<tmpNodes[i].parent.children.length;j++){
						if(tmpNodes[i].parent.children[j]==tmpNodes[i])break;
					}

					parX+=(_radiusX/(this.model.order*2))*j;

					var lineCol="black";
					var mIndex=0;
					for(var j=0;j<tmpNodes[i].parent.children.length;j++){
						if(tmpNodes[i].parent.children[j]==tmpNodes[i]){
							mIndex=j;break;
						}
					}

					if(tmpNodes[i].parent.neededKid==mIndex){
						lineCol="#FF8000";
					}

					var line = new Kinetic.Line({
						points: [tmpNodes[i].xPosition+_radiusX/2,tmpNodes[i].yPosition,parX,tmpNodes[i].parent.yPosition+_radius],
						stroke: lineCol,
						strokeWidth: 2*this.scale,
						lineJoin: 'round',
					});
				}
				//linked list
				if(tmpNodes[i].is_leaf && i<tmpNodes.length-1){
					var headlen = 7*this.scale;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.

					var toX=tmpNodes[i+1].xPosition;
					var Y=tmpNodes[i].yPosition+_radius/2;

					var angle = Math.atan2(0,toX-tmpNodes[i].xPosition+_radiusX);

					var arrow = new Kinetic.Line({
						//[34]
						points: [tmpNodes[i].xPosition+_radiusX+1*this.scale, Y, toX, Y, toX-headlen*Math.cos(angle-Math.PI/6),Y-headlen*Math.sin(angle-Math.PI/6),toX, Y, toX-headlen*Math.cos(angle+Math.PI/6),Y-headlen*Math.sin(angle+Math.PI/6)],
						stroke: "#FF8000",
						strokeWidth:2*this.scale
					});
				}
			}


			if(tmpNodes[i]!=undefined && tmpNodes[i].parent!=undefined)
				layer.add(line);
			if(tmpNodes[i].is_leaf && i<tmpNodes.length-1)
				layer.add(arrow);
		}

		finished=true;
		var oldNodes=tmpNodes; tmpNodes=[];

		do{
			if(oldNodes[0]!=undefined){
				for(var i=0;i<oldNodes[0].children.length;i++){
					tmpNodes.push(oldNodes[0].children[i]);
				}
			}
			oldNodes.shift();
		}while(oldNodes.length!=0);

		for(var k=0;k<tmpNodes.length;k++){
			if(tmpNodes[k]!=undefined)
				finished=false;
		}
		level++;
	}while(!finished);

	var w=lastX+50*this.scale;
	var h=lastY+50*this.scale

	if(h<500)h=500;
	if(w<1000)w=1000;

	this.stage.setWidth(w);
	this.stage.setHeight(h);
	this.stage.removeChildren();
	this.stage.add(layer);
	var diff=this.model.history.length-this.listbox.length;
	var start=this.listbox.length;
	for(var i=0;i<diff;i++)
	{
		var opt = document.createElement('option');
		opt.value = start+i;
		var entry=this.model.history[start+i]
		opt.innerHTML = (start+i)+' '+entry[0]+' '+entry[1];
		this.listbox.appendChild(opt);
	}
}