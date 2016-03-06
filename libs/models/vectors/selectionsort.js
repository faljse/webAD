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

function Element(value){
	this.color=undefined;
	this.value=value;
}

function Vector(){
	this.view=new VectorView(this);
	this.db=[];
	this.actStateID=-1;
	this.elements=[];
}

Vector.prototype.init=function(){
	this.elements=[];
	this.i=0;
	this.j=0;

	this.col1="#00FF80";
	this.col2="#00FFFF";
	this.col3="#FF0000";
	this.col4="#F7D358";
	this.col5="#CC2EFA";
	
	this.speed=10;
	
	this.tmpmin=0;
	this.stepDelay=0;
	
	this.paused=false;
	this.finished=false;
	if(this.actStateID!=-1)
		this.saveInDB();
}

Vector.prototype.saveInDB=function(){
	var count=this.db.length-1;
 	if(count!=this.actStateID){
 		this.db.splice(this.actStateID+1,count-this.actStateID);
 	}

	var nextID=this.db.length;
	
	var new_state = this.copy();
	//code snippet for ignoring duplicates
	var last_id=this.db.length-1;
	var last_state=this.db[last_id];
	
	var same=true;
	
	if(last_state==undefined || last_state.elements.length!=new_state.elements.length ||
			last_state.speed!=new_state.speed){
		same=false;
	}
	else{
		for(var i=0;i<new_state.elements.length;i++){
			if(new_state.elements[i].color!=last_state.elements[i].color ||
					new_state.elements[i].value!=last_state.elements[i].value)
				same=false;
		}
	}
	//end code snippet for ignoring duplicates
	if(!same){
		this.db.push(new_state);
		
		this.actStateID=nextID;
	}
}

Vector.prototype.copy=function(){
	var newVector=new Vector();
	newVector.finished=this.finished;
	newVector.i=this.i;
	newVector.j=this.j;
	newVector.tmpmin=this.tmpmin;
	newVector.paused=true;

	newVector.col1=this.col1;
	newVector.col2=this.col2;
	newVector.col3=this.col3;
	newVector.col4=this.col4;
	newVector.col5=this.col5;
	
	newVector.speed=this.speed;
	
	newVector.stepDelay=this.stepDelay;
	
	newVector.elements=[];
	for(var i=0;i<this.elements.length;i++){
		newVector.elements.push(new Element(this.elements[i].value));
		newVector.elements[i].color=this.elements[i].color;
	}
	return newVector;
}

Vector.prototype.replaceThis=function(toCopy){
	this.finished=toCopy.finished;
	this.i=toCopy.i;
	this.j=toCopy.j;
	this.tmpmin=toCopy.tmpmin;
	this.paused=true;
	
	this.col1=toCopy.col1;
	this.col2=toCopy.col2;
	this.col3=toCopy.col3;
	this.col4=toCopy.col4;
	this.col5=toCopy.col5;
	
	this.speed=toCopy.speed;
	
	this.stepDelay=toCopy.stepDelay;
	
	this.elements=[];
	for(var i=0;i<toCopy.elements.length;i++){
		this.elements.push(new Element(toCopy.elements[i].value));
		this.elements[i].color=toCopy.elements[i].color;
	}
}

