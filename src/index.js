import * as THREE from 'three';
import { VideoSetup, GLTFLd, Feedback, UnrealBloom } from "../js/avLib/videoSetup"
import { HydraTex } from '../js/avLib/hydraSetup'
import { AudioSetup, Analyser, Grain, UploadFile, Load } from '../js/avLib/audioSetup'
import { ImprovedNoise } from '../static/jsm/math/ImprovedNoise.js';
import { EditorParser} from '../js/avLib/editorParser'
import * as TWEEN from 'tween'; 
import { FontLoader } from '../static/jsm/loaders/FontLoader.js';
import { Player } from '../js/avLib/Player.js'; 
import { Post } from '../js/avLib/Post.js';
import { DbReader, dbParser, createDoc } from '../js/avLib/dbSetup2'; 
import { OrbitControls } from '../static/jsm/controls/OrbitControls.js';
import { TransformControls } from '../static/jsm/controls/TransformControls.js'; 

// quitar 
import Text from 'markov-chains-text';

const print = document.getElementById('print');
print.addEventListener('click', printPDF );

const editorP = document.getElementById('codeEditor');
editorP.addEventListener('click', codeEditorFunc );
// editorP.style.display = 'none';

const ed = document.getElementById('editor');
ed.style.display = 'none';     

let codeBool = false; 

const backHy = document.getElementById('backgroundHy');
backHy.addEventListener('click', backgroundFunc );

let backBool = false; 

const infoButton = document.getElementById('information');
infoButton.addEventListener('click', informationFunc );

let infoBool = false; 

const disposeButton = document.getElementById("delete");
disposeButton.addEventListener('click', disposeLines); 

let notas = []; 
let sphCap = [];
let noteBool = false; 

const par = new EditorParser();     
const a = new AudioSetup(); 
const th = new VideoSetup(); 
const hy = new HydraTex();
const db = new DbReader()

a.initAudio();

const { Grain } = require('../js/avLib/Grain')
const { GLoop } = require('../js/avLib/GLoop'); 
import { map_range } from '../js/avLib/utils.js';

db.read("./sql/document.db");

let markdown = [];
let controls;
let controlsBool = true; 

const colors = [
    0x993366, // Dusty Rose
    0x3399CC, // Steel Blue
    0x996633, // Mocha
    0x669966,  // Sage Green
    0x993366, // Dusty Rose
    0x3399CC, // Steel Blue
    0x996633, // Mocha
    0x669966  // Sage Green
];


///////////////////////////////////////////////////
// splines 

let positions = []; 
const ARC_SEGMENTS = 200;
// const splines = {};
let geometryCurve = new THREE.LineBasicMaterial();
let materialCurve = new THREE.LineBasicMaterial(); 
let curveObject = new THREE.Line(); 
let curve1 = new THREE.CatmullRomCurve3(); 

const geometryP1 = new THREE.SphereGeometry( 0.5, 32, 16 ); 
const materialP1 = new THREE.MeshBasicMaterial( { color:  0x05ffa1 } ); 
const sphereP1 = new THREE.Mesh( geometryP1, materialP1 );

///////////////////////////////////////////////////
// render target

const rtWidth = 1920*2;
const rtHeight = 1080*2;
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, { format: THREE.RGBAFormat } );
const rtFov = 75;
const rtAspect = rtWidth / rtHeight;
const rtNear = 0.1;
const rtFar = 5;
const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
rtCamera.position.z = 4;
const rtScene = new THREE.Scene();
//rtScene.background = 0x000000; 
//rtScene.background = new THREE.Color( 0x000000 );
rtScene.background = hy.vit; 
let fuente;
let text = new THREE.Mesh();

const materialrt = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: renderTarget.texture,
    transparent: true,
    //roughness: 0.4,
    //metalness: 0.2
});

///////////////////////////////////////////////////

const group = new THREE.Group();
let lcbool = false; 

const mouse = [.5, .5]
//const audioFile1 = document.getElementById('audio_file1') // onload que lo decodifique 

// const rTarget = new RTarget(); 
// rTarget.setText(); 

let cosa = new Grain(a.audioCtx);
const gloop = new GLoop({grain: cosa});  

let boolCosa; 

// let twC; 
let tween;
let tweenBool = false; 
//const avButton = avButton.addEventListener('click', renderAV);
let cubos2 = []; 
let interStr = ''; 

