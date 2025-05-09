#version 330 compatibility

uniform sampler2D TexUnit;

in vec2 vST;
out vec4 fragColor;

void main() {
    vec3 texColor = texture(TexUnit, vST).rgb;
    fragColor = vec4(texColor, 1.0);
}
