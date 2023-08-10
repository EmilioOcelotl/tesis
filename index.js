import * as THREE from 'three';
import { DbReader } from "./js/avLib/dbSetup"
import { VideoSetup, GLTFLd, Feedback, UnrealBloom } from "./js/avLib/videoSetup"
import { HydraTex } from './js/avLib/hydraSetup' // en deep se perdió esta referencia. HydraTex podría ser sustituído en el futuro por un generador de shaders
import { AudioSetup, Analyser } from './js/avLib/audioSetup'
import { ImprovedNoise } from './static/jsm/math/ImprovedNoise.js';
import { EditorParser } from './js/avLib/editorParser'
// import { twCamera } from './js/avLib/controlSetup.js' 
import * as TWEEN from 'tween'; 

let a = new AudioSetup(); 
let th = new VideoSetup(); 
const hy = new HydraTex();
const db = new DbReader();
db.read("./sql/document.db");
// let twC; 
let tween;
let tweenBool = false; 
//const avButton = avButton.addEventListener('click', renderAV);

let interStr = ''; 

function renderAV(){
    // la versión render av no debería desplegar code Mirror 
    console.log("render AV"); 
}

document.getElementById("container").onclick = cameraChange;

//const pdfButton = document.getElementById('pdf');
//pdfButton.addEventListener('click', printPDF );

// extras intervención oci

const meshes = [],materials = [],xgrid = 10, ygrid = 10;
let material, mesh;
let an; 

function printPDF(){

    // la opción print pdf debería también desplegar los renders pero no dibujarlos en el navegador. 

    db.prepare(db.postdb); 
    db.print(db.result2); 
    
    // Hay un problema al seleccionar el texto a imprimir y la impresión. Tal vez es necesario relacionar el análisis del texto con la lectura y no tanto con el método de impresión. 
    // Parece ser que aquí necesitaremos expresiones regulares para hacer cosas como limpiar la base o separar cada cierto número de caracteres y agregar nuevas hojas.
    // También hace falta diseñar la base de datos desde trilium y subir esto para que pueda trabajar directamente con la base del servidor. 

}

const clock = new THREE.Clock();

//const fixButton = document.getElementById('edit');
//fixButton.addEventListener('click', init);

let cubos = [];
let geometry; 
// const geometry = new THREE.SphereGeometry(2, 3, 4 );
//const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: hy.vit } );
let pX = [], pY = [], pZ = []; 

let sphere; 
let raycaster;
let INTERSECTED;
const pointer = new THREE.Vector2();


init(); // los elementos particulares de este init podrían ir en otro lado. En todo caso podría delimitar la escena que antes se detonaba con esta función.     
function init(){
    
    raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousemove', onPointerMove );

    // document.body.style.cursor = 'none';
    th.initVideo();
    th.camera.position.z = 200; 

    const light = new THREE.PointLight(  0xffffff, 1 );
    light.position.set( 0, 500, 500 );
    th.scene.add( light );

    th.renderer2.outputColorSpace = THREE.LinearSRGBColorSpace;
    th.renderer2.toneMapping = THREE.ReinhardToneMapping;
    th.renderer2.toneMappingExposure = Math.pow( 0.6, 1.5 )
    
    un = new UnrealBloom(th.scene, th.camera, th.renderer2); 
    // retro = new Feedback(th.scene, th.renderer2, 1080);
    const geometry44 = new THREE.SphereGeometry( 50, 128, 128 ); 
    const material44 = new THREE.MeshStandardMaterial( { color: 0xffffff, map:hy.vit, roughness: 0.6 } ); 
    sphere44 = new THREE.Mesh( geometry44, material44 );

    sphere44.userdata = {id:'iniciar'};
    console.log(sphere44.userdata.id); 
    th.scene.add( sphere44 );
    sphere44.position.z = -20; 
    
    var cursorX;
    var cursorY;
    document.onmousemove = function(e){
	cursorX = e.pageX;
	cursorY = e.pageY;
    }

    osc(4, ()=>cursorX*0.0001, 1 ).color(1.75, 0, 1.97).rotate(1, 0.3, 0.5).modulateScrollX(o0, 1.1).out(o0);

    container = document.getElementById( 'container' );
    container.appendChild(th.renderer2.domElement);

    // twC = new twCamera(th.camera); 
    animate(); 
    
}

function onPointerMove( event ) {
    
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
}