document.getElementById("container").onclick = change;

//const pdfButton = document.getElementById('pdf');
//pdfButton.addEventListener('click', printPDF );

// Importante: resolver el problema de la iteración doble y la cantidad total de notas
const meshes = [],materials = [],xgrid = 11, ygrid = 11;
let material, mesh;
let an;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let materialslc = []; 

let mouseX = 0, mouseY = 0; 
document.addEventListener( 'mousemove', onDocumentMouseMove );

function printPDF(){
      window.open("https://ocelotl.cc/tres", "_blank");
}

const clock = new THREE.Clock();

let cubos = [];
let geometry; 

let pX = [], pY = [], pZ = []; 

let sphere; 
let raycaster;
let INTERSECTED
const pointer = new THREE.Vector2();
 
let menuC1str = ['regresar', '+ info', 'auto', 'live-codeame', 'imprimir']; 
// const group = new THREE.Group();

var cursorX;
var cursorY;
let fBool = false; 

init(); // los elementos particulares de este init podrían ir en otro lado. En todo caso podría delimitar la escena que antes se detonaba con esta función.     
function init(){

    loadFont();
        /*
    audioFile1.addEventListener("change", (event) => {
	const archivo = new LoadFile(a.audioCtx, audioFile1);
	});
	*/
    // console.log(a.audioCtx); 
    raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousemove', onPointerMove );
    
    // documentinde.body.style.cursor = 'none';
    th.initVideo();
    th.camera.position.z = 200;
    //th.scene.background = renderTarget.texture; 
    //th.scene.background = hy.vit; 
    th.scene.background = new THREE.Color( 0x010101 );

    th.scene.add( new THREE.AmbientLight( 0xcccccc ) );
    
    //th.renderer2.outputColorSpace = THREE.LinearSRGBColorSpace;
    // th.renderer2.toneMapping = THREE.ReinhardToneMapping;
    th.renderer2.toneMappingExposure = Math.pow(1, 4 )
    
    un = new UnrealBloom(th.scene, th.camera, th.renderer2); 
    // retro = new Feedback(th.scene, th.renderer2, 1080);
    const geometry44 = new THREE.SphereGeometry( 20, 32, 32 ); 
    const material44 = new THREE.MeshStandardMaterial( { color: 0xffffff, map: renderTarget.texture, roughness: 0.6 } ); 
    sphere44 = new THREE.Mesh( geometry44, material44 );

    // rTarget.setText(); 
    sphere44.userdata = {id:'iniciar'};
    //console.log(sphere44.userdata.id);

    th.scene.add( sphere44 );
    // sphere44.position.z = -20;

    const geoTres = new THREE.BoxGeometry( 2, 1, 1 ); 
    const matTres = new THREE.MeshStandardMaterial( { color: 0xffffff, map: renderTarget.texture } ); 
    sphTres = new THREE.Mesh( geoTres, matTres );

    // rTarget.setText(); 
    sphTres.userdata = {id:'Tres Estudios Abiertos'};
    //console.log(sphere44.userdata.id);

    th.scene.add( sphTres );
    
    document.onmousemove = function(e){
	cursorX = e.pageX;
	cursorY = e.pageY;
    }

    osc(()=>cursorY* 0.01, ()=>cursorX*0.001, 0 ).color(0.3, 0.1, 0.5).rotate(0.1, 0.1, 0.5).mult(osc(0.1, 1)).modulateScrollX(o0, 0.99).out(o0);

    /*
    osc(6, 0, 0.8)  .color(1, 0.1,.90)
	.rotate(0.92, 0.3)  .mult(osc(4, 0.03).thresh(0.4).rotate(0, -0.02))
	.modulateRotate(osc(20, 0).thresh(0.3, 0.6), [1,2,3,4].smooth())  .out(o0)
    */
    
    container = document.getElementById( 'container' );
    container.appendChild(th.renderer2.domElement); 
    cubeCount = 0;
    let ox, oy, geometryTex;
    const ux = 1 / xgrid;
    const uy = 1 / ygrid;
    const xsize = 200 / xgrid;
    const ysize = 200 / ygrid;
    controls = new OrbitControls( th.camera, th.renderer2.domElement );
    controls.listenToKeyEvents( window ); // optional
    
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.enabled = false; 
    //controls.minDistance = 100;
    //controls.maxDistance = 500;
    //curve()
    animate(); 
    
}

