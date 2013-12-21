//set up canvas
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

//init circles array
var circles = [];

//create circle
function create(location) {
    circles.push({
        x: location.x,
        y: location.y,
        radius: 10,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
}

//figure out mouse position
var rect = document.getElementById("canvas").getBoundingClientRect();
// Get canvas offset on page
var offset = {
    x: rect.left,
    y: rect.top
};
window.onmousedown = function (e) {
    // IE fixer
    e = e || window.event;
    // get event location on page offset by canvas location
    var location = {
        x: e.pageX - offset.x,
        y: e.pageY - offset.y
    };

    create(location);
};

function isColliding(a, b) {
    return Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2) <= Math.pow((a.radius + b.radius), 2);
}

// draw all balls
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

function updateInfo() {
    document.getElementById("percentage").innerHTML = "You've filled in" + circles.length;
    }

    //do all the things
    function tick() {
        draw();
        updateInfo();
    }
// set frames-per-second for timer
var FPS = 30;
//do it all at this speed
setInterval(tick, 1000 / FPS);