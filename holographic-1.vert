#version 330 compatibility

// Outputs to the fragment shader:
out vec3 vNormal;
out vec3 vEyeDir;
out vec3 vWorldPos;
out float vTime; // Use glman’s Timer variable

// glman provides the Timer variable automatically
uniform float Timer;  // No need to pass time manually!

void main()
{
    // Compute eye-space position
    vec4 ecPos = gl_ModelViewMatrix * gl_Vertex;

    // Compute the view direction (from vertex to eye)
    vEyeDir = normalize(-ecPos.xyz);

    // Transform the normal into eye space
    vNormal = normalize(gl_NormalMatrix * gl_Normal);

    // Store world position (used for interference pattern in fragment shader)
    vWorldPos = gl_Vertex.xyz;

    // Pass Timer to the fragment shader
    vTime = Timer;

    // Standard projection
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
