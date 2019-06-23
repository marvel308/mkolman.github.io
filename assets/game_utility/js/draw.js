// works out the X, Y position of the click inside the canvas from the X, Y position on the page

function getPosition(mouseEvent, sigCanvas) {
    var rect = sigCanvas.getBoundingClientRect();
    return {
      X: mouseEvent.clientX - rect.left,
      Y: mouseEvent.clientY - rect.top
    };
}

function initializeDraw(sigCanvas) {
  // get references to the canvas element as well as the 2D drawing context
  var context = sigCanvas.getContext("2d");
  context.scale(2, 2);
  context.strokeStyle = "#444444";
  context.lineJoin = "round";
  context.lineWidth = 10;

  // This will be defined on a TOUCH device such as iPad or Android, etc.
  var is_touch_device = 'ontouchstart' in document.documentElement;

  if (is_touch_device) {
    // create a drawer which tracks touch movements
    var drawer = {
      isDrawing: false,
      touchstart: function(coors) {
        context.beginPath();
        context.moveTo(coors.x, coors.y);
        this.isDrawing = true;
      },
      touchmove: function(coors) {
        if (this.isDrawing) {
          context.lineTo(coors.x, coors.y);
          context.stroke();
        }
      },
      touchend: function(coors) {
        if (this.isDrawing) {
          this.touchmove(coors);
          this.isDrawing = false;
        }
      }
    };

    // create a function to pass touch events and coordinates to drawer
    function draw(event) {

      // get the touch coordinates.  Using the first touch in case of multi-touch
      var coors = {
        x: event.targetTouches[0].pageX,
        y: event.targetTouches[0].pageY
      };

      // Now we need to get the offset of the canvas location
      var obj = sigCanvas;

      if (obj.offsetParent) {
        // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
        do {
          coors.x -= obj.offsetLeft;
          coors.y -= obj.offsetTop;
        }
        // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
        // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
        while ((obj = obj.offsetParent) != null);
      }

      // pass the coordinates to the appropriate handler
      drawer[event.type](coors);
    }

    // attach the touchstart, touchmove, touchend event listeners.
    sigCanvas.addEventListener('touchstart', draw, false);
    sigCanvas.addEventListener('touchmove', draw, false);
    sigCanvas.addEventListener('touchend', draw, false);

    // prevent elastic scrolling
    sigCanvas.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);
  } else {

    // draws a line to the x and y coordinates of the mouse event inside
    // the specified element using the specified context
    function drawLine(mouseEvent) {

      var position = getPosition(mouseEvent, sigCanvas);

      context.lineTo(position.X, position.Y);
      context.stroke();
    }

    // draws a line from the last coordiantes in the path to the finishing
    // coordinates and unbind any event handlers which need to be preceded
    // by the mouse down event
    function finishDrawing(mouseEvent) {
      // draw the line to the finishing coordinates
      drawLine(mouseEvent);

      context.closePath();

      // remove event handlers
      sigCanvas.removeEventListener('mousemove', drawLine);
      sigCanvas.removeEventListener('mouseup', finishDrawing);
      sigCanvas.removeEventListener('mouseout', finishDrawing);
    }

    // start drawing when the mousedown event fires, and attach handlers to
    // draw a line to wherever the mouse moves to
    sigCanvas.addEventListener('mousedown', function(mouseEvent) {
      var position = getPosition(mouseEvent, sigCanvas);
      context.moveTo(position.X, position.Y);
      context.beginPath();

      // attach event handlers
      sigCanvas.addEventListener('mousemove', drawLine);
      sigCanvas.addEventListener('mouseup', finishDrawing);
      sigCanvas.addEventListener('mouseout', finishDrawing);
    });

  }
}

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
