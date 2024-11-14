// shaders/GlowShaders.js
export const GlowVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

export const GlowFragmentShader = `
  uniform vec3 glowColor;
  uniform float glowIntensity;
  varying vec3 vNormal;

  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor * glowIntensity * intensity, 1.0);
  }
`;
