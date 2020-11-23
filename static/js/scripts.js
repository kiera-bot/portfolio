var canvas, gl; // canvas and webgl context

var shaderScript;
var shaderSource;
var vertexShader; // Vertex shader.  Not much happens in that shader, it just creates the vertex's to be drawn on
var fragmentShader; // this shader is where the magic happens. Fragment = pixel.  Vertex = kind of like "faces" on a 3d model.  
var buffer;


/* Variables holding the location of uniform variables in the WebGL. We use this to send info to the WebGL script. */
var locationOfTime;
var locationOfResolution;

var startTime = new Date().getTime(); // Get start time for animating
var currentTime = 0;

function init() {
	// standard canvas setup here, except get webgl context
	canvas = document.getElementById('glscreen');
	gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	
	// give WebGL it's viewport
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	// kind of back-end stuff
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(
		gl.ARRAY_BUFFER, 
		new Float32Array([
			-1.0, -1.0, 
			1.0, -1.0, 
			-1.0,  1.0, 
			-1.0,  1.0, 
			1.0, -1.0, 
			1.0,  1.0]), 
		gl.STATIC_DRAW
	); // ^^ That up there sets up the vertex's used to draw onto. I think at least, I haven't payed much attention to vertex's yet, for all I know I'm wrong.

	shaderScript = document.getElementById("2d-vertex-shader");
	shaderSource = shaderScript.text;
	vertexShader = gl.createShader(gl.VERTEX_SHADER); //create the vertex shader from script
	gl.shaderSource(vertexShader, shaderSource);
	gl.compileShader(vertexShader);

	shaderScript   = document.getElementById("2d-fragment-shader");
	shaderSource   = shaderScript.text;
	fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //create the fragment from script
	gl.shaderSource(fragmentShader, shaderSource);
	gl.compileShader(fragmentShader);

	program = gl.createProgram(); // create the WebGL program.  This variable will be used to inject our javascript variables into the program.
	gl.attachShader(program, vertexShader); // add the shaders to the program
	gl.attachShader(program, fragmentShader); // ^^
	gl.linkProgram(program);	 // Tell our WebGL application to use the program
	gl.useProgram(program); // ^^ yep, but now literally use it.
	
	
	/* 
	
	Alright, so here we're attatching javascript variables to the WebGL code.  First we get the location of the uniform variable inside the program. 
	
	We use the gl.getUniformLocation function to do this, and pass thru the program variable we created above, as well as the name of the uniform variable in our shader.
	
	*/
	locationOfResolution = gl.getUniformLocation(program, "u_resolution");
	locationOfTime = gl.getUniformLocation(program, "u_time");
	
	
	/*
	
	Then we simply apply our javascript variables to the program. 
	Notice, it gets a bit tricky doing this.  If you're editing a float value, gl.uniformf works. 
	
	But if we want to send over an array of floats, for example, we'd use gl.uniform2f.  We're specifying that we are sending 2 floats at the end.  
	
	You can also send it over to the program as a vector, by using gl.uniform2fv.
	To read up on all of the different gl.uniform** stuff, to send any variable you want, I'd recommend using the table (found on this site, but you need to scroll down about 300px) 
	
	https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html#uniforms
	
	*/
	gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
	gl.uniform1f(locationOfTime, currentTime);

	render();
}

