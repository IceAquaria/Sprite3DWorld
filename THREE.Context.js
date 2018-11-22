
	THREE = THREE || { };

	/**
	  * Create a new context and initialize the application
	*/

	THREE.Context = function ()
	{

		var self = this;

		// Inherit from eventDispatcher

		THREE.EventDispatcher.call ( this );

		this.paused = false;
		this.controls = null;

		// Create html container

		var container = document.createElement ( 'div' );
		container.className = "threejs-container";
		document.body.appendChild ( container );

		// Set default Resolution

		this.resolution = 0;

		// Create a clock

		this.clock = new THREE.Clock ( );
		this.clock.start ( );

		// Create camera

		this.camera = new THREE.PerspectiveCamera
		(
			65.0, ( window.innerWidth / window.innerHeight ), 1.0, 
			10000.0
		);

		// Camera Start Position

		this.camera.position.x = 0.0;
		this.camera.position.y = 1.0;
		this.camera.position.z = 10.0;

		// Create scene

		this.scene = new THREE.Scene ( );

		// Create the renderer

		this.renderer = new THREE.WebGLRenderer ({

			antialias : true, alpha : true, preserveDrawingBuffer : false, 

		});

		this.renderer.setPixelRatio ( window.devicePixelRatio ? window.devicePixelRatio : 1 ) 

		if ( this.resolution > 0 ) 
		{
			this.renderer.setSize
			(
				( window.innerWidth / this.resolution ), 
				( window.innerHeight / this.resolution ), 
			);
		}
		else
		{
			this.renderer.setSize ( window.innerWidth, window.innerHeight );
		}

		this.renderer.setClearColor ( 0x003232, 1 );
		container.appendChild ( this.renderer.domElement );

		if ( this.resolution > 0 ) 
		{
			this.renderer.domElement.style.width = this.renderer.domElement.width * this.resolution + 'px';
			this.renderer.domElement.style.height = this.renderer.domElement.height * this.resolution + 'px';
		}
		else
		{
			this.renderer.domElement.style.width = this.renderer.domElement.width + 'px';
			this.renderer.domElement.style.height = this.renderer.domElement.height + 'px';
		}

		this.controls = new THREE.ThirdPersonControls ({
			camera : this.camera, target : this.player, lerp : 0.009, 
		});

		window.addEventListener('resize', function(){
			self.camera.aspect = ( window.innerWidth / window.innerHeight );
			self.camera.updateProjectionMatrix ( );
			self.renderer.setSize ( window.innerWidth, window.innerHeight );
		}, false);

	}

	/**
	  * Inherited from THREE.EventDispatcher
	*/

	THREE.Context.prototype = Object.create ( THREE.EventDispatcher.prototype );

	/**
	  * Reset the context to restart the application
	*/

	THREE.Context.prototype.reset = function ( )

	{

		// TODO

	}

	/**
	  * Pause the application
	*/

	THREE.Context.prototype.pause = function ( )

	{

		this.paused = true;
		this.dispatchEvent ({ type : "pause" });

	}

	/**
	  * Quit the application
	*/

	THREE.Context.prototype.quit = function ( ) 

	{

		this.paused = true;
		this.dispatchEvent ({ type : "quit" });

	}

	/**
	  * Play the application
	*/

	THREE.Context.prototype.play = function ( ) 
	{
		this.paused = false;
		this.dispatchEvent ({ type : "play" });
	}

	/**
	 * Start the application
	 */

	THREE.Context.prototype.start = function ( ) 

	{

		var self = this;
		this.dispatchEvent ({ type : "start" });

		function animate (){

			requestAnimationFrame ( animate );
			var delta = self.clock.getDelta ( );
			if ( this.controls ) { this.controls.update ( delta ); }
			self.dispatchEvent ({ type : "frame", deltaTime : delta });
			if ( ! this.paused ) { self.renderer.render ( self.scene, self.camera ); }

		}

		animate ( );

	}


