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
	this.scale=1;
}

TwoThreeFourView.prototype.initStage=function(cont){
	this.stage = new Kinetic.Stage({
		container: cont,
		draggable: true,
		width: 0,
		height: 0
	});
}

TwoThreeFourView.prototype.zoomIn=function(){
	if(this.scale<2.5)this.scale=this.scale+0.1;
	this.draw();
}

TwoThreeFourView.prototype.zoomOut=function(){
	if(this.scale>0.5)this.scale=this.scale-0.1;
	this.draw();
}

TwoThreeFourView.prototype.draw=function(){

	var tmpNodes=[];
	if(this.model.root!=undefined)
		tmpNodes.push(this.model.root);
	var level=1;
	var finished=false;
	var model=this.model;
	this.stage.setHeight(500);
	this.stage.setWidth(1000);
	this.stage.removeChildren();
	var layer = new Kinetic.Layer();

	var row=0;
	var col=0;
	function bla(node, row, col,x,y)
	{
		for(var i=0;i<node.values.length;i++)
		{
			var textX=x+i*25+25*(col *model.N*2);
			var textY=row*70+25	;
			var text = new Kinetic.Text({
				x: textX,
				y: textY,
				text: ':'+node.values[i],
				fontSize: 15,
				fontFamily: 'Calibri',
				fill: 'green'
			});
			layer.add(text);
		}

		//calc node positions
		var xOff=60*(col*Math.pow(model.N, row));
		var yOff=row*70+50;
		var xStart=x+25*(col*model.N*2);
		var yStart=row*70+20;

		var line = new Kinetic.Line({
			points: [x, y, xStart, yStart],
			stroke: 'red',
			strokeWidth: 1,
			lineCap: 'round',
			lineJoin: 'round',
			dashArray: [1, 1]
		});
		layer.add(line);

		var nodeBorder = new Kinetic.Rect({
			x: xStart,
			y: yStart,
			width: 100,
			height: 25,
			//fill: none,
			stroke: 'blue',
			strokeWidth: 1,
		});
		layer.add(nodeBorder)

		for(var i=0;i<node.children.length;i++)
		{
			bla(node.children[i], row+1, col*model.N*2+i, xOff+i*20, yOff);
		}
	}
	bla(this.model.root, row, col, 0, 0);
	this.stage.add(layer);
}