function render() {
	var now = new Date().getTime();
	currentTime = (now - startTime) / 1000; // update the current time for animations
	
	
	gl.uniform1f(locationOfTime, currentTime); // update the time uniform in our shader

	window.requestAnimationFrame(render, canvas); // request the next frame

	positionLocation = gl.getAttribLocation(program, "a_position"); // do stuff for those vertex's
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

window.addEventListener('load', function(event){
	init();
});

window.addEventListener('resize', function(event){
	// just re-doing some stuff in the init here, to enable resizing.
	
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	locationOfResolution = gl.getUniformLocation(program, "u_resolution");
});





// VANTA.TRUNK({
//   el: "#splash",
//   mouseControls: true,
//   touchControls: true,
//   gyroControls: false,
//   minHeight: 200.00,
//   minWidth: 200.00,
//   scale: 1.00,
//   scaleMobile: 1.00,
//   color: 0x9d6174,
//   // backgroundColor: 0x638cb6,
//   chaos: 4.50
// })


// let Engine = Matter.Engine,
//   Render = Matter.Render,
//   World = Matter.World,
//   Bodies = Matter.Bodies;

// let engine = Engine.create();

// function init() {
//   let num = Math.random();
//   $("canvas").remove();

//   let width = $(window).width();
//   let height = $(window).height();
//   let vmin = Math.min(width, height);

//   engine.events = {};
//   World.clear(engine.world);
//   Engine.clear(engine);

//   engine = Engine.create();

//   let render = Render.create({
//     element: document.body,
//     engine: engine,
//     options: {
//       wireframes: false,
//       background: 'transparent',
//       width: width,
//       height: height
//     }
//   });

//   World.add(engine.world, [
//     Bodies.rectangle(width / 2, height + 50, width, 100, {
//       isStatic: true
//     }),
//     Bodies.rectangle(width / 2, -50, width, 100, {
//       isStatic: true
//     }),
//     Bodies.rectangle(-50, height / 2, 100, height, {
//       isStatic: true
//     }),
//     Bodies.rectangle(width + 50, height / 2, 100, height, {
//       isStatic: true
//     }),
//     Bodies.rectangle(width / 2, height / 2, vmin * 0.961, vmin * .4, {
//       isStatic: true,
//       render: {
//         fillStyle: "transparent"
//       }
//     }),
//     Bodies.rectangle(width / 2, height / 4 * 3, vmin * 0.37, vmin * 0.131, {
//       isStatic: true,
//       render: {
//         fillStyle: "transparent"
//       }
//     }),
//     Bodies.circle(width / 2 - (vmin * 0.182), height / 4 * 3, vmin * 0.065, {
//       isStatic: true,
//       render: {
//       fillStyle: "transparent"
//     }
//     }),
//     Bodies.circle(width / 2 + (vmin * 0.182), height / 4 * 3, vmin * 0.065, {
//       isStatic: true,
//       render: {
//       fillStyle: "transparent"
//     }
//     })
//   ]);

//   for (let i = 0; i < 150; i++) {
//     let radius = Math.round(10 + (Math.random() * vmin / 12));

//     World.add(engine.world, Bodies.circle(
//       Math.random() * width,
//       Math.random() * height / 4,
//       radius, {
//         render: {
//           fillStyle: ['#EA1070', '#EAC03C', '#25DDBC', '#007DB0', '#252B7F', '#FF6040'][Math.round(Math.random() * 6 - 0.5)]
//         }
//       }
//     ))
//   }

//   Engine.run(engine);

//   Render.run(render);
//   let num0 = 0;
//   function update() {
//     engine.world.gravity.x = Math.sin(num0 / 100);
//     engine.world.gravity.y = Math.cos(num0 / 100);
//     num0 += 1;
//     idRAF = requestAnimationFrame(update.bind(this));
//   }
//   update();
// }

// init();

// $(window).resize(function() {
//   init();
// });






// const { Engine, Render, World, Bodies } = Matter;

// let wHeight = window.innerHeight,
//     wWidth = window.innerWidth;

// var clientWidth = document.getElementById('splash').clientWidth;

// class Circle {
//   constructor(x, y) {
//     this.body = Bodies.circle( x, y, (Math.floor( Math.random() * 10) + 12), {
//       restitution: 1.05, // play here
//       friction: 1,    // play here
//       slop: 0,      // play here
//       render: { fillStyle:['#EA1070', '#EAC03C', '#25DDBC', '#007DB0', '#252B7F', '#FF6040'][Math.round(Math.random() * 6 - 0.5)] }
//     });
//     World.add(engine.world, this.body);
//   }
// }

// const engine = Engine.create();

// const render = Render.create({
//   element: document.body,
//   engine: engine,
//   options: {
//     width: wWidth,
//     height: wHeight,
//     wireframes: false,
//     showAngleIndicator: false,
//     background: 'transparent',
//   }
// });

// const bascule = Bodies.rectangle(wWidth / 2, wHeight / 3, 350, 10, {
//   isStatic: true,
//   render: { fillStyle: "#fff" }
// });
// const floor = Bodies.rectangle(wWidth / 2, wHeight, wWidth, 3, {
//   isStatic: true,
//   render: { fillStyle: "#fff" }
// });

// World.add(engine.world, [floor, bascule]);

// let circles = [], i = 0;

// const interval = setInterval(() => {
//   if (i < 250) {
//     circles.push(new Circle(wWidth / 2, 0));
//     i++;
//   } else clearInterval(interval);
// }, 12);


// var mouse = Matter.Mouse.create(render.canvas),
//     mouseConstraint = Matter.MouseConstraint.create(engine, {
//       mouse: mouse,
//       contraint: {
//         stiffness: 1,
//         render: {
//           visible: true
//         }
//       }
//     });
// World.add(engine.world, mouseConstraint);
// render.mouse = mouse;
// Engine.run(engine);
// Render.run(render);








// VANTA.TRUNK({
//   el: "#your-element-selector",
//   mouseControls: true,
//   touchControls: true,
//   gyroControls: false,
//   minHeight: 200.00,
//   minWidth: 200.00,
//   scale: 1.00,
//   scaleMobile: 1.00,
//   color: 0xca003e,
//   backgroundColor: 0x1975d2
// })
