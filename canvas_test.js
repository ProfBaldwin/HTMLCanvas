const bottomCanvas = document.getElementById("bottomCanvas");
const activeCanvas = document.getElementById("activeCanvas");
const bottomCtx = bottomCanvas.getContext("2d");
const activeCtx = activeCanvas.getContext("2d");

const PRESSURE_DEAD_ZONE = 0.05;

let drawing = false;

let pathData;
let numpoints = 0;
function Point(x, y) {
    this.x = x;
    this.y = y;
}
let p1, p2;

activeCtx.lineWidth = 3;
activeCtx.lineCap = "round";
activeCtx.lineJoin = "round";
activeCtx.strokeStyle = "#E5E5E5";
bottomCtx.lineWidth = 3;
bottomCtx.lineCap = "round";
bottomCtx.lineJoin = "round";
bottomCtx.strokeStyle = "#E5E5E5";


function moveToSVG(point) {
    return ("M " + point.x + " " + point.y);
}


function quadraticCurveToSVG(ctrlPoint, point) {
    return ("\nQ " + ctrlPoint.x + " " + ctrlPoint.y + ", " + point.x + " " + point.y);
}


function lineToSVG(point) {
    return ("\nL " + point.x + " " + point.y);
}

function initPoint(point) {
    drawing = true;

    // Offset to guarantee unique points
    point.x -= 0.01; point.y -= 0.01;

    p2 = point;
    p1 = p2;
    numpoints = 1;

    pathData = moveToSVG(p2);
}

function addPoint(point) {
    if ((p1.x != point.x || p1.y != point.y) || (p2.x != point.x || p2.y != point.y)) {
        p1 = p2; p2 = point;
        ++numpoints;

        if (numpoints >= 3) {
            const midPoint = new Point(0.5*(p1.x + p2.x), 0.5*(p1.y + p2.y));
            pathData += quadraticCurveToSVG(p1, midPoint);

            activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
            activeCtx.stroke(new Path2D(pathData));
        }
    }
}


function endPoint(point) {
    ++numpoints;
    point.x += 0.01; point.y += 0.01;

	pathData += lineToSVG(point);
    activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
    bottomCtx.stroke(new Path2D(pathData));

    drawing = false;
}


window.addEventListener("pointerdown", (event) => {
    initPoint(new Point(event.pageX, event.pageY));
});



window.addEventListener("pointermove", (event) => {
    /*
    // Start the path
    if (event.pressure > PRESSURE_DEAD_ZONE) {

        if (!drawing) {
            initPoint(new Point(event.pageX, event.pageY));
        // Continue the path
        } else {
            addPoint(new Point(event.pageX, event.pageY));
        }

    // End the path if pressure too low
    } else {
        if (drawing) {
            endPoint(new Point(event.pageX, event.pageY));
    activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
    bottomCtx.stroke(new Path2D(pathData));
            console.log(pathData);
        }
    }
	*/
	if (drawing) {
		addPoint(new Point(event.pageX, event.pageY));
	}
	
	if (drawing) {
        const events = event.getCoalescedEvents(); // Get high-precision data
		console.log("\n");
        for (const e of events) {
            console.log(`x: ${e.clientX}, y: ${e.clientY}, pressure: ${e.pressure}`);
        }
    }
	
});           

window.addEventListener("pointerup", (event) => {
    if (drawing) {
        endPoint(new Point(event.pageX, event.pageY));
    }
});

