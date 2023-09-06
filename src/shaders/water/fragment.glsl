uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOfset;
uniform float uColorMultiplier;

varying float vElevation;


void main(){
  float mixStrengnth = (vElevation + uColorOfset) * uColorMultiplier;

  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrengnth  );
  gl_FragColor = vec4(color, 1.0);
}