Vector.prototype.prev=function(){
	if(this.paused){
		if(this.actStateID>0){
			var prev_id=this.actStateID-1;
			this.actStateID=prev_id;
			var rs=this.db[prev_id];
			//make actual node to THIS:
	      	this.replaceThis(rs);
	      	this.draw();
		}
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.next=function(){
	if(this.paused){
		if(this.actStateID<this.db.length-1){
			var next_id=this.actStateID+1;
			this.actStateID=next_id;
			var rs=this.db[next_id];
			//make actual node to THIS:
	      	this.replaceThis(rs);
	      	this.draw();
		}
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.firstState=function(){
	if(this.paused){
		this.actStateID=0;
		var rs=this.db[0];
		//make actual node to THIS:
	    this.replaceThis(rs);
	    this.draw();
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.lastState=function(){
	if(this.paused){
		var last_id=this.db.length-1;
		this.actStateID=last_id;
		var rs=this.db[last_id];
		//make actual node to THIS:
	     this.replaceThis(rs);
	     this.draw();
	}
	else
		window.alert("Pause the sorting first!");
}
 
Vector.prototype.setRandomElements=function(){
	 var tempElements=[];
	 var tempVal;
	 var number=Math.floor(Math.random() * (20 - 1 + 1)) + 1;

	 for(var i=0;i<number;i++){
		 tempVal=parseInt(Math.random()*40,10);
		 tempElements.push(new Element(tempVal));
	 }

	 this.init();
	 this.elements=tempElements;
	 this.selectionSort();
}
 
Vector.prototype.setColorsSelectionSort=function(){
	if(!this.finished){
		for(var j=0;j<this.j;j++){
			this.elements[j].color=this.col4; //finished gold
		}

		if(this.j==this.tmpmin)
			this.elements[this.tmpmin].color=this.col2; //min blue
		else
			this.elements[this.j].color=this.col3; //red min swap
		
		for(var j=this.j+1;j<this.size();j++){
			this.elements[j].color=this.col5; //others purple

			this.elements[this.i].color=this.col1; //act green
			if(j==this.tmpmin)
				this.elements[this.tmpmin].color=this.col2; //min blue
		}	 
		
	}
	
	else{
		for(var i=0;i<this.size();i++){
			this.elements[i].color=this.col4; //finished gold
		}
	}
}

Vector.prototype.selectionSort=function(){
	if(this.elements.length==0){
		this.draw();
		return;
	}
	else if(this.elements.length==1){
		this.finished=true;
		this.setColorsSelectionSort();
		this.draw();
		this.saveInDB();
		clearTimes();
		return;
	}
	
	function step(vector){

		setTimeout(function(){
		
		vector.stepDelay=0;
			
		function sort(vector){
			vector.setColorsSelectionSort();
			vector.draw();
			vector.saveInDB();
			
			setTimeout(function(){

				if(vector.elements[vector.tmpmin].value>vector.elements[vector.i].value){
					vector.tmpmin=vector.i;
				}
				
				//sorting, end not reached
				if(vector.i!=vector.size()-1){
					vector.i=vector.i+1;
					vector.setColorsSelectionSort();
					vector.draw();
					//vector.saveInDB();
					sort(vector);
				}
				
				//end reached
				else if(vector.j!=vector.size()-1){
					var delay=0;
					//if min is last
					if(vector.tmpmin==vector.i){
						vector.setColorsSelectionSort();
						vector.draw();
						vector.saveInDB();
						delay=vector.speed*100;
					}
					
					setTimeout(function(){
						//swap
						vector.stepDelay=vector.speed*100;
						if(vector.tmpmin==vector.j)vector.stepDelay=0;
						var tmp=vector.elements[vector.j].value;
						vector.elements[vector.j].value=vector.elements[vector.tmpmin].value;
						vector.elements[vector.tmpmin].value=tmp;
						if(delay!=vector.speed*100)
							vector.setColorsSelectionSort();
						//inverse just for drawing
						var tmp_color=vector.elements[vector.j].color;
						vector.elements[vector.j].color=vector.elements[vector.tmpmin].color;
						vector.elements[vector.tmpmin].color=tmp_color;
						vector.draw();
						
						//reset indexes
						vector.j=vector.j+1;
						vector.tmpmin=vector.j;
						vector.i=vector.j;
						vector.saveInDB();
						//window.alert(delay);
						step(vector);
						
					},delay)
					
				}
				//end reached and finished
				else{
					vector.finished=true;
					vector.setColorsSelectionSort();
					vector.saveInDB();
					vector.draw();
					
					//change the button. better way?
					clearTimes();
					
					return;
				}
			},vector.speed*100)
		}
		
		sort(vector);
		
		},vector.stepDelay)
	}

	step(this);
}
 
Vector.prototype.getElementsByPrompt=function(){
	 var tempElements=[];

	 var valuesInString=prompt("Please enter the elements (separated by space):\nValues > 999 are ignored");

	 var tempValsStr = valuesInString.split(" "); 

	 var _in=false;
	 
	 for(var i=0;i<tempValsStr.length;i++){
		 if(!isNaN(parseInt(tempValsStr[i])) && parseInt(tempValsStr[i])<1000){
			 tempElements.push(new Element(parseInt(tempValsStr[i])));
			 _in=true;
		 }
	 }

	 if(_in){
		 this.init();
		 this.elements=tempElements;
		 this.selectionSort();
		 return true;
	 }
	 else return false;
}

Vector.prototype.example=function(){
	this.init();
	var vals=[10,2,11,5,8,3,13,14,15,9,4,7,6,3];
	 for(var i=0;i<vals.length;i++){
		this.elements.push(new Element(vals[i]));
	 }
	this.setColorsSelectionSort();
	this.paused=true;
	this.saveInDB();
	this.draw();
}

Vector.prototype.size=function(){
	 return this.elements.length;
 }

Vector.prototype.draw=function(){
	 this.view.draw();
 }