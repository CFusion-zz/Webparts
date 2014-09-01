shaderRender = function()
{
	this.ps;
	this.pMatrix = mat4.create();
	this.mvMatrix = mat4.create();
}
shaderRender.prototype = Object.create(shader.prototype);

shaderRender.prototype.initGL = function()
{
	var fragmentShader = this.getShader(gl, "render-shader-fs");
    var vertexShader = this.getShader(gl, "render-shader-vs");

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
    }

    gl.useProgram(this.shaderProgram);

    this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
	this.samplerUniform = gl.getUniformLocation(this.shaderProgram, "uSampler");
    this.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
	
	mat4.perspective(this.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.01, 100.0);
	mat4.identity(this.mvMatrix );
		
	mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 0.0, -10.0]);
}

shaderRender.prototype.draw = function()
{
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.useProgram(this.shaderProgram);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.ps.vertexBuffer);
	gl.vertexAttribPointer(this.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);
	
	gl.uniformMatrix4fv(this.pMatrixUniform, false, this.pMatrix);
	gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.ps.rttTexture);
	gl.uniform1i(this.samplerUniform, 0);
	
	gl.drawArrays(gl.POINT, 0, this.ps.C.particleCount);
}