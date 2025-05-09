#version 330 compatibility

// Cube Maps and Noise Texture
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;
uniform sampler3D Noise3;

// Uniform Variables
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uEta;       // Index of refraction
uniform float uMix;       // Reflection/Refraction blend
uniform float uWhiteMix;  // White mix for refraction

// Inputs from vertex shader
in vec3 vNormal;
in vec3 vEyeDir;
in vec3 vMC;

// Constant white color
const vec3 WHITE = vec3(1., 1., 1.);

// Function to perturb normal
vec3 PerturbNormal3(float angx, float angy, float angz, vec3 n)
{
    float cx = cos(angx), sx = sin(angx);
    float cy = cos(angy), sy = sin(angy);
    float cz = cos(angz), sz = sin(angz);

    // Rotate about X
    float yp = n.y * cx - n.z * sx;
    n.z = n.y * sx + n.z * cx;
    n.y = yp;

    // Rotate about Y
    float xp = n.x * cy + n.z * sy;
    n.z = -n.x * sy + n.z * cy;
    n.x = xp;

    // Rotate about Z
    xp = n.x * cz - n.y * sz;
    n.y = n.x * sz + n.y * cz;
    n.x = xp;

    return normalize(n);
}

void main()
{
    // Normalize input normal and eye direction
    vec3 Normal = normalize(vNormal);
    vec3 Eye = normalize(vEyeDir);

    // Fetch noise values for perturbation
    vec4 nvx = texture(Noise3, uNoiseFreq * vMC);
    vec4 nvy = texture(Noise3, uNoiseFreq * vec3(vMC.xy, vMC.z + 0.33));
    vec4 nvz = texture(Noise3, uNoiseFreq * vec3(vMC.xy, vMC.z + 0.67));

    // Calculate perturbation angles
    float angx = (nvx.r + nvx.g + nvx.b + nvx.a) - 2.0; // Normalize to range [-1, 1]
    angx *= uNoiseAmp;

    float angy = (nvy.r + nvy.g + nvy.b + nvy.a) - 2.0;
    angy *= uNoiseAmp;

    float angz = (nvz.r + nvz.g + nvz.b + nvz.a) - 2.0;
    angz *= uNoiseAmp;

    // Apply normal perturbation
    Normal = PerturbNormal3(angx, angy, angz, Normal);
    Normal = normalize(gl_NormalMatrix * Normal);

    // Compute Reflection Vector and Color
    vec3 reflectVector = reflect(Eye, Normal);
    vec3 reflectColor = texture(uReflectUnit, reflectVector).rgb;

    // Compute Refraction Vector
    vec3 refractVector = refract(Eye, Normal, uEta);
    vec3 refractColor;

    // If total internal reflection occurs, use reflection color
    if (all(equal(refractVector, vec3(0., 0., 0.))))
    {
        refractColor = reflectColor;
    }
    else
    {
        refractColor = texture(uRefractUnit, refractVector).rgb;
        refractColor = mix(refractColor, WHITE, uWhiteMix); // Blend with white light
    }
    
    gl_FragColor = vec4(mix(refractColor, reflectColor, uMix), 1.0);
}
