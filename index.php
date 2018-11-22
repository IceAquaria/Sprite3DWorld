
	<!doctype HTML>

	<html>

		<meta charset="UTF-8">

		<head>

			<title>2D Character Controller</title>
			<link rel="stylesheet" href="styles/index.css">

		</head>

		<body>

			<script id="vertShader" type="shader">

				varying vec2 vUv;

				varying vec3 vecPos;

				varying vec3 vecNormal;

				void main ( )

				{

					vUv = uv;

						// Since the light is in camera coordinates, 

							// I'll need the vertex position in camera coords too

								vecPos = ( modelViewMatrix * vec4 ( position, 1.0 ) ).xyz;

									// That's NOT exacly how you should transform your

								// normals but this will work fine, since my model

							// matrix is pretty basic

						vecNormal = ( modelViewMatrix * vec4 ( normal, 0.0 ) ).xyz;

					gl_Position = projectionMatrix * vec4 ( vecPos, 1.0 );

				}

			</script>

			<script id="fragShader" type="shader">

				precision highp float;

				varying vec2 vUv;
				
				varying vec3 vecPos;

				varying vec3 vecNormal;

				uniform float lightIntensity;

				uniform sampler2D textureSampler;

				struct PointLight

				{

					vec3 color;

						// light position, in camera coordinates

							vec3 position;

								// used for attenuation purposes

								float distance;

							// Since we're writing our own shader, 

						// it can really be anything we want 

					// ( as long as we assign it to our light in its "distance" field )

				};

				uniform PointLight pointLights [ NUM_POINT_LIGHTS ];

				void main ( void )

				{

					// Pretty basic lambertian lighting...

						vec4 addedLights = vec4 ( 0.0, 0.0, 0.0, 1.0 );

						for ( int l = 0; l < NUM_POINT_LIGHTS; l++ )

						{

							vec3 lightDirection = normalize ( vecPos - pointLights [ l ].position );

							addedLights.rgb += clamp ( dot ( -lightDirection, vecNormal ), 0.0, 1.0 )

							* pointLights [ l ].color

							* lightIntensity;

						}

					gl_FragColor = texture2D ( textureSampler, vUv ) * addedLights;

				}

			</script>

			<script src="../../includes/libs/modules/three/r98-dev/three.js"></script>

			<script src="../../includes/libs/modules/controls/OrbitControls.js"></script>

			<script src="libraries/THREE.Input.js"></script>
			<script src="libraries/THREE.Context.js"></script>
			<script src="libraries/THREE.ThirdPersonControls.js"></script>

			<script src="THREE.SpriteAnimation.js"></script>

			<script src="scripts/index.js"></script>

		</body>

	</html>