function initCubes(){

    document.body.style.cursor = 'none'; 

    const par = new EditorParser();     
    
    //const overlay = document.getElementById( 'overlay' );
    //overlay.remove();
    
    //const blocker = document.getElementById( 'blocker' );
    //const instructions = document.getElementById( 'instructions' );
    //instructions.remove(); 
    //blocker.remove();

    th.renderer2.outputColorSpace = THREE.LinearSRGBColorSpace;
    th.renderer2.toneMapping = THREE.ReinhardToneMapping;
    //th.renderer2.toneMappingExposure = Math.pow( 0.6, 1.5 )
    
    un = new UnrealBloom(th.scene, th.camera, th.renderer2); 
    retro = new Feedback(th.scene, th.renderer2, 1080); 
     
    var cursorX;
    var cursorY;
    document.onmousemove = function(e){
	cursorX = e.pageX;
	cursorY = e.pageY;
    }

    osc(4, ()=>cursorX*0.0001, 0 ).color(0.6, 0.6, 0.6).rotate(1, 0.3, 0.5).modulateScrollX(o0, 1.001).out(o0);

    let ox, oy, geometryTex;

    const ux = 1 / xgrid;
    const uy = 1 / ygrid;

    const xsize = 1000 / xgrid;
    const ysize = 1000 / ygrid;

    const parameters = { color: 0xffffff, map: hy.vit };

    a.initAudio(); 
    an = new Analyser(a.audioCtx);
    an.initAnalyser(128, 0.95);    

    cubeCount = 0;
    
    // podrían tener un orden inicial y luego descomponerse 

    // malla de 2x2 ¿Podría ser de otra manera?
    
    for(let i = 0; i < xgrid; i++){
	for (let j = 0; j < ygrid; j++){
	    
	    // geometry = new THREE.SphereGeometry(4, 3, 4 );
	    const geometry = new THREE.BoxGeometry(8, 4, 2); 
	    change_uvs( geometry, ux, uy, i, j );

	    materials[ cubeCount] = new THREE.MeshStandardMaterial( { color: 0xffffff, map: hy.vit, roughness: 0.8, metalness:0.1 } );
	    // materials[ cubeCount ] = new THREE.MeshLambertMaterial( parameters );
	    material2 = materials[ cubeCount ];
	    
	    cubos[cubeCount] = new THREE.Mesh( geometry, material2 );
	    
	    var posX, posY, posZ;
	    var theta1 = Math.random() * (Math.PI*2);
	    var theta2 = Math.random() * (Math.PI*2); 
	    posX = Math.cos(theta1) * Math.cos(theta2)*1;
	    posY = Math.sin(theta1)*1;
	    posZ = Math.cos(theta1) * Math.sin(theta2)*1;
	    pX[cubeCount] = posX;
	    pY[cubeCount] = posY;
	    pZ[cubeCount] = posZ; 
	    cubos[cubeCount].position.x = pX[cubeCount] * 1 ; 
	    cubos[cubeCount].position.y = pY[cubeCount] * 1;
	    cubos[cubeCount].position.z = pZ[cubeCount] *  1;
	    cubos[cubeCount].rotation.x = Math.random() * 360; 
	    cubos[cubeCount].rotation.y = Math.random() * 360; 
	    cubos[cubeCount].rotation.z = Math.random() * 360; 
	    th.scene.add( cubos[cubeCount] );
	    cubeCount++; 
	}
    }
	
    container = document.getElementById( 'container' );
    container.appendChild(th.renderer2.domElement);
    
    animate();
    stein(20); 
    
}

function animate(){

    th.camera.updateMatrixWorld();

    // let interStr = ''; 
    // find intersections
    
    raycaster.setFromCamera( pointer, th.camera );

    const intersects = raycaster.intersectObjects( th.scene.children, false );

    if ( intersects.length > 0 ) {
	
	if ( INTERSECTED != intersects[ 0 ].object ) { // si INTERSECTED es tal objeto entonces realiza tal cosa

	    // console.log(intersects[ 0 ].object.userdata); 

	    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

	    INTERSECTED = intersects[ 0 ].object;
	    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
	    INTERSECTED.material.emissive.setHex( 0xffffff );

	    interStr = INTERSECTED.userdata.id;
	    
	    if(interStr == 'iniciar'){
		document.getElementById("container").style.cursor = "pointer";
	    }
	    // Aquí debería ir la animación
	   
	}
	
    } else {
	
	if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
	
	INTERSECTED = null;
	document.getElementById("container").style.cursor = "default";
	interStr = ''; 
	
    }

     //if(tweenBool){
	 TWEEN.update();
    //}
    
    hy.vit.needsUpdate = true; 
    const delta = clock.getDelta();
    requestAnimationFrame( animate );

    sphere44.rotation.x += 0.0001  
    sphere44.rotation.y += 0.0002; 
    sphere44.rotation.z -= 0.0001; 

    th.renderer2.render( th.scene, th.camera );
    un.render2(delta);

}

