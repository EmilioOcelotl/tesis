// Algo similar al trabajo con el seminario pero con THREE.js

// Pensar que con el tiempo se puede ir a una librería independiente como para solo importar la forma que tengo de trabajar

import * as THREE from 'three';
import { OrbitControls } from '../../static/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../../static/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../../static/jsm/loaders/DRACOLoader.js';
import {EffectComposer} from '../../static/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from '../../static/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from '../../static/jsm/postprocessing/UnrealBloomPass.js';
import { FlyControls } from '../../static/jsm/controls/FlyControls.js';

function VideoSetup(){

    var self = this;

    self.initVideo = function(){
	
	self.scene = new THREE.Scene();
	self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 6000 );
	// self.camera.position.set(0, 0, -40);
	self.renderer2 = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
	self.renderer2.setPixelRatio( window.devicePixelRatio );
	self.renderer2.setSize( window.innerWidth, window.innerHeight );
	// container.appendChild( renderer.domElement ); // esto realmente tiene que ir en index pero lo dejo para acordarme 
	// por acá tendría que ir la retro
	//self.controls = new OrbitControls( self.camera, self.renderer2.domElement );
	//self.controls.maxDistance = 30;

	/*
	self.controls = new FlyControls( self.camera, self.renderer2.domElement );
	
	self.controls.movementSpeed = 1 ;
	self.controls.domElement = self.renderer2.domElement;
	self.controls.rollSpeed = Math.PI / 24;
	self.controls.autoForward = false;
	self.controls.dragToLook = false;
	*/
	
	// Antes aquí había un switch, quién sabe si sea necesario para el futuro, antes era importante para el control de la cámara pero creo que se quedó el orbit controls

	self.elCanvas = document.getElementById( 'myCanvas');
	self.elCanvas.style.display = 'none';     
	
    }

    // on win resize

    self.winResize = function(){
	window.addEventListener( 'resize', onWindowResize );
 
	function onWindowResize() {
	    // 	console.log("hola");
	    console.log(window); 
	    self.camera.aspect = window.innerWidth / window.innerHeight;
	    self.camera.updateProjectionMatrix();
	    self.renderer2.setSize( window.innerWidth, window.innerHeight );
	}
    }

    self.winResize(); 

    // lo siguiente es relevante?
    
    self.camTranslate = function(posX, posY, posZ){
	self.camera.position.x = posX;
	self.camera.position.y = posY;
	self.camera.position.z = posZ; 
    }

    /*
    self.hydraInit = function(){
	self.hydra = new Hydra({
	    canvas: document.getElementById("myCanvas"),
	    detectAudio: false,
	    //makeGlobal: false
	}) // antes tenía .synth aqui 
	
	self.vit = new THREE.CanvasTexture(self.elCanvas);	
	}
    */
}

function GLTFLd () {

    var self = this;
    // self.model = "";
    
    self.dracoLoader = new DRACOLoader();
    self.dracoLoader.setDecoderPath( './js/draco/' );
    
    self.lder = new GLTFLoader();
    self.lder.setDRACOLoader( self.dracoLoader );

    //self.scene = scene;
    self.model = []; 
    // la escena funciona como si fuera el audio context para estos objetos

    self.ld = function(scene, model, tex, tex2){
	// console.log(model); 
	self.lder.load(
	    // resource URL
	    model, 
	     //'./3d/01-corteza/0000008.gltf',
	    // called when the resource is loaded
	    function ( gltf ) {
		
		// aquí habría que ver si es importante separar hijos de escenas para trabajarlos mejor
		
		// console.log("modelo"); 
		// console.log(gltf.scene);

		let rand = Math.floor(Math.random()*3);

		if(rand == 0){
		 gltf.scene.children[0].material.map = tex; 
		}
		
		if(rand == 1){
		 gltf.scene.children[0].material.map = tex2; 
		}
		
		gltf.scene.scale.x = 10;
		gltf.scene.scale.y = 10;
		gltf.scene.scale.z = 10;
		gltf.scene.position.x = Math.random()*0.8-0.4;
		gltf.scene.position.z = Math.random()*0.8-0.4;
		gltf.scene.lookAt(0, 0, 0);

		self.model = gltf.scene; 
		scene.add( self.model );

		
		/*
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		*/
		
	    },
	    // called while loading is progressing
	    function ( xhr ) {
		
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		
	    },
	    // called when loading has errors
	    function ( error ) {
		
		console.log( 'An error happened' );
	    
	    }
	
	
	);
    }

    /*
    self.remove = function(scene){
	scene.remove(self.model);
	self.model.geometry.dispose();
	self.model.material.dispose(); 
	}
	*/

    // self.ld; 
}
    