function onPointerMove( event ) {
    
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
}

function animate(){ 

    th.camera.lookAt(sphereP1); 
    
    var time1 = Date.now() * 0.00002;
    var time2 = Date.now() * 0.00001;
    // if(lcbool){
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    if(positions.length > 3){

	curveObject.geometry.attributes.position.needsUpdate = true;
	let path = (time1*10) % 1;
	let pos = curve1.getPointAt(path); 
	sphereP1.position.x = pos.x;
	sphereP1.position.y = pos.y;
	sphereP1.position.z = pos.z;
	cosa.pointer = (pos.x+40)-20 / 20;
	cosa.freqScale = (pos.y+40) -20 / 10 * 0.25;
	// console.log(pos.x);
	//console.log(curve1.getPointAt(path)); 
    }
    
    th.camera.updateMatrixWorld();

    // si esta activado el modo lc 

    text.position.x = Math.sin(time2*20) * 4; 
    text.position.y = Math.cos(time2*15) * 2; 

    if(!lcbool){
	sphere44.rotation.x += 0.001;
	sphere44.rotation.y -= 0.002; 
    }

    
    if(lcbool == true){

	// console.log(sphCap[0]); 
	let cC = 0;

	
	// Revisar si estas modificaciones son relevantes
	/*
	for(let i = 0; i < xgrid; i++){
	    for (let j = 0; j < ygrid; j++){
		//cubos2[cC].position.x = 1+(pX[cC]* (Math.sin(time2+i)* 2));
		//cubos2[cC].position.y = 1+(pY[cC]* (Math.sin(time2+j)* 1));
		// podría haber una condicional para la distribución vertical u horizontal
		//cubos2[cC].position.x = (pX[cC] * (Math.sin(time1+i+j)* 2));
		//cubos2[cC].position.y = (pY[cC] * (Math.sin(time1+i+j)* 2));
		//cubos2[cC].position.z = (pZ[cC] * (Math.sin(time1+i+j)* 2));
		// cubos2[cC].rotation.x += Math.sin(time2+i)*0.002; 
		cubos2[cC].scale.x = 1+Math.sin(time2+i+j)*4;
		cubos2[cC].scale.y = 1+Math.sin(time2+i+j)*4;
		// cubos2[cC].lookAt(0, 0, 0); 
		cubos2[cC].lookAt(th.camera.position); 
		cC++; 
	    }
	    }
	    */
	}
	

    /*
    th.camera.position.x += ( mouseX - th.camera.position.x *0.5) * .5;
    th.camera.position.y += ( - mouseY - th.camera.position.y ) * .5;
    th.camera.lookAt( th.scene.position );
    */

    // Esto se tiene que convertir en otra cosa
    if(boolCosa) {
	//cosa.pointer = cursorX / 20;
	//cosa.freqScale =  (cursorY/100)-2.2;
	gloop.update(); 
    }    

    raycaster.setFromCamera( pointer, th.camera );
    const intersects = raycaster.intersectObjects( th.scene.children, true );
 
    if ( intersects.length > 0 ) {
	if ( INTERSECTED != intersects[ 0 ].object && intersects[0].object.material.emissive != undefined) { // si INTERSECTED es tal objeto entonces realiza tal cosa


	    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
	    
	    INTERSECTED = intersects[ 0 ].object;
	    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
	    INTERSECTED.material.emissive.setHex( 0xb967ff );
	    /// primer nivel 
	    document.getElementById("container").style.cursor = "pointer";
	    infoBool = false; 
	    //controls.autoRotate = false; 
	    interStr = INTERSECTED.userdata.id;
	    
	    if( fBool){
		onclick=function(){
		   
		    // Procesamiento antes de imprimir
		    // INTERSECTED.material.color = 0x05ffa1 ;
		    var markd = markdown[parseInt(INTERSECTED.userdata.id.slice(0, 4))];
	
		    
		    texto(markd);
		    controls.target =INTERSECTED.position; 
		    //if(lcbool){
			//positions.push(INTERSECTED.position);
			//curve(positions); 
		    //}
		}; 
	    }
	    	    
	    // la lectura de la fuente tiene que suceder en otro momento 
	    // console.log(interStr);
	    document.getElementById("instrucciones").innerHTML = interStr;
	     
	}
	
    } else {
	
	if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
	
	//controls.autoRotate = true; 
	//controls.autoRotateSpeed = 0.5; 
	
	INTERSECTED = null;
	document.getElementById("container").style.cursor = "default";
	interStr = '';
	if(!infoBool){
	    //document.getElementById("instrucciones").innerHTML = "";
	} 
    } 
    
    TWEEN.update();
   
    hy.vit.needsUpdate = true; 
    const delta = clock.getDelta();

    renderTarget.flipY = true;
    renderTarget.needsUpdate = true;
    th.renderer2.setRenderTarget(renderTarget);
    
    th.renderer2.setClearColor(0x000000, 0);
    th.renderer2.render(rtScene, rtCamera);
    th.renderer2.setRenderTarget(null);
    
    th.renderer2.render( th.scene, th.camera );
    un.render2(delta);
    requestAnimationFrame( animate );

}
    
