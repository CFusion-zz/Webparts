var gl;
var canvas;

function initGL() {
	canvas = document.getElementById("canvas_main");
    try {
        gl = canvas.getContext("webgl", { preserveDrawingBuffer: true } );
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        console.log("Could not initialise WebGL, sorry :-(");
    }
}

var _time = 0;
function STARTTIME()
{
	_time = window.performance.now();
}
function STOPTIME(msg)
{
	if(!msg)
		msg = "Unknown";
		
	console.log("(Timer) " + msg + " took: " + (window.performance.now() - _time) + "ms");
}
function STOPTIME_GL(msg)
{
	var pixels = new Uint8Array(4);
	gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels); // Wait for internal rendering thread to complete so we can get a performance check
	STOPTIME(msg);
}

var lastTime = null;
var particleShader;
var renderShader;
function update(_time)
{
	if(_time == undefined)
		_time = window.performance.now();
	
	if(lastTime)
	{
		var dt = (_time - lastTime) / 1000;
		var fps = 1 / dt;
		//console.log("FPS: " + fps);
		window.document.title = "FPS: " + parseInt(fps);
	}
	lastTime = _time;
		
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	
	particleShader.draw();
	
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
	
	renderShader.draw();
	
	gl.disable(gl.BLEND);
	
	requestAnimationFrame(update);
}

function main()
{
	STARTTIME();

	initGL();
	
	//gl2 = gl.getExtension("WEBGL_debug_shaders");
	
	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);
	
	
	
	STOPTIME_GL("Loading GL");
	
	STARTTIME();
	particleShader = new shaderParticles();
	renderShader = new shaderRender();
	renderShader.ps = particleShader;
	
	particleShader.initGL();
	renderShader.initGL();
	
	STOPTIME_GL("Loading shader");
	
	STARTTIME();
	particleShader.initBuffers()
	STOPTIME_GL("Loading buffers");
	
	update();
}