function Camera (){
    self = this;

    self.init = async function(){
    
	self.video = document.getElementById('video');
	self.stream = await navigator.mediaDevices.getUserMedia({
	    'audio': false,
	    'video': {
		facingMode: 'user',
		width: mobile ? undefined : self.camWidth,
		height: mobile ? undefined : self.camHeight,
		// frameRate: {ideal: 20, max: 60},
	    }
	});
	
	self.video.srcObject = self.stream;
	let {width, height} = self.stream.getTracks()[0].getSettings();
	console.log('Resolución:'+ `${width}x${height}`); // 640x480
	return new Promise((resolve) => {
	    self.video.onloadedmetadata = () => {
		resolve(self.video);
		// initBlinkRateCalculator();	
	    };
	});
    }
}

function Feedback(scene, renderer, size){
    self = this;
    self.texture = 0;
    self.dpr = window.devicePixelRatio;
    const vector = new THREE.Vector2();
    //self.scene = scene; 
    //console.log(self.vector.x);
    self.scene = 0; 
    
    //self.init = function(){

    self.textureSize = size * self.dpr;
    let texture = new THREE.FramebufferTexture( self.textureSize, self.textureSize, THREE.RGBAFormat );

    self.cubeGeometry = new THREE.BoxGeometry( 600, 600, 600, 4, 4, 4 )
    // self.cubeGeometry = new THREE.PlaneGeometry( 100, 100 );
    
    //self.cubeGeometry = new THREE.SphereGeometry( 4000, 32, 16 ); 

    self.cubeGeometry.usage = THREE.DynamicDrawUsage;
    self.material = new THREE.MeshBasicMaterial( {
	map: texture,
	side: THREE.DoubleSide,
	//roughness: 0.6,
	//metalness: 0.9
    } );
    
    self.cube = new THREE.Mesh(self.cubeGeometry, self.material );
    scene.add(self.cube);

    //self.cube.position.z = -50
    //self.cube.rotation.y = Math.PI * 2; 
    
    //}

    self.render2 = function(){
	vector.x = ( window.innerWidth * self.dpr / 2 ) - ( self.textureSize / 2 );
	vector.y = ( window.innerHeight * self.dpr / 2 ) - (self.textureSize / 2 );
	renderer.copyFramebufferToTexture( vector, texture );	
    }
    
}

function equiRect(scene, path){ // serpa necesario agregar el formato? 

    self.this;
    self.scene = scene;
    self.path = path; 

    self.change = function(){

	self.format = '.png';
	self.urls = [
	    self.path + 'px' + self.format, self.path + 'nx' + self.format,
	    self.path + 'py' + self.format, self.path + 'ny' + self.format,
	    self.path + 'pz' + self.format, self.path + 'nz' + self.format
	];
	
	self.reflectionCube = new THREE.CubeTextureLoader().load( self.urls );
	self.refractionCube = new THREE.CubeTextureLoader().load( self.urls );
	self.refractionCube.mapping = THREE.CubeReflectionMapping;
	self.scene.background = self.reflectionCube;
    }
    
}

function UnrealBloom (scene, camera, renderer){

    self = this
    self.scene = scene;
    self.camera = camera;
    self.renderer = renderer; 
    
    const renderScene = new RenderPass( self.scene, self.camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 0.75, 1, 0.1 );
    
    const composer = new EffectComposer( self.renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );

    self.render2 = function (delta){
	  composer.render(delta);
    }
}


// función que dibuje cubos, por ejemplo 

export { VideoSetup, GLTFLd, Camera, Feedback, UnrealBloom }
