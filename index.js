
	~function (){

		var context = new THREE.Context ();

			// debug

			window.context = context;

		this.CreateFloor = function ( scene ){

			if ( scene instanceof THREE.Scene ){

				this.scene = scene;
				
			}

			else

			{

				alert ( 'Could not create floor mesh!' );

				return;

			}

			this.floor = new THREE.Mesh (

				new THREE.PlaneBufferGeometry ( 1000, 1000, 32, 32 ), 
				new THREE.MeshBasicMaterial ( { color : 0x555555, wireframe : true } )

			);

			this.floor.rotation.x = ( -Math.PI / 2.0 );
			this.scene.add ( this.floor );

			return this.floor;

		}

		function getPlaneGeometry (){

			if ( _geo === null ) {

				_geo = new THREE.PlaneBufferGeometry ( 1.0, 1.0 );

			}

			return _geo;

		}

		var buildCharacter = function (){

			var _geo = null;

			// Share the same geometry across all planar objects

			var g = getPlaneGeometry ();

			var creatureImage = textureLoader.load ( 'images/texture.png' );
			creatureImage.magFilter = THREE.NearestFilter;
			creatureImage.minFilter = THREE.LinearFilter;

			var mat = new THREE.ShaderMaterial ({

				uniforms: THREE.UniformsUtils.merge

				([

					THREE.UniformsLib [ 'lights' ], 

					{ 

						lightIntensity : { type : 'f', value : 1.0 }, 
						textureSampler : { type : 't', value : null }, 

					}

				]), 

				vertexShader : document.getElementById ( 'vertShader' ).text, 
				fragmentShader : document.getElementById ( 'fragShader' ).text, 
				transparent : true, 
				lights : true

			});

			// THREE.UniformsUtils.merge ( ) call THREE.clone ( ) on each uniform
			// We don't want our texture to be duplicated, 
			// so I assign it to the uniform value right here

			mat.uniforms.textureSampler.value = creatureImage;
			var obj = new THREE.Mesh ( g, mat );

			return obj;

		}

		this.CreateAnimatedCharacter = function ( texture_name$, texture_location$, make_pixelated )

		{

			var playerTexture = new THREE.TextureLoader ().load ( texture_location$ );

			if ( make_pixelated === 1 ){

				playerTexture.magFilter = THREE.NearestFilter;
				playerTexture.minFilter = THREE.LinearFilter;

			}

			if ( make_pixelated === 0 ){

				playerTexture.magFilter = THREE.LinearFilter;
				playerTexture.minFilter = THREE.LinearMipMapLinearFilter;

			}

			if ( make_pixelated !== 1 && make_pixelated !== 0 ){

				alert ( 'You tried to set a value that does not exist\.\.\.' );
				alert ( 'Setting \'pixelated\' default to \'0\'\.\.\.' );

			}

			this.playerAnim = new THREE.SpriteAnimation ({

				texture : playerTexture, tilesHorizontal : 3, tilesVertical : 2, 
				numberOfTiles : 6, delay : 80, 

			});

			this.playerAnim.add ( "idle", { from : 1, to : 1 } );
			this.playerAnim.add ( "forward", { from : 1, to : 6 } );

			this.playerAnim.play ( "idle" );

			var playerMaterial = new THREE.MeshBasicMaterial ({

				map : playerTexture, 
				transparent : true, 
				opacity : 1.0, 
				side : THREE.DoubleSide, 
				depthTest : false, 
				depthWrite : false, 
				lights : false, 

			});

			this.player = new THREE.Mesh ( new THREE.PlaneBufferGeometry ( 64, 64 ), playerMaterial );

			this.player.position.x = 0.0;
			this.player.position.y = 15.0;
			this.player.position.z = 0.0;

			this.scene.add ( this.player );

			return this.player;

		}

		this.CreateDirectionalLight = function ( scene, color, intensity ) {

			if ( scene instanceof THREE.Scene ) {

				this.scene = scene;
				
			}

			else

			{

				alert ( 'Could not create Directional Light!' );

				return;

			}

			this.light = new THREE.DirectionalLight ( color, intensity );
			this.scene.add ( this.light );

			return this.light;

		}

		this.CreateSmoothCamera = function ( camera, player, lerpval ) {

			if ( camera instanceof THREE.PerspectiveCamera ) {

				this.camera = camera;

			}

			else

			{

				alert ( 'Could not create Smooth Camera!' );

				return;

			}

			this.player = player;
			this.lerpval = lerpval;

			this.controls = new THREE.ThirdPersonControls ({

				camera : this.camera, 
				target : this.player, 
				lerp : this.lerpval, 

			});

			return this.camera;

		}

		context.addEventListener

		(

			"start", function (){

				// LIGHTS

				this.light = CreateDirectionalLight ( this.scene, 0xffffff, 1.0 );

				// FLOOR

				this.floor = CreateFloor ( this.scene );

				// ANIMATED CHARACTER

				this.player = CreateAnimatedCharacter ( 'male', 'https://github.com/IceAquaria/Sprite3DWorld/raw/master/male.png', 1 );

				// SMOOTH CAMERA

				this.camera = CreateSmoothCamera ( this.camera, this.player, 0.009 );
				console.log ( 'this.camera :: ', this.camera );

			}

		);

		context.addEventListener

		(

			"frame", 

			function ( event ){

				if ( THREE.Input.isKeyPressed ( "W" ) )

					playerAnim.play ( "forward" );

				else if ( THREE.Input.isKeyPressed ( "S" ) )

					playerAnim.play ( "backward" );

				else if ( THREE.Input.isKeyPressed ( "Q" ) )

					playerAnim.play ( "left" );

				else if ( THREE.Input.isKeyPressed ( "E" ) )

					playerAnim.play ( "right" );

				else if ( ! THREE.Input.isKeyPressed ( ) )

					playerAnim.play ( "idle" );

					playerAnim.update ( event.deltaTime * 1000 );

			}

		);

		context.start ( );

	}();


