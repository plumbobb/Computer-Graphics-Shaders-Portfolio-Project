#version 330 compatibility

precision highp float;  // Better floating-point precision

// Hard-coded color constants:
const vec4 kHoloColor = vec4(0.0, 1.0, 1.0, 1.0);    
const vec4 kFresnelColor = vec4(1.0, 1.0, 1.0, 1.0);

// Uniforms
uniform float alphaScale;       
uniform float fresnelIntensity; 
uniform float fresnelPower;     
uniform float Timer;            

// Inputs from the vertex shader:
in vec3 vNormal;
in vec3 vEyeDir;
in vec3 vWorldPos;
in float vTime;  

out vec4 fragColor;

// Speed of movement
const float scrollSpeed = 5.0;

void main()
{
    // Normalize vectors with a small bias to reduce seam visibility
    vec3 norm = normalize(vNormal + vec3(0.001, 0.001, 0.001));
    vec3 viewDir = normalize(vEyeDir);

    // Compute Fresnel effect and clamp to prevent extreme values
    float fresnel = 1.0 - max(0.1, dot(norm, viewDir)); // Avoid artifacts
    fresnel = pow(fresnel, fresnelPower) * fresnelIntensity;

    // Adjust UV coordinates for smoother mapping
    vec2 uv = vec2(vWorldPos.x * alphaScale, mod(vWorldPos.y, 1.0) * alphaScale);

    // Scroll effect
    float movingY = vWorldPos.y - Timer * scrollSpeed;
    float circleSpacing = 1.0 / alphaScale;  
    float yOffset = mod(movingY, circleSpacing) - (circleSpacing * 0.5);

    // Circular pattern
    float radialPattern = 0.5 + 0.5 * cos(yOffset * 10.0 * alphaScale);

    // Fresnel modulation
    float modulatedFresnel = mix(fresnel, fresnel * 1.5, radialPattern); 

    // Compute final color
    vec3 baseColor = kHoloColor.rgb;
    vec3 highlight = modulatedFresnel * kFresnelColor.rgb;
    vec3 finalColor = mix(baseColor, baseColor + highlight, radialPattern);

    // Use the interference value for alpha
    fragColor = vec4(finalColor, 0.5 + 0.5 * radialPattern);
}
