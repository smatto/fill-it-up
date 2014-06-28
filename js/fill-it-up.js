//set up canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//declare globals
var circles = [];
var baseSize = 5;
var level = 1;
var ballsLeft = 10;
var ballsUsed = 0;
var lastBallsUsed = 0;

//create circle
function create(location) {
    circles.push({
        x: location.x,
        y: location.y,
        radius: baseSize,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
}

//get random number between 2 nums
function randNum(min, max) {
    return Math.random() * (max - min) + min;
}

//clear board and create three random circles to start
function reset() {
    level=1;
    ballsLeft = 5 + level;
    circles.length = 0;
    for (var i=0;circles.length<level+2;i++){
    var initLoc = {
        x: randNum(baseSize, (canvas.width - baseSize)),
        y: randNum(baseSize, (canvas.height - baseSize))
    };
    if (!isOnCircle(initLoc)&&!isAtEdge(initLoc)){
        create(initLoc);
        circles[i].radius=(baseSize*randNum(0.5,5));
        }
    }
    draw();
    updateInfo();
}

function levelUp() {
    lastBallsUsed = 0;
    level+=1;
    ballsLeft = 5 + level;
    ballsUsed = 0;
    circles.length = 0;
    for (var i=0;circles.length<level+2;i++){
    var initLoc = {
        x: randNum(baseSize, (canvas.width - baseSize)),
        y: randNum(baseSize, (canvas.height - baseSize))
    };
    if (!isOnCircle(initLoc)&&!isAtEdge(initLoc)){
        create(initLoc);
        circles[i].radius=(baseSize*randNum(0.5,5));
        }
    }
    draw();
    updateInfo();
    document.getElementById("ballsLeft").innerHTML = "LEVEL UP!";
}

//figure out mouse position
var rect = document.getElementById("canvas").getBoundingClientRect();
// Get canvas offset on page
var offset = {
    x: rect.left,
    y: rect.top
};

//check if on another circle
function isOnCircle(a) {
    var i = 0,
        l = circles.length,
        x, y, d, c;
    for (; i < l; ++i) {
        c = circles[i];
        if (a == c) continue;
        x = a.x - c.x;
        y = a.y - c.y;
        d = (a.radius || 2) + c.radius;
        if (x * x + y * y <= d * d) {
            return true;
        }
    }
    return false;
}
//check if circle is touching sides
function isAtEdge(a) {
    if ((a.x-a.radius <= 0 || a.x+a.radius >= rect.width-4) || (a.y-a.radius <= 0) || (a.y+a.radius >= rect.height-4)) {
        return true;
    }
    return false;
}

// draw all circles
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < circles.length; i++) {
        var p = circles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
}

//make last drawn circle 1px bigger
function grow() {
    var a = circles[circles.length - 1];
    if (!isOnCircle(a)&&!isAtEdge(a)) {
        a.radius += 1;
    }
}

//find percentage of canvas filled in
var totalSpace = canvas.width * canvas.height;
var totalFilled = function () {
    var total = 0;
    for (var i = 0; i < circles.length; i++) {
        var p = circles[i];
        total += Math.PI * Math.pow(p.radius, 2);
    }
    return total;
};

    function findPercentage() {
        return (totalFilled() / totalSpace) * 100;
    }

    function updateInfo() {
        var percentage = findPercentage();
        document.getElementById("percentage").innerHTML = "You've filled in " + percentage.toFixed(1) + "%";
        document.getElementById("level").innerHTML = "Level " + (level);
        document.getElementById("levelUpPercent").innerHTML = levelUpPercent();
        document.getElementById("ballsLeft").innerHTML = "You have "+ballsLeft+" balls left.";
        document.getElementById("ballsUsed").innerHTML = "On level "+(level-1)+ ", you used "+(lastBallsUsed)+" balls.";
        if (ballsLeft<1){
            reset();
            document.getElementById("ballsLeft").innerHTML = "GAME OVER!";
        }
        if (level == 1){
            document.getElementById("ballsUsed").innerHTML = "";
        }
    }

//put this outside function to make it global so we can stop it later
var growLoop;

canvas.onmousedown = function (e) {
    var location = {
        x: e.pageX - offset.x,
        y: e.pageY - offset.y
    };

    if (!isOnCircle(location)) {
        create(location);
        ballsLeft -=1;
        ballsUsed +=1;
        draw();
        updateInfo();
        growLoop = setInterval(animate, 30);
    }
};

function levelUpPercent() { 
    if (level<9){return 45+(level*5);}
    else return 81+level;
    }

canvas.onmouseup = function () {
    clearInterval(growLoop);
    if (findPercentage()>levelUpPercent()){
        levelUp();
        }
};

function saveScore(){
    $.ajax({
      url:"saveScore.php",
      data: "testData" ,
      success: function(data) {
          console.log("saved" + data);
      }
    });
}

//set button behavior
window.onload = function () {
    document.getElementById('resetButton').onclick = reset;
    document.getElementById('saveButton').onclick = saveScore;
};
//do all the stuff
reset();
var animate = function () {
    grow();
    draw();
    updateInfo();
};
