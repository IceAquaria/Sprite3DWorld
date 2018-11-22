
	// standard global variables

		var scene, camera, renderer;

			var textureLoader, light;

				// Character 3d object

			var character = null;

		// FUNCTIONS

	function init ( )

	{

		// SCENE

			scene = new THREE.Scene ( );

				textureLoader = new THREE.TextureLoader ( );

					// CAMERA

						var SCREEN_WIDTH = window.innerWidth;

							var SCREEN_HEIGHT = window.innerHeight;

						var VIEW_ANGLE = 65.0;

					var ASPECT = ( SCREEN_WIDTH / SCREEN_HEIGHT );

				var NEAR = 0.01;

			var FAR = 10000.0;

		camera = new THREE.PerspectiveCamera

		(

			VIEW_ANGLE, ASPECT, NEAR, 

			FAR

		);

			scene.add ( camera );

				camera.position.set ( 0.0, 0.0, 1.0 );

				camera.lookAt ( scene.position );

			// RENDERER

		renderer = new THREE.WebGLRenderer

		(

			{

				antialias : true, 

				alpha : true, 

			}

		);

			renderer.setSize ( SCREEN_WIDTH, SCREEN_HEIGHT );

				var container = document.body;

					container.appendChild ( renderer.domElement );

						// Create light

							light = new THREE.PointLight ( 0xffffff, 1.0 );

								// We want it to be very close to our character

							light.position.set ( 0.0, 0.0, 1.0 );

						scene.add ( light );

					// Create character

				character = buildCharacter ( scene, textureLoader, 'male', 'images/male.png', 1 );

			// Start animation

		animate ( );

	}

		// Share the same geometry across all planar objects

	var getPlaneGeometry = function ( _geo )

	{

		if ( _geo === null )

		{

			_geo = new THREE.PlaneBufferGeometry ( 1.0, 1.0 );

		}

		return _geo;

	}

	var buildCharacter = function ( scene, textureLoader, texture_name$, texture_location$, make_pixelated )

	{

		var _geo = null;

			var g = getPlaneGeometry ( _geo );

				var creatureImage = textureLoader.load ( texture_location$ );

					creatureImage.magFilter = THREE.NearestFilter;

						creatureImage.minFilter = THREE.LinearFilter;

							var mat = new THREE.ShaderMaterial

							(

								{

									uniforms: THREE.UniformsUtils.merge

									(

										[

											THREE.UniformsLib [ 'lights' ], 

											{

												lightIntensity : 

												{

													type : 'f', value : 1.0

												}, 

												textureSampler : 

												{

													type : 't', value : null

												}

											}

										]

									), 

										vertexShader : document.getElementById ( 'vertShader' ).text, 

											fragmentShader : document.getElementById ( 'fragShader' ).text, 

										transparent : true, 

									lights : true

								}

							);

								// THREE.UniformsUtils.merge ( ) call THREE.clone ( ) on each uniform

							// We don't want our texture to be duplicated, 

						// so I assign it to the uniform value right here

					mat.uniforms.textureSampler.value = creatureImage;

				var obj = new THREE.Mesh ( g, mat );

			scene.add ( obj );

		return obj;

	}

	function animate ( )

	{

		// Update light profile

			var timestampNow = new Date ( ).getTime ( ) / 1000.0;

				var lightIntensity = 2.3; // * Math.cos ( timestampNow * Math.PI );

					// character.material.uniforms.lightIntensity.value = lightIntensity;

					// light.color.setHSL ( lightIntensity, 1.0, 1.0 );

				// Render scene

			renderer.render ( scene, camera );

		requestAnimationFrame ( animate );

	}

		init ( );

	animate ( );