// ¿Esto también podría ir a otra parte?
function change(){
    
    if(interStr == 'imprimir'){
	printPDF(); 
    }
 
    if(interStr == 'iniciar'){
	saveNotes(); 
	const coords = {x: th.camera.position.x,
			y: th.camera.position.y,
			z: th.camera.position.z} // Start at (0, 0)
	
	tween = new TWEEN.Tween(coords, false) // Create a new tween that modifies 'coords'.
	    .to({x: 0, y: 0, z: 20}, 2000) // Move to (300, 200) in 1 second.
	    .easing(TWEEN.Easing.Quadratic.InOut) 
	    .onUpdate(() => {
		th.camera.position.z=coords.z;
	    })  
	    .onStart(() => {
		document.getElementById("info").innerHTML = ""; // cuando tween termine 
	    })
	    .onComplete(() => {
		livecodeame(); 
		const request = new XMLHttpRequest();
		request.open('GET', 'snd/uxmal.wav', true);
		request.responseType = 'arraybuffer';
		self.buffer = 0; 
		request.onload = function() {
		    let audioData = request.response;
		    a.audioCtx.decodeAudioData(audioData, function(buffer) {
			// buffer = buffer2;
			boolCosa = true; 
			cosa.set(buffer, Math.random(), 1, 1, 0.05, 0.6);
			cosa.start();

			gloop.seqpointer = [0.1, 0.3, 0.5];
			gloop.seqfreqScale = [1, 0.5, 4, 2]; 
			gloop.seqwindowSize = [1, 0.01, 2];
			gloop.overlaps = [0.11, 2];
			gloop.windowRandRatio = [0.5, 0.1, 0.5, 1, 0.21]; 
			gloop.start();
			boolCosa = true;
			
		    },
					       function(e){"Error with decoding audio data" + e.error});
    }
	    	request.send();
	    })

	
	//trambién hay onComplete
	    .start() // Start the tween immediately. No poner alguna propiedad, supongo que sustituye el tiempo de inicio y llegada. 
    }

}

function change_uvs( geometry, unitx, unity, offsetx, offsety ) {
    const uvs = geometry.attributes.uv.array;
    for ( let i = 0; i < uvs.length; i += 2 ) {
	uvs[ i ] = ( uvs[ i ] + offsetx ) * unitx;
	uvs[ i + 1 ] = ( uvs[ i + 1 ] + offsety ) * unity;
    }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
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;
}

