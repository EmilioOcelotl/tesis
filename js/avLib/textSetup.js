
// Al momento actual necesitamos renderTarget para dibujar el texto, en cicla la transparencia la logramos creo en la transparencia 

// const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, { format: THREE.RGBAFormat } );

// no lo logramos con render target vamos a probar con fontLoader

import { FontLoader } from './static/jsm/loaders/FontLoader.js';
import { TextGeometry } from './static/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';

function MultiTxt(scene, amount){

    self = this;
    self.text = [];
    self.fontLoader = new FontLoader();
    self.scene = scene;
    self.textGeo = []; 
    self.text = []; 
    self.font = 0; 
    
    self.fontLoader.load( 'static/js/cimatics_noise.json', function ( response ) {
	self.font = response;
	console.log("holi");
	// texto();
    } );
    
    const mFont  = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	roughness: 0.5,
	metalness: 0.1,
	side: THREE.DoubleSide
    } );
    
    // agregar diez simultaneamente pero vacíos 
    
    for( let i = 0; i < amount; i++){
	
	self.textGeo[i] = new TextGeometry( "Hello World", {
	    font: self.font,	    
	    size: 0.35,
	    height: 0.25,
	    curveSegments: 3,
	    bevelOffset: 0.01,
	    bevelThickness: 0.125/4,
	    bevelSize: 0.01,
	    bevelEnabled: true   
	});
	
	textGeo[i].computeBoundingBox();
	let xMid = - 0.5 * ( textGeo[i].boundingBox.max.x - textGeo[i].boundingBox.min.x );
	let yMid = 0.5 * ( textGeo[i].boundingBox.max.y - textGeo[i].boundingBox.min.y );
	textGeo[i].translate( xMid, yMid, 0 );
	
	// copia
	
	// textGeoCopy[i] = textGeo[i].clone();
	// txtPos[i] = textGeo[i].attributes.position;
	
	//textGeo[i] = textGeo[i].attributes.position;
	// txtPos[i].usage = THREE.DynamicDrawUsage; 
	
	text[i] =  new THREE.Mesh( textGeo[i], mFont );
	// tRev[i] =  new THREE.Mesh( textGeo[i], mFont );
	
	scene.add( text[i] );
	
    }

    // Cambiar cada que llegue un mensaje
    
    self.txtUpdate = function(text){
    
	self.fontLoader.load("./static/fonts/cimatics_noise.json", function( font ){
	    
	    self.tempGeo = new TextGeometry( text, {
		
		font: font,	    
		size: 1,
		height: 0.25,
		curveSegments: 1,
		bevelOffset: 0.01,
		bevelThickness: 0.125/4,
		bevelSize: 0.01,
		bevelEnabled: true
		
	    });

	    self.tempGeo.computeBoundingBox();	    
	    let xMid = - 0.5 * ( self.tempGeo.boundingBox.max.x - self.tempGeo.boundingBox.min.x );
	    let yMid = 0.5 * ( self.tempGeo.boundingBox.max.y - self.tempGeo.boundingBox.min.y );
	    self.tempGeo.translate( xMid, yMid, 0 );

	    // Lo siguiente es para modificar los vértices del objeto 

	    //txtPos[0] = tempGeo.attributes.position;
	    //txtPos[0].usage = THREE.DynamicDrawUsage; 

	    // seguro esto se puede hacer más elegantemente

	    // pregunta: esto podría estar fuera de esta clase para que fuera

	    // quitar geometria
	    // quitar mesh 

	    for(let i = 0; i < amount; i++){	    	    
		self.text[i+1].geometry = self.text[i].geometry;
	    }

	    self.text[0].geometry = self.tempGeo;

	    for(let i = 0; i < amount; i++){
		self.text[i+1].position.x = self.text[i].position.x;
	    }

	    self.text[0].position.x = (Math.random() * 400) - 200 ;

	    for(let i = 0; i < amount; i++){
		self.text[i+1].position.y = self.text[i].position.y;
	    }

	    self.text[0].position.y = (Math.random() * 400) - 200 ; 
	    
	    for(let i = 0; i < amount; i++){
		self.text[i+1].position.z = self.text[i].position.z;
	    }
	    
	    self.text[0].position.z = (Math.random() * 400) - 200 ;
	    
	    for(let i = 0; i < amount; i++){
		self.text[i+1].rotation.x = self.text[i].rotation.x;
	    }
	    
	    self.text[0].rotation.x = Math.PI * Math.random();
	    
	    for(let i = 0; i < amount; i++){
		self.text[i+1].rotation.y = self.text[i].rotation.y;
	    }
	    
	    self.text[0].rotation.y = Math.PI * Math.random(); 

	    for(let i = 0; i < amount; i++){
		self.text[i+1].rotation.z = self.text[i].rotation.z;
	    }
	    
	    self.text[0].rotation.z = Math.PI * Math.random(); 
	    
	})
    }
			    

}

export{ MultiTxt }
