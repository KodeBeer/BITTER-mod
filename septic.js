if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //throw new Error("Mobile is not supported.");
}

const canvas    = document.querySelector('canvas');
const gl        = canvas.getContext("webgl");
const program   = gl.createProgram();

shader(gl.VERTEX_SHADER,
`
attribute vec2 v;
attribute vec2 u;

varying vec2 uv;

uniform vec2 s;
uniform vec2 p;

uniform int r;
uniform bool fx;
uniform bool fy;

uniform vec2 tp;

void main() {
    vec2 pos = v;
    pos.y = -pos.y;
    pos *= 0.1;
    if (r == 1) {
        pos = vec2(pos.y, -pos.x);
    } else if (r == 2) {
        pos = vec2(-pos.x, -pos.y);
    } else if (r == 3) {
        pos = vec2(-pos.y, pos.x);
    }
    if (fx) {
        pos.x = -pos.x;
    }
    if (fy) {
        pos.y = -pos.y;
    }
    pos = pos * s;
    pos = pos + vec2(p.x * 0.2, p.y * 0.2);
    gl_Position = vec4(pos, 0.0, 1.0);
    vec2 tile = vec2(10.0, 10.0) / 40.0;
    uv = (tp * tile) + (u * tile);
}

`
);

shader(gl.FRAGMENT_SHADER,
`
precision lowp float;

varying vec2 uv;

uniform sampler2D samp;
uniform float w;

int getTextureColor(sampler2D s) {
    return int(mod(floor(texture2D(s, uv).r * 255.1 / pow(2.0, float(7 - int(mod(uv.x * w, 8.0))))), 2.0));
}

void main() {
    gl_FragColor = vec4(vec3(getTextureColor(samp)), 1.0);
}

`
);

function shader(type, source) {
    var id = gl.createShader(type);
    gl.shaderSource(id, source);
    gl.compileShader(id);
    if (!gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
        console.log("Error compiling " + type + " shader:");
        console.log(gl.getShaderInfoLog(id));
    }
    gl.attachShader(program, id);
}

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Error linking program:");
    console.log(gl.getProgramInfoLog(program));
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

class Entity {
    fx = false;
    fy = false;
    r  = 0;
    constructor(id, x, y, tx, ty) {
        this.id = id;
        this.x  = x;
        this.y  = y;
        this.tx = tx;
        this.ty = ty;
    }
}

class Texture {

    constructor(gl, data, width, height) {

        this.width      = width;
        this.height     = height;
        this.texture    = gl.createTexture();
        this.buffer     = new Uint8Array(Math.ceil((width * height) / 8));

        for (let i = 0; i < data.length; i += 8) {
            let packedByte = 0;
            for (let j = 0; j < 8; j++) {
                if (i + j < data.length) {
                    packedByte |= (data[i + j] > 0 ? 1 : 0) << (7 - j);
                }
            }
            this.buffer[i / 8] = packedByte;
        }

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, Math.ceil(width / 8), height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, this.buffer);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    }

    bind(gl, unit) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1f(gl.getUniformLocation(program, "w"), texture.width);
        gl.uniform1i(gl.getUniformLocation(program, "samp"), 0);
    }

}

const texture = new Texture(gl, [
    0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0
], 40, 40);

var cubes = [];

for (var i = -2; i < 3; i++) {
    cubes.push(new Entity(i + 4,
        i * 2, 0, 
        (i + 2), 1));
}

const r     = gl.getUniformLocation(program, "r");
const fx    = gl.getUniformLocation(program, "fx");
const fy    = gl.getUniformLocation(program, "fy");
const p     = gl.getUniformLocation(program, "p");
const tp    = gl.getUniformLocation(program, "tp");
const s     = gl.getUniformLocation(program, "s");

function draw(now) {

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    texture.bind(gl, 0);

    for (var i = 0; i < cubes.length; i++) {

        let cube = cubes[i];
        
        if (window.ratio > 1) {
            gl.uniform2f(s, 1.0 / window.ratio, 1.0);
        } else {
            gl.uniform2f(s, 1.0, window.ratio);
        }

        gl.uniform2f(tp,    cube.tx, cube.ty);
        gl.uniform1i(r,     cube.r);
        gl.uniform1i(fx,    cube.fx ? 1 : 0);
        gl.uniform1i(fy,    cube.fy ? 1 : 0);
        gl.uniform2f(p,     cube.x, cube.y);

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

    }

}


window.addEventListener('click', () => {

    /*
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=600,height=300,left=100,top=100`;

    open('/', 'test', params);
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            resize();
        }).catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    }*/
});


window.addEventListener("resize",           resize);
window.addEventListener("fullscreenchange", resize);
//document.addEventListener("contextmenu", e => e.preventDefault());

function resize() {
    canvas.width    = window.innerWidth;
    canvas.height   = window.innerHeight;
    window.ratio    = window.innerWidth / window.innerHeight;
    requestAnimationFrame(draw);
}

document.addEventListener('keydown', (event) => {
    var cube = cubes[0];
    switch (event.key) {
        case 'r':
            cube.r = (cube.r + 1) % 4;
            break;
        case 'h':
            cube.fx = !cube.fx;
            break;
        case 'v':
            cube.fy = !cube.fy;
            break;
    }
    requestAnimationFrame(draw);
});

resize();
requestAnimationFrame(draw);