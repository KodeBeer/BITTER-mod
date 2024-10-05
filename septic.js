if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //throw new Error("Mobile is not supported.");
}

const canvas    = document.querySelector('canvas');
const gl        = canvas.getContext("webgl");
const program   = gl.createProgram();
const cell      = 96;

shader(gl.VERTEX_SHADER,
`
precision lowp float;
precision lowp int;

attribute vec2 vertex;
attribute vec2 tcoord;

varying vec2 uv;

uniform vec2 scale;
uniform float tilesize;

uniform vec2 tile;
uniform vec2 position;

void main() {
    vec2 cell = vec2(16.0, 16.0) / ` + tm + `.0;
    uv = (tile * cell) + (tcoord * cell);
    vec2 ndcPos = (((position * 2.0 * tilesize) + (vertex * tilesize)) / scale);
    ndcPos.y    = -ndcPos.y;
    gl_Position = vec4(ndcPos, 0.0, 1.0);
}
`
);

shader(gl.FRAGMENT_SHADER,
`
precision lowp float;
precision lowp int;

varying vec2 uv;

uniform sampler2D tileset;
uniform float tm;

int albedo() {
    return int(mod(floor(texture2D(tileset, uv).r * 255.1 / pow(2.0, float(7 - int(mod(uv.x * tm, 8.0))))), 2.0));
}

void main() {
    if (albedo() == 0) {
        discard;
    }
    gl_FragColor = vec4(1.0);
}
`
);

function shader(type, source) {
    var id = gl.createShader(type);
    gl.shaderSource(id, source);
    gl.compileShader(id);
    if (!gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
        alert("Error compiling " + type + " shader: " + gl.getShaderInfoLog(id));
    }
    gl.attachShader(program, id);
}

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("Error linking program: " + gl.getProgramInfoLog(program));
}

gl.useProgram(program);

vb = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vb);
gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([-1, 1, 1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.BYTE, false, 0, 0);

ub = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, ub);
gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([0, 1, 1, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);
gl.vertexAttribPointer(1, 2, gl.UNSIGNED_BYTE, false, 0, 0);

ib = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

const t = gl.createTexture();

gl.bindTexture(gl.TEXTURE_2D, t);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, Math.ceil(tm / 8), tm, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, tb);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, t);
gl.uniform1f(gl.getUniformLocation(program, "tm"), tm);
gl.uniform1i(gl.getUniformLocation(program, "tileset"), 0);

class Entity {
    constructor(x, y, tx, ty) {
        this.x  = x;
        this.y  = y;
        this.tx = tx;
        this.ty = ty;
    }
}

var grid = [];

const tile      = gl.getUniformLocation(program, "tile");
const tilesize  = gl.getUniformLocation(program, "tilesize");
const scale     = gl.getUniformLocation(program, "scale");
const position  = gl.getUniformLocation(program, "position");

gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

function draw(now) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i = 0; i < grid.length; i++) {
        let cube = grid[i];
        gl.uniform2f(tile, cube.tx, cube.ty);
        gl.uniform2f(position, cube.x, cube.y);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
    }
}

window.addEventListener("resize",           resize);
window.addEventListener("fullscreenchange", resize);
//document.addEventListener("contextmenu", e => e.preventDefault());

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    gl.uniform2f(scale, canvas.width, canvas.height);

    console.log(cell);
    gl.uniform1f(tilesize, cell);
    gl.viewport(0, 0, canvas.width, canvas.height);

    grid = [];

    var numTilesX = canvas.width    / cell;
    var numTilesY = canvas.height   / cell;

    /*
    for (var x = 0; x < numTilesX; x++) {
        for (var y = 0; y < numTilesY; y++) {
            grid.push(new Entity(x, y, 2, 0)); 
        }
    }
    */

    grid.push(new Entity(-1, 1, 5, 0)); 
    grid.push(new Entity(0, 0, 2, 0)); 
    
    requestAnimationFrame(draw);
}

let walking;

document.addEventListener('keydown', (event) => {
    if (walking) {
        return;
    }
    switch (event.key) {
        case 'w':
            walking = true;
            grid[0].ty = 1;
            grid[0].y = grid[0].y - 0.5;
            requestAnimationFrame(draw);
            setTimeout(function(){
                grid[0].ty = 2;
                grid[0].y = grid[0].y - 0.5;
                requestAnimationFrame(draw);
            }, 50);
            setTimeout(function(){
                grid[0].ty = 0;
                requestAnimationFrame(draw);
                walking = false;
            }, 100);
            break;
        case 'a':
            walking = true;
            grid[0].ty = 1;
            grid[0].x = grid[0].x - 0.5;
            requestAnimationFrame(draw);
            setTimeout(function(){
                grid[0].ty = 2;
                grid[0].x = grid[0].x - 0.5;
                requestAnimationFrame(draw);
            }, 50);
            setTimeout(function(){
                grid[0].ty = 0;
                requestAnimationFrame(draw);
                walking = false;
            }, 100);
            break;
        case 's':
            walking = true;
            grid[0].ty = 1;
            grid[0].y = grid[0].y + 0.5;
            requestAnimationFrame(draw);
            setTimeout(function(){
                grid[0].ty = 2;
                grid[0].y = grid[0].y + 0.5;
                requestAnimationFrame(draw);
            }, 50);
            setTimeout(function(){
                grid[0].ty = 0;
                requestAnimationFrame(draw);
                walking = false;
            }, 100);
            break;
        case 'd':
            walking = true;
            grid[0].ty = 1;
            grid[0].x = grid[0].x + 0.5;
            requestAnimationFrame(draw);
            setTimeout(function(){
                grid[0].ty = 2;
                grid[0].x = grid[0].x + 0.5;
                requestAnimationFrame(draw);
            }, 50);
            setTimeout(function(){
                grid[0].ty = 0;
                requestAnimationFrame(draw);
                walking = false;
            }, 100);
            break;
        case ' ':
            for (var i = grid.length - 1; i >= 0; i--) {
                grid[i].ty = grid[i].ty == 0 ? 1 : 0;
            }
            break;
    }
    requestAnimationFrame(draw);
});

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

resize();
requestAnimationFrame(draw);