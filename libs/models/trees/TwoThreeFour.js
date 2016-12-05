/*
 Software License Agreement (BSD License)
 http://wwwlab.cs.univie.ac.at/~a1100570/webAD/
 Copyright (c), Martin Kunz
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

function Node(node) {
    this.values = [];
    this.children = [];
    this.parent = undefined;

    if (node !== undefined) {
        for (var i = 0; i < node.children.length; i++) {
            this.children.push(new Node(node.children[i]));
            this.children[i].parent = this;
        }
        this.parent = node.parent;
        this.xPosition = node.xPosition;
        this.yPosition = node.yPosition;
        this.values = node.values;
        this.color = node.color;
    }
};

Node.prototype.isLeaf = function () {
    return this.children.length === 0;
};

Node.prototype.split = function () {
    var parent = new Node();
    this.parent = parent;
    var right = new Node();
    right.parent = parent;
    right.values = this.values.slice(3);
    right.children = this.children.slice(3);
    for (var i = 0; i < right.children.length; i++)
        right.children[i].parent = right;
    parent.children.push(this, right);
    parent.values.push(this.values[2]);
    this.values = this.values.slice(0, 2);
    this.children = this.children.slice(0, 3);
    return parent;
};

Node.prototype.findIdxPos = function (val) {
    var idx = 0;
    while (val >= this.values[idx] && idx <= this.values.length)
        idx++;
    return idx;
};

Node.prototype.getLeft = function () {
    if(this.parent==undefined)
        return undefined;
    var value=this.values[0];
    var idx=this.parent.findIdxPos(value);
    if(idx>0)
        return this.parent.children[idx-1];
    else return undefined;
};

Node.prototype.getRight = function () {
    if(this.parent==undefined)
        return undefined;
    var value=this.values[this.values.length - 1];
    var idx=this.parent.findIdxPos(value);
    if(idx<this.parent.children.length -1)
        return this.parent.children[idx+1];
    else return undefined;
};

Node.prototype.insertIndex = function (value, node) {
    var idx = 0;
    while (value > this.values[idx] && idx < this.values.length)
        idx++;
    if (this.values[idx] == value)
        return; //value existiert bereits

    if (node != null) {
        this.values.splice(idx, 0, node.values[0]);
        this.children.splice(idx + 1, 0, node.children[1]);
        for (var i = 0; i < this.children.length; i++)
            this.children[i].parent = this;
        node.parent = this.parent;
    }
    else {
        this.values.splice(idx, 0, value);
    }
};

Node.prototype.print = function () {
    var txt = " ";
    for (var i = 0; i < this.values.length; i++)
        txt += "," + this.values[i];
    console.log(txt)
};

Node.prototype.getSize = function () {
    return this.values.length + 1;
};


function TwoThreeFour() {
    this.view = new TwoThreeFourView(this);
    this.history = [];
    this.root = undefined;
    this.actStateID = -1;
};

TwoThreeFour.prototype.init = function () {
    this.pushToHistory("init","",new Node());
    this.currentVersion=0;
};

TwoThreeFour.prototype.pushToHistory = function (type, text, node) {
    this.history.push([type, text, JSON.retrocycle(JSON.parse(JSON.stringify(JSON.decycle(node))))]);
};

TwoThreeFour.prototype.loadVersion = function (id) {
    console.log(this.history[id]);
    this.root = new Node(this.history[id][2]);
    this.currentVersion = id;
    this.draw();
};

TwoThreeFour.prototype.insertNode = function (node, value) {
    debug.debug("insert node: " + value);
    var newNode = null;
    for (var i = 0; i < node.values.length; i++)
        if(node.values[i]==value)
            return; //value exists.

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
            node.color="#FF8000";
            this.pushToHistory("minor", "leaf overflow, split", this.root);
            debug.debug("overflow->split");
            newNode = node.split();
            newNode.color="#FF8000";

            if (newNode != null && node == this.root) {
                this.root = newNode;
                debug.debug("new root: " + newNode.toString());
                this.pushToHistory("minor", "new root", this.root);
            }
            return newNode;
        }
        return null;
    }

    if (newNode == null)
        return newNode;
    node.insertIndex(value, newNode);
    node.color="#FF8000";
    newNode.color="#FF8000";
    this.pushToHistory("minor", "E leaf overflow, split", this.root);

    if (node.values.length >= 4) { //overflow
        this.pushToHistory("minor", "root overflow, split", this.root);
        var retNode = node.split();
        if (node == this.root)
            this.root = retNode;
        node.color="#FF8000";
        newNode.color="#ADFF2F";
        this.pushToHistory("minor", "new root", this.root);
        return retNode;
    }
}

TwoThreeFour.prototype.addInt = function (val) {
    if (isNaN(val))return;
    var node = new Node();
    node.value = val;

    if (this.root == undefined) {
        this.root = node;
    }
    this.insertNode(this.root, val);
    this.resetColor(this.root);
    this.pushToHistory("major", "", this.root);
    this.currentVersion=this.history.length-1;
}

TwoThreeFour.prototype.add = function () {
    var strings = prompt("Add:");
    if(strings==null)
        return;
    strings=strings.split(" ");
    for (var i = 0; i < strings.length; i++) {
        this.addInt(parseInt(strings[i]));
    }
}

TwoThreeFour.prototype.resetColor = function (node) {
    node.color="#FFFFFF";
    for (var i = 0; i < node.children.length; i++) {
        this.resetColor(node.children[i]);
    }
}

TwoThreeFour.prototype.saveInDB = function () {
}

TwoThreeFour.prototype.search = function () {
    var val = parseInt(prompt("Search for:"));
    if (isNaN(val))
        return;
    var tree = this;
    if (tree.root == undefined)
        return;

    var actNode=this.root;
    actNode.color="#FF8000";
    this.draw();

    function whileLoop(tree,actNode){
        setTimeout(function (){
            //find index of pointer leading to target:
            //assume its on first place
            var index=0;
            //if not, iterate
            if(val>=actNode.values[0]){
                for(var i=0;i<actNode.values.length;i++){
                    if(val>=actNode.values[i] && (actNode.values[i+1]==undefined || val<actNode.values[i+1])){
                        index=i+1; // because pointer.length+1 == keys.length
                        break;
                    }
                }
            }
            actNode.neededKid=index;
            actNode=actNode.children[index];
            actNode.color="#FF8000";

            actNode.parent.color="#ADFF2F";
            tree.draw();
            actNode.parent.neededKid=undefined;
            if(actNode.children.length>0)
                whileLoop(tree,actNode);
            else{
                setTimeout(function(){
                    for(var i=0;i<actNode.values.length;i++){
                        if(actNode.values[i]==val){
                            actNode.color="#ADFF2F";
                            tree.draw();
                            return;
                        }
                    }
                    actNode.color="#FF0000";
                    tree.draw();
                    return;
                },1000);
            }
        },1000)
    }
    if(!actNode.is_leaf)
        whileLoop(tree,actNode);
    else notFound(this);
}

TwoThreeFour.prototype.remove = function () {
    if (this.root == undefined)
        return;
    var strings = prompt("Remove:");
    if(strings==null)
            return;
    strings=strings.split(" ");
    for (var i = 0; i < strings.length; i++) {
        this.removeIndex(this.root, parseInt(strings[i]), null);
        this.resetColor(this.root);
        this.removeIndex(this.root, parseInt(strings[i]), null);
        this.pushToHistory("major", "", this.root);
    }
}
// 3 5 6 10
TwoThreeFour.prototype.removeIndex = function (node, value, replaceNode) {
    var idx = 0;
    var rIdx = -1;
    while (value > node.values[idx] && idx < node.values.length)
        idx++;
    var left = node.getLeft();
    var right = node.getRight();

    if(replaceNode != null){
        if(node.children.length>0){
            this.removeIndex(node.children[0], value, replaceNode);
        }
        else{
            var rIdx=0;
            while (value > replaceNode.values[rIdx] && rIdx < replaceNode.values.length)
                    rIdx++;
            var tmp=node.values[idx];
            node.values[idx]=replaceNode.values[rIdx];
            replaceNode.values[rIdx]=tmp;
            node.values.splice(idx, 1);
        }
    }
    else if (node.values[idx] == value){
        if(node.children.length>0){
            this.removeIndex(node.children[idx+1], value, node);
        }
        else{
            node.values.splice(idx, 1);
        }
    }
    else if (node.children.length > 0){
          this.removeIndex(node.children[idx], value, null);
    }

    if (node.values.length == 0) //underflow
    {
        console.log("left: " + ((left!=undefined)?left.values:"-"));
        console.log("right: " + ((right!=undefined)?right.values:"-"));
        this.pushToHistory("minor", "underflow", this.root);

        if (node == this.root) {
            node.color="#FF8000";
            this.pushToHistory("minor", "S underflow: swap root", this.root);

            this.root = node;
            this.parent = undefined;
            node.color="#FF8000";
            this.pushToHistory("minor", "E underflow: swap root", this.root);

        }
        else if ((left == undefined ||
            left.values.length == 1) &&
            (right == undefined ||
            right.values.length == 1)) {
            //case 1:
            // Bedingung: Alle adjazenten Knoten (benachbarte Knoten auf derselben Tiefe) zum unterlaufenden Knoten v sind 2-Knoten
            //Man verschmilzt v mit einem/dem adjazenten Nachbarn w und verschiebt den nicht mehr benötigten
            //Schlüssel vom Elternknoten u zu dem verschmolzenen Knoten v´
            if (left != undefined) {
                left.color="#ADFF2F";
                node.color="#FF8000";
                this.pushToHistory("minor", "S case 1 uf, merge left", this.root);
                if (node.children.length > 0) {
                    left.children.splice(left.children.length, 0, node.children[0]);
                }
                var pos = node.parent.findIdxPos(value);
                if(replaceNode!=null && rIdx!=-1)
                    pos= node.parent.findIdxPos(replaceNode.values[rIdx]);

                left.values.push(left.parent.values[pos - 1]);
                node.parent.values.splice(pos - 1, 1);
                node.parent.children.splice(pos, 1);
                if (node.parent == this.root && node.parent.values.length == 0) {
                    left.parent = undefined;
                    this.root = left;
                }
                node.color="#ADFF2F";
                this.pushToHistory("minor", "E case 1 uf, merge left", this.root);
            }
            else if (right != undefined) {
                right.color="#ADFF2F";
                node.color="#FF8000";
                this.pushToHistory("minor", "S case 1 uf, merge right", this.root);
                if (node.children.length > 0) {
                    right.children.splice(0, 0, node.children[0]);
                }
                var pos = right.parent.findIdxPos(value);
                right.values.splice(0, 0, node.parent.values[pos]);
                node.parent.values.splice(pos, 1);
                node.parent.children.splice(pos, 1);
                if (node.parent == this.root && node.parent.values.length == 0) {
                    right.parent = undefined;
                    this.root = right;
                }
                node.color="#ADFF2F";
                this.pushToHistory("minor", "E case 1 uf, merge right", this.root);
            }
        }
        else {

            console.log("case 2, verschieben")
            //case 2:
            //Verschieben von Schlüsseln
            //Bedingung: Ein adjazenter Knoten (benachbarter Knoten auf derselben Tiefe) w zum unterlaufenden
            // Knoten v ist ein 3-Knoten oder 4-Knoten
            //Man verschiebt ein Kind von w nach v
            //Man verschiebt einen Schlüssel von u nach v
            //Man verschiebt einen Schlüssel von w nach u
            //Nach dem Verschieben ist der Unterlauf behoben
            var v = node;
            if (left != undefined && (left.values.length == 2 || left.values.length == 3)) {
                left.color="#ADFF2F";
                node.color="#FF8000";
                this.pushToHistory("minor", "S case 2 uf, balance left", this.root);
                console.log("left")
                //Man verschiebt ein Kind von w nach v
                if (left.children.length > 0) {
                    node.children.splice(0, 0, left.children[left.children.length - 1]);
                    left.children.splice(-1, 1);
                }
                //Man verschiebt einen Schlüssel von u nach v
                var pos = left.parent.findIdxPos(value)
                node.values.splice(0, 0, left.parent.values[pos - 1]);
                left.parent.values.splice(pos - 1, 1);
                //Man verschiebt einen Schlüssel von w nach u
                left.parent.values.splice(pos - 1, 0, left.values[left.values.length - 1]);
                left.values.splice(-1, 1);
                left.color="#ADFF2F";
                node.color="#ADFF2F";
                this.pushToHistory("minor", "E case 2 uf, balance left", this.root);

            }
            else {
                right.color="#ADFF2F";
                node.color="#FF8000";
                this.pushToHistory("minor", "S case 2 uf, balance right", this.root);
                console.log("right")
                //Man verschiebt ein Kind von w nach v
                if (right.children.length > 0) {
                    node.children.splice(0, 0, right.children[0]);
                    node.children.splice(0, 1);
                }
                //Man verschiebt einen Schlüssel von u nach v
                var pos = right.parent.findIdxPos(value)
                node.values.splice(0, 0, right.parent.values[pos]);
                right.parent.values.splice(pos, 1);
                //Man verschiebt einen Schlüssel von w nach u
                right.parent.values.splice(pos, 0, right.values[0]);
                right.values.splice(0, 1);
                right.color="#ADFF2F";
                node.color="#ADFF2F";
                this.pushToHistory("minor", "E case 2 uf, balance right", this.root);
            }
        }
    }
}


TwoThreeFour.prototype.random = function () {
    this.root = undefined;
    var number = parseInt(20);

    for (var i = 0; i < number; i++) {
        this.addInt(parseInt(Math.random() * 50, 10));
    }
    this.draw();
}

TwoThreeFour.prototype.example = function () {
    this.root = undefined;
    var numbers = [5, 3, 10, 12, 1, 6, 13, 14];

    for (var i = 0; i < numbers.length; i++) {
        this.addInt(numbers[i]);
    }
    this.draw();
}

TwoThreeFour.prototype.draw = function () {
    this.view.draw();
}

