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
	var finished=new Boolean();
	finished=false;
	var model=this.model;
	this.stage.setHeight(500);
	this.stage.setWidth(1000);
	this.stage.removeChildren();

	var layer = new Kinetic.Layer();

	var row=1;
	var col=0;
	function bla(node, row, col,x,y)
	{
		for(var i=0;i<node.values.length;i++)
		{
			var textX=100+i*25+25*(col *model.N*2);
			var textY=row*50+100;
			var text = new Kinetic.Text({
				y: textY,
				x: textX,
				text: ':'+node.values[i],
				fontSize: 15,
				fontFamily: 'Calibri',
				fill: 'green'
			});
			layer.add(text);


			var line = new Kinetic.Line({
				points: [x, y, textX, textY],
				stroke: 'red',
				strokeWidth: 2,
				lineCap: 'round',
				lineJoin: 'round',
				dashArray: [1, 1]
			});
			layer.add(line);
		}

		for(var i=0;i<node.children.length;i++)
		{
			bla(node.children[i], row+1, col*model.N*2+i, 100+i*50 +25*(col*Math.pow(model.N,row)), row*50+100);

		}
	}
	bla(this.model.root,row,col);
	//add to layer


	this.stage.add(layer);
}