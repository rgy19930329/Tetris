
(function( window, undefined ) {   

    var doc = document;

    var panel = doc.getElementById("panel");
    var gameSwitch = doc.getElementById("gameSwitch");
    var volume = doc.getElementById("volume");

    var topkey = doc.getElementById("topkey");
    var leftkey = doc.getElementById("leftkey");
    var rightkey = doc.getElementById("rightkey");
    var bottomkey = doc.getElementById("bottomkey");

    var handler = doc.getElementById("handler");

    var mask = doc.getElementById("mask");
    var topMask = doc.getElementById("topMask");
    var bottomMask = doc.getElementById("bottomMask");
    var topMaskOver = doc.getElementById("topMaskOver");
    var bottomMaskOver = doc.getElementById("bottomMaskOver");

    var progressBar = doc.getElementById("progressBar");

    var gameStart = doc.getElementById("gameStart");
    var leftTri = doc.getElementById("leftTri");
    var rightTri = doc.getElementById("rightTri");
    var curLevel = doc.getElementById("curLevel");
    var play = doc.getElementById("play");
    var scoreList = doc.getElementById("scoreList");

    var gameOver = doc.getElementById("gameOver");
    var levelOver = doc.getElementById("levelOver");
    var allScore = doc.getElementById("allScore");
    var ok = doc.getElementById("ok");
    var home1 = doc.getElementById("home1");

    var scoreListPanel = doc.getElementById("scoreListPanel");
    var thisLevel = doc.getElementById("thisLevel");
    var home2 = doc.getElementById("home2");

    var bgmusic = doc.getElementById("bgmusic");
    var fixup = doc.getElementById("fixup");
    var poprow = doc.getElementById("poprow");
    var over = doc.getElementById("over");
    //

    /////////////////////////////////////////
    //游戏资源（当resoure.length == 4时资源加载完毕）
    var resource = [];
    setTimeout(function(){
        progressBar.style.display = "none";
    }, 5000);

    //mycanvas
    var mycanvas = doc.getElementById("mycanvas");
    var ctx = mycanvas.getContext("2d");
    ctx.lineWidth = 0;
    ctx.fillStyle = "#59f";
    //canvas区域的宽度和高度
    var canvasWidth = mycanvas.width;
    var canvasHeight = mycanvas.height;

    //showNext
    var showNextCanvas = doc.getElementById("showNext");
    var ctxs = showNextCanvas.getContext("2d");

    //////////////////////////////
    function Game(level){
        //游戏声音
        this.volume = true;
        //分数
        this.score = 0;
        //睡眠时间（用来调节游戏速度）
        this.sleep = 1000;
        //游戏状态（true为活动状态，false为暂停状态）
        this.state = true;
        //关卡
        this.level = level || 1;
        //处于活动状态的砖块（具有唯一性）
        this.brick = null;
        //下一个砖块的类型type
        this.nextBrickType = 1;
        //记录器，记录画布中哪些地方已经被填充过了，该数组存放坐标的值（1或0）
        //已经填充value==1，否则value==0;
        this.record = [];
    }

    Game.prototype = {
        constructor: Game,
        //初始化数据并开启刷新线程
        init : function() {

            //初始化睡眠时间，从而达到控制速度的目的
            this.sleep = DataUtils.initSleep(this.level);

            //初始化记录器record
            this.record = DataUtils.initRecord(this.record);

            //初始化第一个砖块
            var type = DataUtils.getBrickType();
            this.brick = DataUtils.createBrick(type, 1);
            ViewUtils.paintBrick(this.brick);

            //在小画布上画下一个砖块
            this.nextBrickType = DataUtils.getBrickType();
            var brick = new Brick(this.nextBrickType, 1);
            brick = DataUtils.setBrickPosInSmall(brick, this.nextBrickType);
            ViewUtils.paintBrickInSmall(brick);

            //显示关卡与分数
            ViewUtils.showLevel(this.level);
            ViewUtils.showScore(this.score);
            
            if (typeof clock != "undefined") {
                clearInterval(clock);
            }
            var that = this;
            clock = setInterval(function(){
                that.update(1);
            }, this.sleep);

            //事件监听器
            EventUtils.ctrlDirc1(this);
            EventUtils.ctrlDirc2(this);
            EventUtils.gameSwitch(this);
            EventUtils.gameVolume(this);
        }
    }

    //砖块类
    function Brick(type, shapeFlag) {
        this.type = type || 1;
        this.shapeFlag = shapeFlag || 1;
        this.cell = ViewUtils.cell || 20;
        this.plist = [];
        this.core = {
            x: 180,
            y: 0
        };
        //标志该brick是否还处于活动状态
        this.isActive = true;

        this.init = function() {
            var node1, node2, node3;
            switch (this.type) {
                case 1:
                    if(this.shapeFlag == 1){
                        node1 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node3 = {
                            x: this.core.x + this.cell,
                            y: this.core.y + this.cell
                        };
                    }else if(this.shapeFlag == 2){
                        node1 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node2 = {
                            x: this.core.x + this.cell,
                            y: this.core.y
                        };
                        node3 = {
                            x: this.core.x + this.cell,
                            y: this.core.y - this.cell
                        };
                    }
                    break;
                    
                case 2:
                    if(this.shapeFlag == 1){
                        node1 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node2 = {
                            x: this.core.x + this.cell,
                            y: this.core.y
                        };
                        node3 = {
                            x: this.core.x - this.cell,
                            y: this.core.y + this.cell
                        };
                    }else if(this.shapeFlag == 2){
                        node1 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node3 = {
                            x: this.core.x - this.cell,
                            y: this.core.y - this.cell
                        };
                    }
                    break;

                case 3:
                    if(this.shapeFlag == 1){
                        node1 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x + this.cell,
                            y: this.core.y
                        };
                        node3 = {
                            x: this.core.x + this.cell * 2,
                            y: this.core.y
                        };
                    }else if(this.shapeFlag == 2){
                        node1 = {
                            x: this.core.x,
                            y: this.core.y - this.cell
                        };
                        node2 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node3 = {
                            x: this.core.x,
                            y: this.core.y + this.cell * 2
                        };
                    }
                    break;

                case 4:
                    node1 = {
                        x: this.core.x,
                        y: this.core.y + this.cell
                    };
                    node2 = {
                        x: this.core.x + this.cell,
                        y: this.core.y
                    };
                    node3 = {
                        x: this.core.x + this.cell,
                        y: this.core.y + this.cell
                    };
                    break;

                case 5:
                    if(this.shapeFlag == 1){
                        node1 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x + this.cell,
                            y: this.core.y
                        };
                        node3 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                    }else if(this.shapeFlag == 2){
                        node1 = {
                            x: this.core.x,
                            y: this.core.y - this.cell
                        };
                        node2 = {
                            x: this.core.x + this.cell,
                            y: this.core.y
                        };
                        node3 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                    }else if(this.shapeFlag == 3){
                        node1 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x + this.cell,
                            y: this.core.y
                        };
                        node3 = {
                            x: this.core.x,
                            y: this.core.y - this.cell
                        };
                    }else if(this.shapeFlag == 4){
                        node1 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x,
                            y: this.core.y - this.cell
                        };
                        node3 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                    }
                    break;

                case 6:
                    if(this.shapeFlag == 1){
                        node1 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x + this.cell,
                            y: this.core.y 
                        };
                        node3 = {
                            x: this.core.x - this.cell,
                            y: this.core.y + this.cell
                        };
                    }else if(this.shapeFlag == 2){
                        node1 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node2 = {
                            x: this.core.x,
                            y: this.core.y - this.cell
                        };
                        node3 = {
                            x: this.core.x - this.cell,
                            y: this.core.y - this.cell
                        };
                    }else if(this.shapeFlag == 3){
                        node1 = {
                            x: this.core.x + this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node3 = {
                            x: this.core.x + this.cell,
                            y: this.core.y - this.cell
                        };
                    }else if(this.shapeFlag == 4){
                        node1 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node2 = {
                            x: this.core.x,
                            y: this.core.y - this.cell
                        };
                        node3 = {
                            x: this.core.x + this.cell,
                            y: this.core.y + this.cell
                        };
                    }
                    break;

                case 7:
                    if(this.shapeFlag == 1){
                        node1 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x + this.cell,
                            y: this.core.y 
                        };
                        node3 = {
                            x: this.core.x + this.cell,
                            y: this.core.y + this.cell
                        };
                    }else if(this.shapeFlag == 2){
                        node1 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node2 = {
                            x: this.core.x,
                            y: this.core.y - this.cell
                        };
                        node3 = {
                            x: this.core.x - this.cell,
                            y: this.core.y + this.cell
                        };
                    }else if(this.shapeFlag == 3){
                        node1 = {
                            x: this.core.x + this.cell,
                            y: this.core.y
                        };
                        node2 = {
                            x: this.core.x - this.cell,
                            y: this.core.y
                        };
                        node3 = {
                            x: this.core.x - this.cell,
                            y: this.core.y - this.cell
                        };
                    }else if(this.shapeFlag == 4){
                        node1 = {
                            x: this.core.x,
                            y: this.core.y + this.cell
                        };
                        node2 = {
                            x: this.core.x,
                            y: this.core.y - this.cell
                        };
                        node3 = {
                            x: this.core.x + this.cell,
                            y: this.core.y - this.cell
                        };
                    }
                    break;
            }

            this.plist.length = 0;
            this.plist.push(this.core);
            this.plist.push(node1);
            this.plist.push(node2);
            this.plist.push(node3);
        };

    }
    //负责数据处理(M)
    var DataUtils = {
        //对象深拷贝
        deepCopy : function(p, c) {
            var c = c || {};
            for (var i in p) {
                if (typeof p[i] === 'object') {
                    c[i] = (p[i].constructor === Array) ? [] : {};
                    this.deepCopy(p[i], c[i]);
                } else {
                    c[i] = p[i];
                }
            }
            return c;
        },
        //初始化记录器record
        initRecord : function(record){
            var cell = ViewUtils.cell;
            for(var j = 0; j < canvasHeight; j = j + cell){
                for(var i = 0; i < canvasWidth; i = i + cell){
                    var x = i;
                    var y = j;
                    var obj = {
                        x : x,
                        y : y,
                        value : 0
                    }
                    record.push(obj);
                }
            }
            return record;
        },
        //根据关卡初始化sleep时间，间接控制速度
        initSleep : function(level){
            var sleep = 2000;
            switch(level){
                case 1: sleep = 1000;break;
                case 2: sleep = 750;break;
                case 3: sleep = 500;break;
                case 4: sleep = 250;break;
                case 5: sleep = 125;break;
                default: break;
            }
            return sleep;
        },
        //创造砖块
        createBrick : function(type, shapeFlag){
            var brick = new Brick(type, shapeFlag);
            brick.init();
            return brick;
        },
        //是否已经出了左边墙壁
        isGoneLeftOut : function(brick){
            var plist = brick.plist;
            var tempx = [];
            for(var i = 0, len = plist.length; i < len; i++){
                tempx.push(plist[i].x);
            } 
            var minx = Math.min.apply(null, tempx);
            if(minx == -brick.cell){
                return true;
            }
            return false;
        },
        //是否已经出了右边墙壁
        isGoneRightOut: function(brick) {
            var plist = brick.plist;
            var tempx = [];
            for (var i = 0, len = plist.length; i < len; i++) {
                tempx.push(plist[i].x);
            }
            var maxx = Math.max.apply(null, tempx);
            if (maxx == canvasWidth) {
                return true;
            }
            return false;
        },
        //是否已经出了底部地面[停下来]
        isGoneDownOut : function(brick){
            var plist = brick.plist;
            var tempy = [];
            for (var i = 0, len = plist.length; i < len; i++) {
                tempy.push(plist[i].y);
            }
            var maxy = Math.max.apply(null, tempy);
            if(maxy == canvasHeight){
                return true;
            }else{
                return false;
            }
        },
        //是否已经进入砖块堆中
        isInBricks : function(brick, record){
            var plist = brick.plist;

            for(var i = 0, len = plist.length; i < len; i++){
                var node = plist[i];
                if(this.isNodeInBricks(node, record)){
                    return true;
                }
            }
            return false;
        },
        //向下走一步
        goDown : function(brick, record){
            var tempBrick = this.deepCopy(brick);

            var x = brick.core.x;
            var y = brick.core.y + brick.cell;
            var core = {x: x, y: y};
            brick.core = core;
            brick.init();

            if(this.isGoneDownOut(brick) || this.isInBricks(brick, record)){
                tempBrick.isActive = false;
                return tempBrick;
            }

            return brick;
        },
        //向左走一步
        goLeft : function(brick, record){
            if(!brick.isActive){
                return brick;
            }

            var tempBrick = this.deepCopy(brick);

            var x = brick.core.x - brick.cell;
            var y = brick.core.y;
            var core = {x: x, y: y};
            brick.core = core;
            brick.init();

            if(this.isInBricks(brick, record)){
                return tempBrick;
            }

            if(this.isGoneLeftOut(brick)){
                return tempBrick;
            }
                
            return brick;

        },
        //向右走一步
        goRight : function(brick, record){
            if(!brick.isActive){
                return brick;
            }

            var tempBrick = this.deepCopy(brick);

            var x = brick.core.x + brick.cell;
            var y = brick.core.y;
            var core = {x: x, y: y};
            brick.core = core;
            brick.init();

            if(this.isInBricks(brick, record)){
                return tempBrick;
            }

            if(this.isGoneRightOut(brick)){
                return tempBrick;
            }
                
            return brick;
        },
        //切换形状
        changeShape : function(brick, record){
            if(!brick.isActive){
                return brick;
            }

            var tempBrick = this.deepCopy(brick);
            
            var shapeFlag = brick.shapeFlag;
            switch(brick.type){
                case 1:
                case 2:
                case 3:
                    shapeFlag++;
                    if(shapeFlag == 3){
                        shapeFlag = 1;
                    }
                    brick.shapeFlag = shapeFlag;
                    break;
                case 4:
                    break;
                case 5:
                case 6:
                case 7:
                    shapeFlag++;
                    if(shapeFlag == 5){
                        shapeFlag = 1;
                    }
                    brick.shapeFlag = shapeFlag;
                    break;
                default:
                    break;
            }
            brick.init();

            //判断改变之后的形状是否符合条件

            if(this.isInBricks(brick, record)){
                return tempBrick;
            }

            if(this.isGoneLeftOut(brick) || this.isGoneRightOut(brick)){
                return tempBrick;
            }

            return brick;
        },
        //用brick的坐标去设置record对应坐标中的value值为1
        setValueOfRecord : function(list, record, value){
            var plist = list;
            
            for(var i = 0, len1 = plist.length; i < len1; i++){
                for(var j = 0, len2 = record.length; j < len2; j++){
                    if(plist[i].x == record[j].x && plist[i].y == record[j].y){
                        record[j].value = value;
                    }
                }
            }

            return record;
        },
        //某一个节点是否属于recored中已经标记的部分
        isNodeInBricks : function(node, record){
            for(var i = 0, len = record.length; i < len; i++){
                if(record[i].value == 1){
                    if(node.x == record[i].x && node.y == record[i].y){
                        return true;
                    }
                }
            }
            return false;
        },
        //检测record横排是否可以消除，若有满足条件的行
        //返回该行所有坐标的列表，否则返回[]
        checkRow : function(record){
            var j, i;
            var cell = ViewUtils.cell;
            var cHeight = canvasHeight / cell;
            var cWidth = canvasWidth / cell;
            var temp = [];
            //从底部向顶部扫描
            for(j = cHeight - 1; j >= 0; j--){
                var temp = [];
                for(i = 0; i < cWidth; i++){
                    var index = j * cWidth + i;

                    if(record[index].value == 1){
                        var obj = record[index];
                        var node = {
                            x : obj.x,
                            y : obj.y
                        }
                        temp.push(node);
                    }
                }
                if(temp.length == cWidth){
                    return temp;
                }
            }
            return temp;
        },
        //让record中被消除行以上整体下移一个单元格
        //index为被消除行最左侧单元格在record中的索引值
        moveRecordDown : function(record, index){
            var cell = ViewUtils.cell;
            var cWidth = canvasWidth / cell;
            for(var i = index + cWidth - 1; i >= cWidth ; i--){
                record[i].value = record[i - cWidth].value;
            }
            return record;
        },
        //打印record矩阵
        printRecord : function(record){
            var str = "";
            for(var i = 0; i < record.length; i++){
                str = str + " " + record[i].value;
                if((i+1) % 20 == 0){
                    console.log(str);
                    str = "";
                }
            }
            console.log("---------------------------");
        },
        //判断游戏结束
        isGameOver : function(record){
            var list = record;
            list = list.filter(function(obj){
                return (obj.value == 1);
            });

            if(list.length == 0){
                return false;
            }

            list.sort(function(obj1, obj2){
                return obj1.y - obj2.y;
            });

            var obj = list[0];

            if(obj.y == 0){
                return true;
            }else{
                return false;
            }
        },
        //随机获取brick属性type
        getBrickType : function(){
            var order = [1, 2, 3, 4, 5, 6, 7];
            order.sort(function(a, b) {
                return Math.random() - 0.5;
            });
            return order[3];
        },
        //根据砖块类型设置砖块在小画布上的位置
        setBrickPosInSmall : function(brick, type){
            var core = {};
            switch(type){
                case 1: core = {x : 50, y : 20}; break;
                case 2: core = {x : 50, y : 20}; break;
                case 3: core = {x : 40, y : 20}; break;
                case 4: core = {x : 40, y : 20}; break;
                case 5: core = {x : 50, y : 20}; break;
                case 6: core = {x : 50, y : 20}; break;
                case 7: core = {x : 50, y : 20}; break;
                default: break;
            }
            brick.core = core;
            brick.init();
            return brick;
        }
    }

    //负责显示(V)
    var ViewUtils = {
        //单元格尺寸
        cell : 20,
        //大画布上绘制单元格
        paintCell : function(x, y){
            ctx.fillStyle = "#59f";
            ctx.fillRect(x, y, this.cell, this.cell);
            ctx.strokeStyle = "#eee";
            ctx.strokeRect(x, y, this.cell, this.cell);
        },
        //大画布上绘制异色单元格
        paintOtherCell : function(x, y){
            ctx.fillStyle = "orange";
            ctx.fillRect(x, y, this.cell, this.cell);
            ctx.strokeStyle = "#eee";
            ctx.strokeRect(x, y, this.cell, this.cell);
        },
        //大画布上绘制砖头
        paintBrick : function(brick){  
            var plist = brick.plist;
            for (var i = 0, len = plist.length; i < len; i++) {
                this.paintCell(plist[i].x, plist[i].y);
            }
        },
        //根据列表中的坐标信息绘制单元格集合
        paintList : function(list){
            for (var i = 0, len = list.length; i < len; i++) {
                this.paintOtherCell(list[i].x, list[i].y);
            }
        },
        //擦除大画布之前的画面
        clearCanvas : function(){
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        },
        //大画布上绘制record
        paintRecord : function(record){
            for(var i = 0, len = record.length; i < len; i++){
                var temp = record[i];
                if(temp.value == 1){
                    this.paintCell(temp.x, temp.y);
                }
            }
        },
        //小画布上绘制单元格
        paintCellInSmall : function(x, y){
            ctxs.fillStyle = "#59f";
            ctxs.fillRect(x, y, this.cell, this.cell);
            ctxs.strokeStyle = "#eee";
            ctxs.strokeRect(x, y, this.cell, this.cell);
        },
        //小画布上绘制砖头
        paintBrickInSmall : function(brick){  
            //擦除小画布之前的画面
            ctxs.clearRect(0, 0, canvasWidth, canvasHeight);
            var plist = brick.plist;
            for (var i = 0, len = plist.length; i < len; i++) {
                this.paintCellInSmall(plist[i].x, plist[i].y);
            }
        },
        //显示关卡
        showLevel : function(level){
            document.getElementById("level").innerHTML = level;
        },
        //显示分数
        showScore : function(score){
            document.getElementById("score").innerHTML = score;
        },
        //打开游戏窗口
        openWin : function(){
            topMask.style.display = "none";
            bottomMask.style.display = "none";
            topMaskOver.style.display = "block";
            bottomMaskOver.style.display = "block";
        },
        //关闭游戏窗口
        closeWin : function(){
            topMask.style.display = "block";
            bottomMask.style.display = "block";
            topMaskOver.style.display = "none";
            bottomMaskOver.style.display = "none";
        },
        //游戏结束后统计分数，让分数跳动显示
        setScore : function(score){
            this.step = this.step || 10;
            if(score > 100 && score <= 1000){
                this.step = 2;
            }else if(score > 1000 && score <= 5000){
                this.step = 10;
            }else if(score > 5000 && score <= 10000){
                this.step = 20;
            }else if(score > 10000){
                this.step = 50;
            }
            allScore.innerHTML = "0";
            this.s = this.s || 0;
            this.s += this.step;
            if(this.s > score){
                allScore.innerHTML = score;
                clearInterval(scoreClock);
                return;
            }
            allScore.innerHTML = this.s;
        }

    }

    //负责控制(C)
    var EventUtils = {
        //监听游戏方向事件（键盘按键）[监听器1]
        ctrlDirc1 : function(target){
            var that = target;
            
            document.addEventListener("keydown", function(event){
                if(!that.state){
                    return;
                }
                var evt = event || window.event;
                var code = evt.keyCode;
                switch(code){
                    //左
                    case 37:
                        that.brick = DataUtils.goLeft(that.brick, that.record);
                        console.log("左");
                        break;
                    //（上）切换形状
                    case 38:
                        that.brick = DataUtils.changeShape(that.brick, that.record);
                        if(!fixup.ended){
                            fixup.currentTime = 0;
                        }
                        fixup.play();
                        console.log("形状切换");
                        break;
                    //右
                    case 39:
                        that.brick = DataUtils.goRight(that.brick, that.record);
                        console.log("右");
                        break;
                    //向下加速    
                    case 40:
                        that.brick = DataUtils.goDown(that.brick, that.record);
                        console.log("下");
                        break;
                }

                that.update(2);
                
            });
        },
        //监听游戏方向事件（屏幕按键）[监听器2]
        ctrlDirc2 : function(target){
            var that = target;
            
            leftkey.addEventListener("click", function(event){
                if(!that.state){
                    return;
                }
                that.brick = DataUtils.goLeft(that.brick, that.record);
                that.update(2);
            });

            topkey.addEventListener("click", function(event){
                if(!that.state){
                    return;
                }
                if(!fixup.ended){
                    fixup.currentTime = 0;
                }
                fixup.play();
                that.brick = DataUtils.changeShape(that.brick, that.record);
                that.update(2);
            });

            rightkey.addEventListener("click", function(event){
                if(!that.state){
                    return;
                }
                that.brick = DataUtils.goRight(that.brick, that.record);
                that.update(2);
            });

            bottomkey.addEventListener("click", function(event){
                if(!that.state){
                    return;
                }
                that.brick = DataUtils.goDown(that.brick, that.record);
                that.update(2);
            });

        },
        //监听游戏开关事件
        gameSwitch : function(target){
            var that = target;

            gameSwitch.addEventListener("click", function(event){
                console.log(gameSwitch.innerHTML + "yyy");
                if(gameSwitch.innerHTML == "pause"){
                    clearInterval(clock);
                    that.state = false;
                    gameSwitch.innerHTML = "continue";
                    //
                    ViewUtils.closeWin();
                    handler.style.zIndex = "0";
                    //
                    console.log("pause");
                    bgmusic.pause();
                    alert("游戏暂停中……");
                }else if(gameSwitch.innerHTML == "continue"){
                    clock = setInterval(function(){
                        that.update(1);
                    }, that.sleep);
                    that.state = true;
                    gameSwitch.innerHTML = "pause";
                    //
                    ViewUtils.openWin();
                    handler.style.zIndex = "1";
                    //
                    bgmusic.play();
                    console.log("continue");
                }
            }, false);
        },
        //监听游戏声音开关
        gameVolume : function(target){
            var that = target;
            
            volume.addEventListener("click", function(){
                if(that.volume){
                    volume.style.backgroundPosition = "-50px 0";
                    that.volume = false;
                    //
                    bgmusic.pause();
                    fixup.volume = 0;
                    poprow.volume = 0;
                    over.volume = 0;
                }else{
                    volume.style.backgroundPosition = "0 0";
                    that.volume = true;
                    //
                    bgmusic.currentTime = 0;
                    bgmusic.play();
                    fixup.volume = 1;
                    poprow.volume = 1;
                    over.volume = 1;  
                }
            }, false);
        },
        //监听游戏前后的事件
        gameStartAndOver : function(){

            //主页开始游戏
            play.addEventListener("click", function(){
                gameStart.style.display = "none";
                topMask.style.display = "none";
                bottomMask.style.display = "none";
                topMaskOver.style.display = "block";
                bottomMaskOver.style.display = "block";
                handler.style.zIndex = "1";
                panel.style.zIndex = "1";
                //开启新游戏
                var level = curLevel.innerHTML;
                var game = new Game(parseInt(level));
                game.init();
                //
                bgmusic.currentTime = 0;
                bgmusic.play();
            }, false);

            //主页选择关卡（减小）
            leftTri.addEventListener("click", function() {
                var level = curLevel.innerHTML;
                level--;
                if (level == 0) {
                    level = 1;
                }
                curLevel.innerHTML = level;
            }, false);

            //主页选择关卡（增大）
            rightTri.addEventListener("click", function() {
                var level = curLevel.innerHTML;
                level++;
                if (level == 6) {
                    level = 5;
                }
                curLevel.innerHTML = level;
            }, false);

            //从主页跳转到scoreListPanle
            scoreList.addEventListener("click", function() {
                scoreListPanel.style.display = "block";
                thisLevel.innerHTML = curLevel.innerHTML;
                gameStart.style.display = "none";
                //加载高分榜
                var level = $("#thisLevel").html();
                InterActionUtils.showHighList(level);
            }, false);

            //从scoreListPanle返回主页
            home2.addEventListener("click", function() {
                scoreListPanel.style.display = "none";
                gameStart.style.display = "block";
            }, false);

            //从gameOver返回主页
            home1.addEventListener("click", function() {
                gameOver.style.display = "none";
                gameStart.style.display = "block";
            }, false);

            //提交姓名和分数并跳转到主页
            ok.addEventListener("click", function(){
                gameOver.style.display = "none";
                gameStart.style.display = "block";
                //加载高分榜
                var level = $("#levelOver").html();
                var name = $("#nickName").val();
                var score = $("#allScore").html();
                if(!name){
                    return;
                }
                InterActionUtils.submitScore(level, name, score);
            }, false);
        },
        //监听游戏资源加载情况（主要是音乐）
        gameResource : function(){
            bgmusic.addEventListener("canplaythrough", function() {
                console.log("bgmusic 完成");
                resource.push("bgmusic");
                if(resource.length == 4){
                    setTimeout(function(){
                        progressBar.style.display = "none";
                    }, 2000);
                }
            }, false);

            fixup.addEventListener("canplaythrough", function() {
                console.log("fixup 完成");
                resource.push("fixup");
                if(resource.length == 4){
                    setTimeout(function(){
                        progressBar.style.display = "none";
                    }, 2000);
                }
            }, false);

            poprow.addEventListener("canplaythrough", function() {
                console.log("poprow 完成");
                resource.push("poprow");
                if(resource.length == 4){
                    setTimeout(function(){
                        progressBar.style.display = "none";
                    }, 2000);
                }
            }, false);

            over.addEventListener("canplaythrough", function() {
                console.log("over 完成");
                resource.push("over");
                if(resource.length == 4){
                    setTimeout(function(){
                        progressBar.style.display = "none";
                    }, 2000);
                }
            }, false);
        }
    }

    //前后端数据交互工具
    var InterActionUtils = {
        //异步加载并显示高分榜
        showHighList : function(level){
            $("#showList").empty();
            $.ajax({
                type: "post",
                url: "http://kylinresume.sinaapp.com/games/fourth/pages/TreatGetScoreList.php",
                data: {level: level},
                dataType: "json",
                success: function(data) {
                    $.each(data, function(i, item) {
                        $("#showList").append(
                            '<tr>' +
                            '<td>' + (i + 1) + '</td>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + item.score + '</td>' +
                            '</tr>'
                        );
                    });
                },
                error: function(data) {
                    console.log("失败" + data);
                }
            });
        },

        //提交姓名与分数
        submitScore : function(level, name, score){
            $.ajax({
                type: "post",
                url: "http://kylinresume.sinaapp.com/games/fourth/pages/TreatUpdateScoreList.php",
                data: {level: level, name: name, score: score},
                dataType: "text",
                success: function(msg) {
                    console.log(msg);
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
        }

    }

    Game.prototype.update = function(flag){
        //每次重新绘制之前都要擦除之前的画面
        ViewUtils.clearCanvas();

        //这个标志用来判断该次update操作是来自定时器还是手动操作
        //二者的应对方式不一样
        if(flag == 1){
            //向下走一步
            this.brick = DataUtils.goDown(this.brick, this.record);
        }

        //一个砖块落地
        if(!this.brick.isActive){
            this.record = DataUtils.setValueOfRecord(this.brick.plist, this.record, 1);
            
            this.brick = DataUtils.createBrick(this.nextBrickType, 1);

            //在小画布上画下一个砖块
            this.nextBrickType = DataUtils.getBrickType();
            var brick = new Brick(this.nextBrickType, 1);
            brick = DataUtils.setBrickPosInSmall(brick, this.nextBrickType);
            ViewUtils.paintBrickInSmall(brick);

            this.score += 10;
            //着陆音效
            if(!fixup.ended) {
                fixup.currentTime = 0;
            }
            fixup.play();
        }

        //游戏结束
        if(DataUtils.isGameOver(this.record)){
            clearInterval(clock);
            this.state = false;
            //
            ViewUtils.closeWin();
            handler.style.zIndex = "0";
            panel.style.zIndex = "0";
            gameOver.style.display = "block";
            levelOver.innerHTML = this.level;
            //
            allScore.innerHTML = "0";
            var score = document.getElementById("score").innerHTML;
            console.log(score);
            scoreClock = setInterval(function(){
                ViewUtils.setScore(score);
            }, 10);
            //
            bgmusic.pause();
            over.play();
            return;
        }

        //绘制具体的brick
        ViewUtils.paintBrick(this.brick);
        //显示分数
        ViewUtils.showScore(this.score);
        //绘制record
        ViewUtils.paintRecord(this.record);   

        var row = DataUtils.checkRow(this.record);  
        //整行消除
        if(row.length > 0){
            //消除之前将整行绘制出来
            ViewUtils.paintList(row);
            //消除操作
            this.record = DataUtils.setValueOfRecord(row, this.record, 0);
            this.record = DataUtils.moveRecordDown(this.record, row[0].y);
            this.score += 100;
            //
            poprow.play();
        }
    }  

    //游戏资源加载事件监听器
    EventUtils.gameResource();
    //游戏前后的事件监听器
    EventUtils.gameStartAndOver();

})(window);  