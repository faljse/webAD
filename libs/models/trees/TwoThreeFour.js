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
'use strict';

function Node() {
    this.values = [];
    this.children = [];
    this.parent = undefined;
    this.xPosition = 0;
    this.yPosition = 0;

    this.isLeaf = function () {
        return this.children.length === 0;
    };

    this.split = function () {
        var parent = new Node();
        this.parent = parent;
        var right = new Node();
        right.parent = parent;
        right.values = this.values.slice(3);
        right.children = this.children.slice(3)
        parent.children.push(this, right);
        parent.values.push(this.values[2]);
        this.values = this.values.slice(0, 2);
        this.children = this.children.slice(0, 3);
        return parent;
    };

    this.findIdxPos = function (val) {
        var idx = 0;
        while (val > this.values[idx] && idx < this.values.length)
            idx++;
        return idx;
    };

    this.getLeft = function () {
        var parentIdx = this.parent.findIdxPos(this.values[0]);
        return this.parent.children[parentIdx];
    };

    this.getRight = function () {
        var parentIdx = this.parent.findIdxPos(this.values[this.values.length - 1]);
        return this.parent.children[parentIdx + 1];
    };

    this.insertIndex = function (value, node) {

        var idx = 0;
        while (value > this.values[idx] && idx < this.values.length)
            idx++;
        if (this.values[idx] == value)
            return; //value existiert bereits

        if (node != null) {
            this.values.splice(idx, 0, node.values[0]);
            this.children.splice(idx + 1, 0, node.children[1]);
        }
        else {
            this.values.splice(idx, 0, value);
        }
    };

    this.print = function () {
        var txt = " ";
        for (var i = 0; i < this.values.length; i++)
            txt += "," + this.values[i];
        console.log(txt)
    };

    this.getSize = function () {
        return this.values.length + 1;
    };
}

function TwoThreeFour() {
    this.view = new TwoThreeFourView(this);
    this.history = [];
    this.root = undefined;
    this.actStateID = -1;
    this.N = 2; //234 Tree
};

TwoThreeFour.prototype.init = function () {
    //this.pushto
};

TwoThreeFour.prototype.pushToHistory = function (type, text, node) {
    this.history.push([type, text, JSON.retrocycle(JSON.parse(JSON.stringify(JSON.decycle(node))))]);
};

TwoThreeFour.prototype.copy = function (toCopy) {
    var newTree = new TwoThreeFour();

    function recursivePreorderTraversal(newTree, node) {
        if (node == undefined)
            return;

        newTree.add(node.value);
        recursivePreorderTraversal(newTree, node.leftChild);
        recursivePreorderTraversal(newTree, node.rightChild);
    }

    recursivePreorderTraversal(newTree, toCopy.root);
    return newTree;
};

TwoThreeFour.prototype.replaceThis = function (toCopy) {

    this.root = undefined;
    function recursivePreorderTraversal(tree, node) {
        if (node == undefined)
            return;

        tree.add(node.value);
        recursivePreorderTraversal(tree, node.leftChild);
        recursivePreorderTraversal(tree, node.rightChild);
    }

    recursivePreorderTraversal(this, toCopy.root);
}

TwoThreeFour.prototype.prev = function () {
}

TwoThreeFour.prototype.next = function () {
}

TwoThreeFour.prototype.firstState = function () {
}

TwoThreeFour.prototype.lastState = function () {
}

TwoThreeFour.prototype.insertNode = function (node, value) {
    debug.debug('insert node: ' + value);
    var newNode = null;
    for (var i = 0; i < node.children.length; i++) {
        if (i == node.values.length || node.values[i] > value) {
            newNode = this.insertNode(node.children[i], value);
            break;
        }
    }

    if (node.children.length == 0) //unterste ebene
    {
        node.insertIndex(value);
        if (node.values.length >= 4) //overflow->split
        {
			this.pushToHistory("minor", "leaf overflow", this.root);
            debug.debug('overflow->split');
            newNode = node.split();
            if (newNode != null && node == this.root) {
                this.root = newNode;
				debug.debug('new root: ' + newNode.toString());
				this.pushToHistory("minor", "new root", this.root);
            }
            return newNode;
        }
        return null;
    }

    if (newNode == null)
        return newNode;
    node.insertIndex(value, newNode);

	if (node.values.length >= 4) { //overflow
		this.pushToHistory("minor", "overflow", this.root);
		var retNode= node.split();
		if(node==this.root)
			this.root=retNode;
		this.pushToHistory("minor", "new root", this.root);
		return retNode;
	}
}

TwoThreeFour.prototype.add = function (val) {
    if (val == undefined)
        var val = parseInt(prompt("Add:"));
    if (isNaN(val))return;
    var node = new Node();
    node.value = val;

    if (this.root == undefined) {
        this.root = node;
        this.draw();
        //this.saveInDB();
    }
    this.insertNode(this.root, val);
    this.pushToHistory("major", "", this.root);
    this.draw();
}


TwoThreeFour.prototype.saveInDB = function () {
}

TwoThreeFour.prototype.search = function () {

    var value = parseInt(prompt("Search for:"));
    if (isNaN(value))
        return;
    var tree = this;
    if (tree.root == undefined) {
        return;
    }
}


TwoThreeFour.prototype.remove = function () {

    var value = parseInt(prompt("delete:"));
    if (isNaN(value))return;
    if (this.root == undefined) {
        return;
    }
    this.removeIndex(tree.root, value);
    this.draw();
}

TwoThreeFour.prototype.removeIndex = function (node, value) {

    var idx = 0;
    while (value > node.values[idx] && idx < node.values.length)
        idx++;
    if (node.values[idx] == value) {
        if (node.values.length == 1) //would underflow
        {
            var left = node.getLeft();
            var right = node.getRight();

            console.log('left:' + left);
            console.log('right:' + right);
            if (left !== undefined &&
                left.values.length == 2 &&
                right !== undefined &&
                right.values.length == 2) {
                console.log("case 1");
                //case 1:
                // Bedingung: Alle adjazenten Knoten (benachbarte Knoten auf derselben Tiefe) zum unterlaufenden Knoten v sind 2-Knoten
                //Man verschmilzt v mit einem/dem adjazenten Nachbarn w und verschiebt den nicht mehr benötigten
                //Schlüssel vom Elternknoten u zu dem verschmolzenen Knoten v´

            }
            else {
                console.log("case 2");
                //case 2:
                //Verschieben von Schlüsseln
                //Bedingung: Ein adjazenter Knoten (benachbarter Knoten auf derselben Tiefe) w zum unterlaufenden Knoten v ist ein 3-Knoten oder 4-Knoten
                //Man verschiebt ein Kind von w nach v
                //Man verschiebt einen Schlüssel von u nach v
                //Man verschiebt einen Schlüssel von w nach u
                //Nach dem Verschieben ist der Unterlauf behoben

            }


        }
        else
            node.values.splice(idx, 1);
    }
    else if (node.children.length > idx)
        this.removeIndex(node.children[idx], value);
}


TwoThreeFour.prototype.random = function () {
    this.root = undefined;
    var number = parseInt(20);

    for (var i = 0; i < number; i++) {
        this.add(parseInt(Math.random() * 50, 10));
    }
    this.draw();
}

TwoThreeFour.prototype.example = function () {
    this.root = undefined;
    var numbers = [5, 3, 10, 12, 1, 6, 13, 14];

    for (var i = 0; i < numbers.length; i++) {
        this.add(numbers[i]);
    }
    this.draw();
}

TwoThreeFour.prototype.draw = function () {
    this.view.draw();
}

