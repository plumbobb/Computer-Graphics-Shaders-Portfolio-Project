#version 330 compatibility

uniform float Timer;  // Uniform to control rotation over time

out vec3 vNormal;
out vec3 vEyeDir;
out vec3 vMC;  // Model coordinates

void main()
{
    // Increase the rotation speed
    float angle = Timer * 10.0; // Adjust this multiplier to control speed

    // Rotation matrix around the Y-axis
    mat4 rotationMatrix = mat4(
        cos(angle), 0.0, sin(angle), 0.0,
        0.0,        1.0, 0.0,       0.0,
        -sin(angle), 0.0, cos(angle), 0.0,
        0.0,        0.0, 0.0,       1.0
    );

    // Rotate the vertex position
    vec4 rotatedPos = rotationMatrix * gl_Vertex;

    // Transform normal to match rotated object
    vec3 rotatedNormal = mat3(rotationMatrix) * gl_Normal;

    vMC = rotatedPos.xyz; // Transformed model coordinates
    vec3 ECposition = (gl_ModelViewMatrix * rotatedPos).xyz;
    vEyeDir = normalize(ECposition.xyz); // Vector from eye to vertex
    vNormal = normalize(gl_NormalMatrix * rotatedNormal); // Transform normal to eye space

    gl_Position = gl_ModelViewProjectionMatrix * rotatedPos;
}