function livecodeame(){

    th.scene.remove( sphere44 );  
    th.scene.add( sphereP1 );

    lcbool = true; 
    console.log("lc");
    controls.enabled = true; 
    
    // remover
    // esto podría tener una rampa
    // falta el dispose

    // Estos cubos ya no existen creo

    /*
    for(let i = 0; i < menuC1str.length; i++){
	th.scene.remove(cubos[i]); 
    }

    th.scene.remove(sphere44);
    */
    // agregarmesh.geometry.attributes.position.needsUpdate = true;

    // Podrían conservarse estos elementos en las esferas desplegadas 
    
    const ux = 1 / xgrid;
    const uy = 1 / ygrid;
    const xsize = 1000 / xgrid;
    const ysize = 1000 / ygrid;

    let cCount = 0;
    
    /*
   
    for(let i = 0; i < xgrid; i++){
	for (let j = 0; j < ygrid; j++){

	    //const geometry22 = new THREE.SphereGeometry(1, 3, 4 );
	    const geometry22 = new THREE.BoxGeometry(1.5, 1.5, 0.5); 
	    change_uvs( geometry22, ux, uy, i, j );
	    // podría no hacer referencia a hydra sino a otra cosa, por ejemplo podrían tener formas, colores y materiales distintos dependiendo del capítulo o del tipo de nota. 
	    // materialslc = new THREE.MeshStandardMaterial( { color: 0x6a6a6a, roughness: 0.5, metalness:0.1 } );
	    materialslc[ cCount ] = new THREE.MeshPhongMaterial( { color: 0xffffff,  map: renderTarget.texture } );
	    // materials[ cubeCount ] = new THREE.MeshLambertMaterial( parameters );
	    let material2lc = materialslc[ cCount ];
	    
	    cubos2[cCount] = new THREE.Mesh( geometry22, material2lc );
	    
	    var posX, posY, posZ;
	    var theta1 = Math.random() * (Math.PI*2);
	    var theta2 = Math.random() * (Math.PI*2); 
	    	    
	    posX = Math.cos(theta1) * Math.cos(theta2)*1;
	    posY = Math.sin(theta1)*1;
	    posZ = Math.cos(theta1) * Math.sin(theta2)*1;
	    
	    //posX = ( i - xgrid / 12 ) -6;
	    //posY = ( j - ygrid / 5 ) -2.5;
	    //posZ = (Math.random() * 1)-0.5;
	    
	    pX[cCount] = cCount*0.5 - (markdown.length/4); 
	    // pX[cCount] = posX*(Math.random()*100);
	    pY[cCount] = posY*(Math.random()*40);
	    pZ[cCount] = posZ*(Math.random()*40); 
	    cubos2[cCount].position.x = pX[cCount]  ; 
	    cubos2[cCount].position.y = pY[cCount] ;
	    cubos2[cCount].position.z = pZ[cCount]  ;
	    cubos2[cCount].rotation.x = Math.random() * 360; 
	    cubos2[cCount].rotation.y = Math.random() * 360; 
	    cubos2[cCount].rotation.z = Math.random() * 360;
	    cubos2[cCount].userdata = {id:[cCount]};
	    // console.log(cubos2[cCount].userdata.id); 
	    group.add(cubos2[cCount]); 
	    // th.scene.add( cubos2[cCount] );
	    cCount++;
	}

    }

    th.scene.add(group); 

    */
    
}

function loadFont(){
    const loader = new FontLoader();
    const font = loader.load(
	// resource URL
	'fonts/Dela_Gothic_One_Regular.json',
	
	// onLoad callback
	function ( font ) {
	    fuente = font;
	    // console.log(font);
	    fBool = true; 
    
	})
}

function texto( mensaje ){
    //const materialT = new THREE.MeshStandardMaterial({color: 0xffffff, metalnenss: 0.8, roughness: 0.2, flatShading: true});

    const materialT = new THREE.MeshBasicMaterial({color: 0xffffff});
    text.material = materialT; 
    const shapes = fuente.generateShapes( mensaje, 0.5 );
    const geometry = new THREE.ShapeGeometry( shapes );
    // textGeoClon = geometry.clone(); // para modificar
    text.geometry.dispose(); 
    text.geometry= geometry;
    geometry.computeBoundingBox();
    geometry.computeVertexNormals(); 
    const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    const yMid = 0.5 * ( geometry.boundingBox.max.y - geometry.boundingBox.min.y );
    geometry.translate( xMid, yMid, 0 );
    //geometry.rotation.x = Math.PI*2;
    text.geometry= geometry;
    text.rotation = Math.PI * time; 
    rtScene.add(text);
    text.rotation.y = Math.PI * 2
    //text.rotation.z = Math.PI *2
    
    //text.position.y = 0;
    //text.position.x = -4; 
    //let lineasSelectas = [];
    
}

