import * as THREE from 'three';
import { DbReader } from "./js/avLib/dbSetup"
import { VideoSetup, GLTFLd, Feedback, UnrealBloom } from "./js/avLib/videoSetup"
import { HydraTex } from './js/avLib/hydraSetup' // en deep se perdió esta referencia. HydraTex podría ser sustituído en el futuro por un generador de shaders
import { AudioSetup, Analyser } from './js/avLib/audioSetup'
import { ImprovedNoise } from './static/jsm/math/ImprovedNoise.js';
import { EditorParser } from './js/avLib/editorParser'

let a = new AudioSetup(); 
let th = new VideoSetup(); 
const hy = new HydraTex();
const db = new DbReader();
db.read("./sql/document.db"); 

const avButton = document.getElementById('av');
avButton.addEventListener('click', renderAV);

function renderAV(){
    // la versión render av no debería desplegar code Mirror 
    console.log("render AV"); 
}

const pdfButton = document.getElementById('pdf');
pdfButton.addEventListener('click', printPDF );

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

const fixButton = document.getElementById('edit');
fixButton.addEventListener('click', init);

let cubos = [];
let geometry; 
// const geometry = new THREE.SphereGeometry(2, 3, 4 );
//const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: hy.vit } );
let pX = [], pY = [], pZ = []; 

function init(){

    document.body.style.cursor = 'none'; 

    const overlay = document.getElementById( 'overlay' );
    overlay.remove();
    
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    instructions.remove(); 
    blocker.remove();

    const par = new EditorParser(); 
    
    th.initVideo();

    const light = new THREE.PointLight(  0xffffff, 1 );
    light.position.set( 0, 0, 0 );
    th.scene.add( light ); 

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

    osc(4, ()=>cursorX*0.0001, 1 ).color(0.85, 1, 0.6).rotate(1, 0.3, 0.5).modulateScrollX(o0, 1.001).out(o0);

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
	    
	    //geometry = new THREE.SphereGeometry(4, 3, 4 );
	    geometry = new THREE.BoxGeometry(8, 4, 2); 
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
	
	container = document.getElementById( 'container' );
	container.appendChild(th.renderer2.domElement);
    
	animate();
	stein(20); 

}

function animate() {

    requestAnimationFrame( animate );
    
    th.renderer2.toneMappingExposure = Math.pow( (an.dataArray[0]/128.0)*0.75, 1.5 );
    //console.log((an.dataArray[0]*1000)+100); 
 an.getData();
    
    retro.render2();
    
    const delta = clock.getDelta();

    th.controls.movementSpeed = 0.33;
    th.controls.update( delta );

    var time2 = Date.now() * 0.0005;

    th.camera.position.x = Math.sin( time2 * 0.5 ) * ( 75 + Math.sin( time2 * 0.125 )* 1) * 0.4; 
    th.camera.position.y = Math.cos( time2 * 0.5 ) * 0.4; 
    th.camera.position.z = Math.cos( time2 * 0.5 ) * - 0.4

    retro.cube.rotation.x += 0.0001  
    retro.cube.rotation.x += 0.0002; 
    retro.cube.rotation.x -= 0.0001; 
    
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

		
		cubos[cc].position.x = (pX[cc]*1)*(1+d) *((an.dataArray[cc]/12));
		cubos[cc].position.y = (pY[cc])* (1+d)  *((an.dataArray[cc]/12));
		cubos[cc].position.z = (pZ[cc]*1)* (1+d)  *((an.dataArray[cc]/12));


		
		cubos[cc].scale.x = 0.5* (d+1)*1;
		cubos[cc].scale.y = 2* (d+1)*1;
		cubos[cc].scale.z = 0.5* (d+1)*1;
		
		cubos[cc].rotation.x += 0.0006 * (1+d);
		cubos[cc].rotation.y += 0.0007 * (1+d);
		cubos[cc].rotation.z -= 0.0008 * (d+1);
	
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
