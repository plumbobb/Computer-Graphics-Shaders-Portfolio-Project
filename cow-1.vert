#version 330 compatibility

uniform float Timer; // Passed from GLIB
out vec2 vST;

void main() {
    // Apply oscillation to the Y position
    float displacement = sin(Timer * 3.1415 * 2.0) * 2.0; // Adjust amplitude

    // Apply rotation on both Y and X axes
    float rotationAngleY = sin(Timer * 3.1415 * 2.0) * 20.0; // Wobble around Y-axis
    float rotationAngleX = cos(Timer * 3.1415 * 2.0) * 10.0; // New X-axis rotation

    float cosY = cos(radians(rotationAngleY));
    float sinY = sin(radians(rotationAngleY));

    float cosX = cos(radians(rotationAngleX));
    float sinX = sin(radians(rotationAngleX));

    // Move the cow **down by 13 units** instead of 15
    vec4 modifiedPos = gl_Vertex;
    modifiedPos.y -= 13.0;

    // Rotate around Y-axis (XZ-plane rotation)
    vec4 rotatedPos = modifiedPos;
    rotatedPos.x = modifiedPos.x * cosY - modifiedPos.z * sinY;
    rotatedPos.z = modifiedPos.x * sinY + modifiedPos.z * cosY;

    // Rotate around X-axis (YZ-plane rotation)
    vec4 finalPos = rotatedPos;
    finalPos.y = rotatedPos.y * cosX - rotatedPos.z * sinX;
    finalPos.z = rotatedPos.y * sinX + rotatedPos.z * cosX;

    // Apply displacement in the Y-direction **after lowering the base position**
    finalPos.y += displacement;

    // Pass through texture coordinates
    vST = vec2(gl_MultiTexCoord0.s, gl_MultiTexCoord0.t);

    // Transform final position
    gl_Position = gl_ModelViewProjectionMatrix * finalPos;
}