function saveNotes(){

    /*
    const TurndownService = require('turndown').default;	
    var turndownService = new TurndownService()
    
    let markdown = []; 
    
    for(let i = 0; i < db.postdb.length; i++){
	markdown[i] = turndownService.turndown(db.postdb[i].toString());
    }

    
    marksort = markdown.sort();

    */

    for(let i = 0; i < db.postdb.length; i++){
	markdown[i] = db.postdb[i].toString();
    }

    marksort = markdown.sort();

  
    // aquí ya se leen las notas por fecha de modificación 

    // tendría que organizar las notas por capítulos

    // let aclaraciones = [], introduccion, cap1=[],cap2=[],cap3=[], cap4=[], conclusiones=[],referencias=[];

    let notesCoords = []; 
    
    let sphNotes = [];
    let contCol = 0; 

    // Filtrar capítulos 
    
    for(let i = 0; i < marksort.length; i++){	
	   // Solamente se imprimen notas con más de dos caracteres
	if(marksort[i].length > 2 && marksort[i].slice(6, 7) == "0"){

	    var posX, posY, posZ;
	    var theta1 = Math.random() * (Math.PI*2);
	    var theta2 = Math.random() * (Math.PI*2); 

	    // guardar estas posiciones en algún lado, serán el eje de rotación de otras esferas

	    /*
	    posX = Math.cos(theta1) * Math.cos(theta2)*15;
	    posY = Math.sin(theta1)*15;
	    posZ = Math.cos(theta1) * Math.sin(theta2)*15;
	    */

	    const phi = Math.acos(-1+ (2 * contCol) / 8);
	    const theta = Math.sqrt(8 * Math.PI) * phi;

	    const posX = Math.cos(theta) * Math.sin(phi);
	    const posY = Math.sin(theta) * Math.sin(phi);
	    const posZ = Math.cos(phi);   

	    let norm = Math.sqrt(posX*posX + posY*posY+ posZ*posZ); 
	    
	    let vec = new THREE.Vector3((posX / norm)*10, (posY/norm)*10, (posZ/norm)*10); 
	    notesCoords.push(vec); 

	    let nwVec1 = new THREE.Vector3();	    
	    let nwVec2 = new THREE.Vector3(0, 0, 0);

	    //console.log(nwVec1.subVectors(vec, nwVec2)); 
	    //console.log(vec);
	    const geoCap = new THREE.BoxGeometry( 2, 0.25, 0.25); 
	    const matCap = new THREE.MeshStandardMaterial( { color: colors[contCol], emissive: colors[contCol], roughness: 0.4 } ); 
	    sphCap[i] = new THREE.Mesh( geoCap, matCap );
	    // rTarget.setText(); 
	    sphCap[i].userdata = {id:marksort[i].slice(4)};
	    sphCap[i].position.x = vec.x; 
	    sphCap[i].position.y = vec.y; 
	    sphCap[i].position.z = vec.z; 

	    th.scene.add( sphCap[i] );

	    const material = new THREE.LineBasicMaterial( { color: 0xffffff} );
	    const points = [];
	    points.push( new THREE.Vector3(  0, 0, 0 ) );
	    points.push( new THREE.Vector3( posX/norm*10, posY/norm*10, posZ/norm*10 ) );
	    const geometry = new THREE.BufferGeometry().setFromPoints( points );
	    const line = new THREE.Line( geometry, material );

	    th.scene.add(line);

	    contCol++; 
	   
	   
	}
    }

    // Asignar notas en relación a capítulos. Primero tendríamos que saber la cantidad de notas por capítulo
    let notesPerChapter = [];
    let npCh = 0; 

    for(let i = 0; i < marksort.length; i++){
	for(let j = 0; j < notesCoords.length; j++){	    
	    // Solamente se imprimen notas con más de dos caracteres
	    if(marksort[i].length > 2 && marksort[i].slice(6, 7) != "0" && marksort[i].slice(4, 5) == (j+1).toString()){ // y si es distinto al índice de notas
		notesPerChapter[j] = npCh;
		npCh++; 
	    }
	}
    }

    //console.log(notesPerChapter); 
    let finalNotesPerChapter = []; 
    
    for(let i = 0; i < notesPerChapter.length; i++){
	if(i > 0){
	    finalNotesPerChapter[i] = notesPerChapter[i] - notesPerChapter[i-1];
	} else {
	    finalNotesPerChapter[i] = notesPerChapter[i]; 
	}
    }
    // console.log(finalNotesPerChapter);
    console.log(notesCoords); 

    contCol = 0; 
    
    for(let j = 0; j < notesCoords.length; j++){
	for(let i = 0; i < marksort.length; i++){
	    // Solamente se imprimen notas con más de dos caracteres
	   
	    if(marksort[i].length > 2 && marksort[i].slice(6, 7) != "0" && marksort[i].slice(4, 5) == (j+1).toString() && j < 5){ // y si es distinto al índice de notas
		
		var posX, posY, posZ;
		//var theta1 = Math.random() * (Math.PI*2);
		//var theta2 = Math.random() * (Math.PI*2); 

		//posX = notesCoords[j].x*(Math.random()*14);
		//posY = notesCoords[j].y*(Math.random()*14);
		//posZ = notesCoords[j].z*(Math.random()*14); 

		const phi = Math.acos(-1+ (2 * contCol) / finalNotesPerChapter[j]);
		const theta = Math.sqrt(finalNotesPerChapter[j] * Math.PI) * phi;
		
		const posX = Math.cos(theta) * Math.sin(phi);
		const posY = Math.sin(theta) * Math.sin(phi);
		const posZ = Math.cos(phi);   
		
		let norm = Math.sqrt(posX*posX + posY*posY+ posZ*posZ);
		let vec = new THREE.Vector3((posX / norm)*4, (posY/norm)*4, (posZ/norm)*4); 

		//console.log(marksort[i].length /1000);
		const geoNotes = new THREE.BoxGeometry( marksort[i].length/7000,  marksort[i].length/7000,  marksort[i].length/7000 ); 
		const matNotes = new THREE.MeshStandardMaterial( { color: colors[i%8], emissive: colors[i%8], roughness: 0.6 } ); 
		sphNotes[i] = new THREE.Mesh( geoNotes, matNotes );
		// rTarget.setText();
		sphNotes[i].userdata = {id:marksort[i].slice(4)};
		
		let nPosX = vec.x + notesCoords[j].x;
		let nPosY = vec.y + notesCoords[j].y;
		let nPosZ = vec.z + notesCoords[j].z;
	    	    
		sphNotes[i].position.x = nPosX; 
		sphNotes[i].position.y = nPosY; 
		sphNotes[i].position.z = nPosZ;
		
		th.scene.add( sphNotes[i] );
		
		const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
		const points = [];
		points.push( notesCoords[j] );
		points.push( new THREE.Vector3(nPosX, nPosY, nPosZ) );
		const geometry = new THREE.BufferGeometry().setFromPoints( points );
		const line = new THREE.Line( geometry, material );
		
		th.scene.add(line);

		contCol++; 
		// falta guardar la posición de notas y a partir de ahi construir el otro arbol

		if(contCol == finalNotesPerChapter[j]){
		    contCol = 0;
		    console.log("si"); 
		}	
	    }

	    if(marksort[i].length > 2 && marksort[i].slice(6, 7) != "0" && marksort[i].slice(4, 5) == (j+2).toString() && j > 4){ // y si es distinto al índice de notas

		var posX, posY, posZ;
		//var theta1 = Math.random() * (Math.PI*2);
		//var theta2 = Math.random() * (Math.PI*2); 

		//posX = notesCoords[j].x*(Math.random()*14);
		//posY = notesCoords[j].y*(Math.random()*14);
		//posZ = notesCoords[j].z*(Math.random()*14); 

		const phi = Math.acos(-1+ (2 * contCol) / finalNotesPerChapter[j+1]);
		const theta = Math.sqrt(finalNotesPerChapter[j+1] * Math.PI) * phi;
		
		const posX = Math.cos(theta) * Math.sin(phi);
		const posY = Math.sin(theta) * Math.sin(phi);
		const posZ = Math.cos(phi);   
		
		let norm = Math.sqrt(posX*posX + posY*posY+ posZ*posZ);
		let vec = new THREE.Vector3((posX / norm)*2.5, (posY/norm)*2.5, (posZ/norm)*2.5); 

		//console.log(marksort[i].length /1000);
		const geoNotes = new THREE.BoxGeometry( marksort[i].length/7000,  marksort[i].length/7000,  marksort[i].length/7000 ); 
		const matNotes = new THREE.MeshStandardMaterial( { color: colors[i%8], emissive: colors[i%8], roughness: 0.6 } ); 
		sphNotes[i] = new THREE.Mesh( geoNotes, matNotes );
		// rTarget.setText();
		sphNotes[i].userdata = {id:marksort[i].slice(4)};
		console.log(marksort[i].slice(4)); 
		let nPosX = vec.x + notesCoords[j].x;
		let nPosY = vec.y + notesCoords[j].y;
		let nPosZ = vec.z + notesCoords[j].z;
	    	    
		sphNotes[i].position.x = nPosX; 
		sphNotes[i].position.y = nPosY; 
		sphNotes[i].position.z = nPosZ;
		
		th.scene.add( sphNotes[i] );
		
		const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
		const points = [];
		points.push( notesCoords[j] );
		points.push( new THREE.Vector3(nPosX, nPosY, nPosZ) );
		const geometry = new THREE.BufferGeometry().setFromPoints( points );
		const line = new THREE.Line( geometry, material );
		
		th.scene.add(line);

		contCol++; 
		// falta guardar la posición de notas y a partir de ahi construir el otro arbol

		if(contCol == finalNotesPerChapter[j+1]){
		    contCol = 0;
		    console.log(finalNotesPerChapter[j+1]);
		    
		}	
	    }
	    
	}	
    }

    //my_string="hello python world , i'm a beginner"
    // console.log(db.postdb[4].split("root",1)[1])


    /*
    
    //console.log(db.postdb[93].split("data-note-path=\"root").pop());
    let unosss = db.postdb[4].split('data-note-path=\"root').pop().split('\"')[0];
    let dossss = db.postdb[93].split('data-note-path=\"root').pop().split('\"')[1]; 

    console.log(unosss); // returns 'two'
    console.log(dossss); 

    */
    //let nwregex = /root(.*)\n/g
    
    //console.log(index); 
    
    //console.log(regexText.test(db.postdb[4])); 
    
    // si dos notas coniciden en lo que está entre root y un espacio entonces hay una conexión entre dos puntos 

    let contNota = 0;

    // Sustituir esto 
    
    for(let i = 0; i < db.postdb.length; i++){
	if(db.postdb[i].length > 2){
	    notas[contNota] = db.postdb[i];
	    contNota++; 
	}
    }
    
    /*
    // console.log(notas.join(" "));
    const fakeText = new Text(notas.join(" "));
    //console.log(fakeText); 
    const sentence = fakeText.makeSentence();
    console.log(sentence);
    */

    /*
    for(let i = 0; i < notas.length; i++){
	markdown[i] = turndownService.turndown(notas[i].toString());
	markdown[i] = markdown[i].split(".").join("\n"); 
	}
   

    // queda pendiente eliminar indices 
    console.log(markdown.length);
    */
    // console.log(sphCap[0]); 
    noteBool = true; 
}

