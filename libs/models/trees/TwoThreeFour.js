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

var N=2;
function Node(){
	this.values = [];
	this.children = [];
	this.parent = undefined;
	this.xPosition = 0;
	this.yPosition = 0;

	this.isLeaf=function(){
		return this.children.length==0;
	}

	this.split=function()
	{
		var parent=new Node();
		var right=new Node();
		right.values=this.values.slice(N+1);
		right.children=this.children.slice(N)
		parent.children.push(this,right);
		parent.values.push(this.values[N]);
		this.values=this.values.slice(0,N);
		this.children=this.children.slice(0,N);
		return parent;
	}

	this.insertIndex=function(value, node) {

		var idx=0;
		while(value > this.values[idx]&&idx<this.values.length)
			idx++;

		if(node!=null)
		{
			this.values.splice(idx,0,node.values[0]);
			this.children.splice(idx+1, 0, node.children[1]);
		}
		else
		{
			this.values.splice(idx,0,value);
		}

	}

	this.print=function()
	{
		var txt=" ";
		for(var i=0;i<this.values.length;i++)
			txt+=","+this.values[i];
		console.log(txt)
	}

	this.getSize=function()
	{
		return this.values.length+1;
	}
}

function TwoThreeFour(){
	this.view=new TwoThreeFourView(this);
	this.db=[];
	this.root=undefined;
	this.actStateID=-1;
	this.N=2; //234 Tree
}

TwoThreeFour.prototype.init=function(){
	this.saveInDB();
}

TwoThreeFour.prototype.copy=function(toCopy){
	var newTree=new TwoThreeFour();
			
	function recursivePreorderTraversal(newTree,node){
		if(node==undefined)
			return;
		
		newTree.addFixed(node.value);
		recursivePreorderTraversal(newTree,node.leftChild);
		recursivePreorderTraversal(newTree,node.rightChild);
	}

	recursivePreorderTraversal(newTree,toCopy.root);

	return newTree;
}

TwoThreeFour.prototype.replaceThis=function(toCopy){
	
	this.root=undefined;
	function recursivePreorderTraversal(tree,node){
		if(node==undefined)
			return;
		
		tree.addFixed(node.value);
		recursivePreorderTraversal(tree,node.leftChild);
		recursivePreorderTraversal(tree,node.rightChild);
	}

	recursivePreorderTraversal(this,toCopy.root);

}

TwoThreeFour.prototype.prev=function(){
}

TwoThreeFour.prototype.next=function(){
	for(var i=0;i<12;i++)
		add(i);

}

TwoThreeFour.prototype.firstState=function(){
}

TwoThreeFour.prototype.lastState=function(){
}

TwoThreeFour.prototype.insertNode=function(node, value) {
	var newNode=null;
	for(var i=0;i<node.children.length;i++) {
		if (i==node.values.length||node.values[i] > value) {
			newNode=this.insertNode(node.children[i], value);
			break;
		}
	}

	if(node.children.length==0) //unterste ebene
	{
		node.insertIndex(value);
		if(node.values.length>this.N*2) //overflow->split
		{
			newNode=node.split();
			if(newNode!=null&&node==this.root)
			{
				this.root=newNode;
			}
			return newNode;
		}
		return null;
	}

	if (newNode == null)
		return newNode;

	if (node.getSize() < this.N * 2) {//noch platz im index
		node.insertIndex(value, newNode);
		return;
	}

	newNode=node.split();
	if(node==this.root)
		this.root=newNode;
	return newNode;
}

TwoThreeFour.prototype.add=function(val) {
	if(val==undefined)
		var val=parseInt(prompt("Add:"));
	if(isNaN(val))return;
	var node=new Node();
	node.value=val;
		
	if(this.root==undefined){
		this.root=node;
		this.draw();
		//this.saveInDB();
	}
	this.insertNode(this.root,val);
	this.root.print();
	this.draw();
}

TwoThreeFour.prototype.addFixed=function(_val) {
	var node=new Node();
	
	node.value=_val;
		
	if(this.root==undefined){
		this.root=node;
	}
}

TwoThreeFour.prototype.saveInDB=function(){
}

TwoThreeFour.prototype.search=function() {

	var value=parseInt(prompt("Search for:"));
	if(isNaN(value))return;
	
	var tree=this;
	
	if(tree.root==undefined){
		return;
	}


}


TwoThreeFour.prototype.remove=function() {

	var value=parseInt(prompt("delete:"));
	if(isNaN(value))return;
	if(this.root==undefined){
		return;
	}

}

TwoThreeFour.prototype.random=function(){
	//var count=this.db().count();

	//if(count==this.actStateID){
		
		this.root=undefined;
		var number=parseInt(Math.random()*10,10); 
	
		for(var i=0;i<number;i++){
			this.addFixed(parseInt(Math.random()*1000,10));
		}
		
		this.saveInDB();
		this.draw();
	
	//}
}

TwoThreeFour.prototype.example=function(){
	this.root=undefined;
	var numbers=[5,3,10,12,1,6];

	for(var i=0;i<numbers.length;i++){
		this.addFixed(numbers[i]);
	}
		
	this.saveInDB();
	this.draw();
}

TwoThreeFour.prototype.draw=function(){
	this.view.draw();
}

