var Game = (function ($) {

    var ballSize = 48;
    var size = 48;
    var fieldSize;
    var level;
    var rad = 25;
    var topPosition = 160;
    var bottomPosition = 445;
    var leftPosition = 20;
    var rightPosition = 310;
    var screenSize = 280;
    
    var y;
    var x;
    var vLimit = 9.8;
    
    var min = 0;
    var max; 
    
    var colorArray = ['', '#fff', '#b1d1e0', '#b0d4a0', '#d4b597', '#666'];
    
    var multiplier = 18;
    
    var hero;
    var heroHP = 5;
    
    var bg;
    var main;
    var edge;
    var damegeDur = 0;
    
    var score;
    var goalCount;
    var goal = 0;
    
    var heart = [];
    var heartData = [];
    
    var item = [];
    var itemData = [];
    
    var trap = [];
    var trapData = [];
    
    var gameOver = false;

    var preventBehavior = function(e) { 
        e.preventDefault();
    }
        
    function updateCoordinates(target, x, y) {
        target.style.left = (leftPosition+x-size/2).toString() + 'px';
        target.style.top = (topPosition+y-size/2).toString() + 'px';
        adjustAlpha(target, x, y);
        checkCollision(target, x, y);
    }
    
    function updateUI() {
        var left; 
        if (x > fieldSize/2) {
            left = fieldSize - x -280-120;
            if (left > -280) left = -280;
        }
        else if (x < fieldSize/2) {
            left = -x-160;
            if (left < -280) left = -280;
        }
        
        var top; 
        if (y > fieldSize/2) {
            top = fieldSize - y -280-120;
            if (top > -280) top = -280;
        }
        else if (y < fieldSize/2) {
            top = -y-140;
            if (top < -280) top = -280;
        }
        
        edge.style.backgroundPosition = left + 'px ' + top + 'px';
        
        score.innerHTML = goal + '/' + goalCount;
        
        if (heroHP > 5) heroHP = 5; 
        
        document.getElementById('hp1').style.opacity = heroHP;
        document.getElementById('hp2').style.opacity = heroHP-1;
        document.getElementById('hp3').style.opacity = heroHP-2;
        document.getElementById('hp4').style.opacity = heroHP-3;
        document.getElementById('hp5').style.opacity = heroHP-4;        
        
        if (heroHP <= 0) {
            document.getElementById('info').innerHTML = 'GAMEOVER'; 
            gameOver = true;
        }
    }
    
    function adjustAlpha(target, cx, cy) {
        var xmin = size/2 - 7;
        var xmax = screenSize - size/2 + 5;
        var ymin = size/2;
        var ymax = screenSize - size/2 + 5;
        var alpha = 1;
        var dist = 18;
        
        if (cx < xmin) {
            test = (cx)/dist;
            if (test < alpha) alpha = test;
        }
        if (cx > xmax) {
            test = (xmax+dist-cx)/dist;
            if (test < alpha) alpha = test;
        }
        if (cy < ymin) {
            test = (cy-ymin+dist)/dist;
            if (test < alpha) alpha = test;
        }
        if (cy > ymax) {
            test = (ymax+dist-cy)/dist;
            if (test < alpha) alpha = test;
        }
        
        if (alpha < 0) alpha = 0;
        
        if (alpha == 0) target.style.display = 'none';
        else target.style.display = 'inherit';
        
        target.style.opacity = alpha;
    }
    
    function checkCollision(target, cx, cy)
    {
        var type = target.id.slice(0, 3);
            
            
            centerX = 140;
            centerY = 140;
            if (cx > centerX - 30 && cx < centerX + 30 
                && cy > centerY - 30 && cy < centerY + 30) {
                
                if (type == 'hea') {
                    heartData[ parseInt( target.id.slice(5, target.id.length) )][0] = -1000;
                    heroHP++;
                }
                else if (type == 'ite' ) {
                    itemData[ parseInt( target.id.slice(4, target.id.length) )][0] = -1000;
                    goal++;
                    if (goal >= goalCount) 
                    {   
                        level++;
                        startGame(level);
                        goal = 0;
                        navigator.notification.blink(4, 0xffffff);
                    }
                    
                }
                else if (type == 'tra' && damegeDur == 0) {
                    navigator.notification.vibrate(250);
                    damegeDur = 20;
                    heroHP--;
                }
            }
    }
    
    function updateSprites() {
        bg.style.backgroundPosition =  (-x+leftPosition).toString() + 'px ' + (-y+topPosition).toString() + 'px';
        updateMultipleSpriteCoordinates(heart, heartData);
        updateMultipleSpriteCoordinates(trap, trapData);
        updateMultipleSpriteCoordinates(item, itemData);
        
    }
    
    function updateMultipleSpriteCoordinates(array, dataArray) {
        for (var i = 0; i < array.length; i++)
        {
            var id = array[i];
            var element = document.getElementById(id);
            var cx = dataArray[i][0];
            var cy = dataArray[i][1];
            updateCoordinates(element, (-x + cx), (-y + cy));
        }
    }
    
    function startGame(level)
    {
        fieldSize = level*500 + 500;
        max = fieldSize;
        x = fieldSize/2;
        y = fieldSize/2;
        goalCount = level*10;
        
        heartNum = 10;
        trapNum = 5 + 30*level + 20*(level-1);
        itemNum = 15 + 10*level;
        
        randomPlacement('heart', heart, heartData, heartNum);
        randomPlacement('trap', trap, trapData, trapNum );
        randomPlacement('item', item, itemData, itemNum);
        
        
        updateSprites();
        updateUI();
        bg.style.backgroundColor = colorArray[level];
    }
    
    function randomPlacement(className, array, dataArray, len)
    {
        for (var i = 0; i < len; i++)
        {
            var element = document.createElement( 'div');
            var x = getRandom();
            var y = getRandom();
            var id =  className + i.toString();
            element.className = className;
            element.id = id;
            main.appendChild(element);
            array[i] = id;
            dataArray[i] = [x, y];
        }
    }
    
    function getRandom()
    {
        const offset = 30;
        const test = fieldSize/2 + +screenSize/2;
        var value = Math.random()*(fieldSize)+screenSize/2;
        if (value > test -offset && value < test + offset) return getRandom();
        else return value;
    }
        
    return {
        init: function () {
            document.addEventListener("touchmove", preventBehavior, false);
            hero = document.getElementById('hero');
            bg = document.getElementById('container');
            main = document.getElementById('actionLayer');
            score = document.getElementById('score');
            edge = document.getElementById('edge');
            hero.style.left = (leftPosition+screenSize/2-size/2).toString() + 'px';
            hero.style.top = (topPosition+screenSize/2-size/2).toString() + 'px';
            level = 1;  
            
            startGame(level);
        },

        watchAccel: function () {
            var suc = function (a) {
            
            if (gameOver == true) return;
            
            x += a.x*multiplier;
            y -= a.y*multiplier;
                        
            if (y > max) {y = max;}
            if (y < min) {y = min;}
            if (x > max) {x = max;}
            if (x < min) {x = min;}
            
            var o = Math.round(a.y*1000);
            var a = Math.round(a.x*1000);
            
            var rad = Math.atan2(a, o );
            rad = (180/Math.PI)*rad;
            
            if (rad < 67.5 && rad >= 0 || rad >-67.5 && rad < 0)
                hero.className = 'heroB';
            else if (rad >= 67.5 && rad < 112.5)
                hero.className = 'heroR';
            else if (rad < -67.5 && rad > -112.5)
                hero.className = 'heroL';
            else if (rad >= 112.5 && rad < 157.5)
                hero.className = 'heroFR';
            else if (rad <= -112.5 && rad > -157.5)
                hero.className = 'heroFL';
            else
                hero.className = 'heroF';
            
            
            updateSprites();
            updateUI();
            
            if (damegeDur > 0) damegeDur--;
            
        };
        var fail = function(){};
        var opt = {};
        opt.frequency = 50;
        timer = navigator.accelerometer.watchAcceleration(suc,fail,opt);
        }
    };

}(window));