function curve(positions){

    th.scene.remove(curveObject); 
    geometryCurve.dispose();
    materialCurve.dispose(); 
    //Create a closed wavey loop
    curve1 = new THREE.CatmullRomCurve3( positions );

    curve1.closed = true; 
    
    const points = curve1.getPoints( 50 );

    geometryCurve = new THREE.BufferGeometry().setFromPoints( points );

    // console.log(geometryCurve); 

    materialCurve = new THREE.LineBasicMaterial( { color: 0x05ffa1, linewidth: 5 } );
    // Create the final object to add to the scene
    curveObject = new THREE.Line( geometryCurve, materialCurve );
 
    curveObject.geometry.attributes.position.needsUpdate = true;
    
    // console.log(geometryCurve);
    th.scene.add(curveObject); 
}
 
function codeEditorFunc(){

    codeBool = !codeBool;

    console.log(codeBool); 
    if(codeBool){
	ed.style.display = 'block';     
    } else {
	ed.style.display = 'none';     
    }
    
}

function backgroundFunc(){

    backBool = !backBool;
    console.log(backBool); 

    if(backBool){
	//th.scene.background = renderTarget.texture; 
	th.scene.background = hy.vit; 
	// th.scene.background = new THREE.Color( 0x000000 );
    } else {
	th.scene.background = new THREE.Color( 0x000000 );
    }
    
}

function informationFunc(){
    infoBool = !infoBool; 
    console.log(infoBool); 
    document.getElementById("instrucciones").innerHTML = "Clic en el cubo para iniciar.</br>El icono de impresora arroja la versión PDF de este documento.</br>También es posible activar una versión livecodeable y activar y desactivar la textura al fondo.";   
}

function disposeLines(){
    // falta detener el movimiento de la esfera 
    th.scene.remove(curveObject); 
    geometryCurve.dispose();
    materialCurve.dispose();
    positions = []; 
}
