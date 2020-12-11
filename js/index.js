
function Main(td, tr, minesNum) {

    this.td = td;         
    this.tr = tr;
    this.minesNum = minesNum;

    this.allRight = false;  
    this.squares = [];     
    this.tds = [];        
    this.remainingMines = minesNum; 
    this.parsent = document.querySelector(".gameBox");
}



Main.prototype.createTable = function () {

    var This = this;  

    var table = document.createElement("table");

    for (let i = 0; i < this.tr; i++) {

        var domTr = document.createElement("tr");

        this.tds[i] = [];   

        for (let j = 0; j < this.td; j++) {

            var domTd = document.createElement("td");

            domTd.pos = [i, j];  

            domTd.onmousedown = function () {
                This.play(event, this);
            }

            

            this.tds[i][j] = domTd;
            domTr.appendChild(domTd);

        }
        table.appendChild(domTr);
    }
    this.parsent.innerHTML = "";   
    this.parsent.appendChild(table);
}


Main.prototype.randomMines = function () {

    var square = new Array(this.tr * this.td);   

    for (let i = 0; i < square.length; i++) {   

        square[i] = i;

    }
    square.sort(function () {
        return (0.5 - Math.random());
    });

    return (square.splice(0, this.minesNum));    
}


Main.prototype.play = function (ev, obj) {

    var This = this;

    if (ev.which == 1) {               
        var curSquare = this.squares[obj.pos[0]][obj.pos[1]]; 

        

        var num = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

        if (curSquare.type == "number") {       

            obj.innerHTML = curSquare.value;     
            obj.className = num[curSquare.value];

            if (curSquare.value == 0) {       

                obj.innerHTML = "";  

               
                function getAllZero(square) {

                    var around = This.getAround(square); 

                    for (let i = 0; i < around.length; i++) {

                        var x = around[i][0];
                        var y = around[i][1];

                        This.tds[x][y].className = num[This.squares[x][y].value]; 

                       

                        if (This.squares[x][y].value == 0) { 

                         
                            if (!This.tds[x][y].check) {

                                

                                This.tds[x][y].check = true;  

                                getAllZero(This.squares[x][y]); 

                            }

                        }
                        else {
                            This.tds[x][y].innerHTML = This.squares[x][y].value;
                        }

                    }
                }
                getAllZero(curSquare);
            }

        }
        else {
            This.gameOver(obj);
        }
    }
    if (ev.which == 3) {         
       
        if (obj.className && obj.className != "flag") {
            return;
        }

        

        obj.className = (obj.className == "flag" ? "" : "flag");

        
        if (this.squares[obj.pos[0]][obj.pos[1]].type == "mines") {

            this.allRight = true;

        }
        else {
            this.allRight = false; 
        }

        
        if (obj.className == "flag") {

            this.minesNum.innerHTML = (--this.remainingMines);
        }
        else {
            this.minesNum.innerHTML = (++this.remainingMines);
        }

        if (this.remainingMines == 0) {

           
            if (this.allRight) {
                
                alert("大神，恭喜你，成功");
            }
            else {
                alert("笨蛋，恭喜你，失败");

                this.gameOver();

            }
        }

    }
}


Main.prototype.gameOver = function (clickTd) {

    
    for (let i = 0; i < this.tr; i++) {
        for (let j = 0; j < this.td; j++) {

            if (this.squares[i][j].type == "mines") {
                this.tds[i][j].className = "mines";
            }
            this.tds[i][j].onmousedown = null;

        }

    }
    clickTd.className = "click";

}



Main.prototype.getAround = function (square) {

    var x = square.x;
    var y = square.y;
    var res = [];    
    /*
        x-1,y-1        x,y-1          x+1,y-1

        x-1,y          x,y            x+1,y

        x-1,y+1        x,y+1          x+1,y+1

     */

    for (let i = x - 1; i <= x + 1; i++) {

        for (let j = y - 1; j <= y + 1; j++) {
            
            if (
                i < 0 ||
                i > this.td - 1 ||   
                j < 0 ||
                j > this.tr - 1 ||
                (i == x && j == y)   
            ) {
                continue;
            }

            res.push([j, i]);   

        }

    }
    return res;
}


Main.prototype.updateNum = function () {

    var This = this;
    
    for (let i = 0; i < this.tr; i++) {
        for (let j = 0; j < this.td; j++) {

            if (this.squares[i][j].type == "number") { continue; }

            var num = this.getAround(this.squares[i][j]);

            num.forEach(function (val, key) {

                /*
                    num是雷周围的数字坐标
                    num[0] = [1,0];
                    num[0][0] = 1 行坐标
                    num[0][1] = 0 列坐标
                 */
                This.squares[num[key][0]][num[key][1]].value += 1; 

            });
        }
    }
}



Main.prototype.init = function () {

    var rn = this.randomMines(); 
    var n = 0;

    for (let i = 0; i < this.tr; i++) {

        this.squares[i] = [];

        for (let j = 0; j < this.td; j++) {

            if (rn.indexOf(n++) != -1) {         

                this.squares[i][j] = { type: "mines", x: j, y: i };
            }
            else {
                this.squares[i][j] = { type: "number", x: j, y: i, value: 0 }
            }

        }

    }
    this.parsent.oncontextmenu = function () {       
        return false;
    }
    this.updateNum();
    this.createTable();

    this.minesNum = document.querySelector(".minesNum");
    this.minesNum.innerHTML = this.remainingMines;

}

var btns = document.querySelectorAll(".btns button");

var main = null; 

var prebtn = 0; 

var arr = [[10, 10, 10], [20, 20, 60], [30, 30, 99]];


for (let i = 0; i < btns.length - 1; i++) {

    btns[i].onclick = function () {

        btns[prebtn].className = "";   

        this.className = "active";   
        main = new Main(...arr[i]); 

        main.init();

        prebtn = i;
    }

}


btns[0].onclick();

btns[3].onclick = function () {  
    window.location.reload();
    main.init();
}


