// rtSetup

import * as THREE from 'three';
import { FontLoader } from '../../static/jsm/loaders/FontLoader.js';

// revisar si puede ser relevante usar hydra como  textura del texto

// import data from "bundle-text:./inicio.txt" // works!

class RTarget{
    
    constructor(){ // revisar si algo tiene que ir en el constructor 
	// this.arrlines = data.split("\n");
	self = this; 
	self.renderTarget = new THREE.WebGLRenderTarget(1080, 1080, { format: THREE.RGBAFormat } );
	self.rtAspect = 1080 / 1080;
	self.rtCamera = new THREE.PerspectiveCamera(75, this.rtAspect, 0.1, 5);
	self.rtCamera.position.z = 4;
	self.rtScene = new THREE.Scene();
	self.cubort; 
	self.fuente;
	self.lineasSelectas = []; 
	// este es el material que después voy a psar 

	self.materialrt = new THREE.MeshBasicMaterial({
	    color: 0xffffff,
	    map: self.renderTarget.texture,
	    transparent: true
	});

	self.loadertext = new THREE.FileLoader();
	
	console.log(self.rtScene); 
    }

    setText = function( msg="hola mundo" ){
	  
	const loader = new FontLoader();

	const font = loader.load(
	    // resource URL
	    'fonts/square.json',
	    
	    // onLoad callback
	    function ( font ) {
		const fuente = font; 
		// do something with the font
		// console.log( font );

		self.materialT = new THREE.MeshBasicMaterial({color: 0xffffff});
		self.text = new THREE.Mesh();
		self.text.material = self.materialT; 
		const shapes = fuente.generateShapes( msg, 0.08 );
		const geometry = new THREE.ShapeGeometry( shapes );
		// textGeoClon = geometry.clone(); // para modificar
		self.text.geometry.dispose(); 
		self.text.geometry= geometry;
		geometry.computeBoundingBox();
		geometry.computeVertexNormals(); 
		// const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		//geometry.translate( xMid, 0, 0 );
		//geometry.rotation.x = Math.PI*2;
		self.text.geometry= geometry;
	
		self.rtScene.add(self.text);
		self.text.rotation.y = Math.PI * 2
		//text.rotation.z = Math.PI *2	
		self.text.position.y = 3;
		self.text.position.x = -2; 
		//let lineasSelectas = [];
	    })
    
    }
}

export { RTarget } 