function animate2() {

    requestAnimationFrame( animate );
    
    th.renderer2.toneMappingExposure = Math.pow( (an.dataArray[0]/128.0)*0.75, 1.5 );
    //console.log((an.dataArray[0]*1000)+100); 
 an.getData();
    
    retro.render2();
    
    const delta = clock.getDelta();

    th.controls.movementSpeed = 0.33;
    th.controls.update( delta );

    var time2 = Date.now() * 0.0005;

    th.camera.position.x = Math.sin( time2 * 0.5 ) * ( 75 + Math.sin( time2 * 0.125 )* 1) * 0.6; 
    th.camera.position.y = Math.cos( time2 * 0.5 ) * 0.6; 
    th.camera.position.z = Math.cos( time2 * 0.5 ) * - 0.6;

    retro.cube.rotation.x += 0.001  
    retro.cube.rotation.y += 0.002; 
    retro.cube.rotation.z -= 0.001; 
    
    th.camera.lookAt(0, 0, 0);   
    
    hy.vit.needsUpdate = true; 
    
    let perlin = new ImprovedNoise();

    if(cubos.length == xgrid*ygrid){
	let cc = 0;     
	for(let i = 0; i < xgrid; i++){
	    for (let j = 0; j < ygrid; j++){
		let d = perlin.noise(pX[cc]*0.25*(time2 ),
				     pY[cc]*0.25*(time2 ),
				     pZ[cc]*0.25*(time2 ) ) *2
		cubos[cc].position.x = (pX[cc]*1)*(1+d) *((an.dataArray[cc]/8));
		cubos[cc].position.y = (pY[cc])* (1+d)  *((an.dataArray[cc]/8));
		cubos[cc].position.z = (pZ[cc]*1)* (1+d)  *((an.dataArray[cc]/8));
		cubos[cc].scale.x = 0.5* (d+1)*1;
		cubos[cc].scale.y = 2* (d+1)*1;
		cubos[cc].scale.z = 0.5* (d+1)*1;
		cubos[cc].rotation.x += 0.00006 * (1+d);
		cubos[cc].rotation.y += 0.00007 * (1+d);
		cubos[cc].rotation.z -= 0.00008 * (d+1);
		cc++; 
	    }
	}
    }
    th.renderer2.render( th.scene, th.camera );
    un.render2(delta);

}

function stein (cantidad){

    let cant = cantidad; 
    let vertices = [];
    
    for(var i = 0; i < cantidad; i++){
	// console.log(uMap); 
	for(let j = 0; j < cantidad; j++){
	    let uMap = THREE.MathUtils.mapLinear(i, 0, cantidad, Math.PI*2, -Math.PI*2);
	    let vMap = THREE.MathUtils.mapLinear(j, 0, cantidad, Math.PI*4, -Math.PI*4);
	    let x = uMap * Math.cos(vMap);
	    let y = uMap * Math.sin(vMap);
	    let z = vMap * Math.cos(uMap);

	    vertices.push(x, y, z); 
	    
	}
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    let material = new THREE.PointsMaterial( { size: 0.125/2, sizeAttenuation: true, alphaTest: 0.5, transparent: true } );

    const particles = new THREE.Points( geometry, material );
    // th.scene.add(particles); 
    particles.rotation.z = Math.PI*2;
    
}

function change_uvs( geometry, unitx, unity, offsetx, offsety ) {

    const uvs = geometry.attributes.uv.array;

    for ( let i = 0; i < uvs.length; i += 2 ) {

	uvs[ i ] = ( uvs[ i ] + offsetx ) * unitx;
	uvs[ i + 1 ] = ( uvs[ i + 1 ] + offsety ) * unity;
	
    }
    
}

function cameraChange(){

    if(interStr == 'iniciar'){
	console.log(db.result2);
	document.getElementById("info").innerHTML = db.postdb; // cuando tween termine 

	
	const coords = {x: th.camera.position.x,
			y: th.camera.position.y,
			z: th.camera.position.z} // Start at (0, 0)
	
	// console.log(coords); 
	
	tween = new TWEEN.Tween(coords, false) // Create a new tween that modifies 'coords'.
	    .to({x: 0, y: 0, z: 0}, 2000) // Move to (300, 200) in 1 second.
	    .easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
	    .onUpdate(() => {
		th.camera.position.z=coords.z;
		// console.log(coords); 
	    })
	    .start() // Start the tween immediately.
	
	// tweenBool = true;
    }
}
