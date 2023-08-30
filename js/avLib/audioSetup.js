
// En este documento podríamos agregar entradas y salidas si quisieramos usar el mic de alguna manera 

import { map_range } from './utils.js';

function AudioSetup(){
    
    var self = this;

    self.randomNoiseNode = 0; 
    self.initAudio = 0; 

    // self.microphone = 0;    
    // inicializar audio 

    self.initAudio = function (){
    var AudioContext = window.AudioContext || window.webkitAudioContext // esto será importante ?
    self.audioCtx = new AudioContext()
	
	// self.noise(); 

	console.log("iniciar audio");
    }

    self.suspend = function(){
	self.audioCtx.suspend();
	console.log(" detener audio"); 
    }

    // pienso que todo lo del mic puede ir en un módulo aparte
    
    self.startMic = function() {
	self.microphone.connect(self.audioCtx.destination); // conectarse al audioCtx o a otro lado 
    }

    self.stopMic = function() {
	self.microphone.disconnect(self.audioCtx.destination); 
    }
    
    
    //self.initAudio(); // esto es de pruebas, puede ir afuera, el futuro quitar
    //console.log(self.audioCtx); 
    
}

function Noise(aCtx){

    self = this;
    self.audioCtx = aCtx;
    
    self.noise = async function(){

	await self.audioCtx.audioWorklet.addModule('js/random-noise-processor.https://www.nime2023.org/programjs');
	self.randomNoiseNode = new AudioWorkletNode(self.audioCtx, 'random-noise-processor')
	// self.gainNode = self.audioCtx.createGain();

	// falta el noise por aqui 
	self.gainNoise = self.randomNoiseNode.parameters.get('customGain')
	//self.gainNode.setValueAtTime(0, self.audioCtx.currentTime)
	// self.randomNoiseNode.connect(self.gai); 
	console.log("holillas");
	
    }

    self.gain = function(gain){
	self.gainNoise.setValueAtTime(gain, self.audioCtx.currentTime)
    }
    
    self.start = function(){
	console.log("reproducirRuido");
	//self.randomNoiseNode.connect(self.audioCtx.destination);
	self.randomNoiseNode.connect(self.audioCtx.destination); 
    };
   
    self.stop = function(){
	self.randomNoiseNode.disconnect(self.audioCtx.destination); 
    }

    self.noise(); 

}

function Sine(aCtx){
  
    self = this;
    self.audioCtx =aCtx;
    
    self.sineInit = function(){
	
	// self.audioCtx = aCtx; 
	self.oscillator = self.audioCtx.createOscillator();
	self.gainNode = self.audioCtx.createGain();

	console.log("leeesto");
	self.oscillator.type = "sine";
	self.oscillator.connect(self.gainNode);
	
	self.gainNode.connect(self.audioCtx.destination);
	self.gainNode.gain.setValueAtTime(0, self.audioCtx.currentTime);

	self.gainNode.connect(self.audioCtx.destination); 
	console.log("variableSine"); 
    }

    self.gain = function(gain){
	self.gainNode.gain.setValueAtTime(gain, self.audioCtx.currentTime);
    }

    self.start = function(){
	self.oscillator.start(); 
    }
    
    self.freq = function(freq){
	self.oscillator.frequency.setValueAtTime(freq, self.audioCtx.currentTime); // value in hertz
    }

    self.stop = function(){
	self.oscillator.stop(); 
    }

    self.sineInit();
    
    // falta un método free o algo así 
    
}

// Mic que pueda conectarse a algún lado. Pienso que el mic podría ir en en analizador y no en el inicio 

// tal vez el mic tiene que ir afuera hasta que sepa como funciona bien lo de las promesas 

// Analizador

function Analyser(aCtx){
    
    self = this; // var?
    self.audioCtx = aCtx; 
    self.gainNode = self.audioCtx.createGain();
    
    self.initAnalyser = function(fftSize, smoothing){
	
	
	self.analyser = self.audioCtx.createAnalyser();
	self.analyser.fftSize = fftSize;
	self.bufferLength = self.analyser.frequencyBinCount;
	self.dataArray = new Uint8Array(self.bufferLength);
	//self.analyser.getByteTimeDomainData(self.dataArray) // esto tiene que ir en draw?
	self.analyser.smoothingTimeConstant = smoothing;
	    
	if (navigator.mediaDevices) {
	    navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((stream) => {
		    self.microphone = self.audioCtx.createMediaStreamSource(stream)
		    //self.microphone.connect(self.gainNode); 
		    //self.gainNode.connect(self.analyser); 

		    self.microphone.connect(self.analyser); 
		    
		    console.log("mic"); 
		    // oanimate(); 
		    // samples()
		    // `microphone` can now act like any other AudioNode
		})
		.catch((err) => {
		    console.log(err)
		    // browser unable to access microphone
		})
	} else {
	    // browser unable to access media devices
	    // (update your browser)
	}
	
    }

    self.getData = function(){
	//self.analyser.getByteFrequencyData(self.dataArray) // esto tiene que ir en draw?
	self.analyser.getByteTimeDomainData(self.dataArray)
    }

    self.gain = function(gain){
	    gainNode.gain.setValueAtTime(gain, self.audioCtx.currentTime);
    }
        
}

// Me pregunto si primero podría hacer un análisis del audio para chopear no de acuerdo a un beat específico sino a los ataques del sonido
// Este análisis podría regresarme una especie de arreglo con fracciones de la muestra

// La clase Granular es una mezcla de las funcionalidades de Warp2 para SuperCollider y de la clase grain https://github.com/zya/granular/blob/gh-pages/js/main.js

// valdría la pena encontrar alguna forma de cargar archivos alojados de manera local o por ejemplo abrir el micrófono y hacer grabaciones. En ambos casos necesitaría alguna especie de módulo que cargue o captura el archivo de audio. 

// Primero hacer un player aquí y mover a otro lado la máquina de secuencias 

function LoadFile(aCtx, audioFile){

    self = this; 
    self.buffer = 0;
    self.audioCtx = aCtx; 
    
    self.reader = new FileReader();
    
    self.reader.onload = function (ev) {
	self.audioCtx.decodeAudioData(ev.target.result).then(function (buffer) {
	    self.buffer = buffer; 
	    console.log("loaded");
	    // Por defecto podría tener una configuración inicial cuando termine de cargar.
	    
	    
	})
    }	
    
    self.reader.readAsArrayBuffer(audioFile.files[0]);

}


function Player2(aCtx){ // audiocontext y el archivo a cargar

    self = this;
    // se pueden pasar sin ser objetos independientes? Recuerdo que para algo se necesitaban 
    self.audioCtx = aCtx;
    self.buffer = 0;
    
    // para reproducir la muestra provisionalmente 

    /*
      
      Parámetros de Warp1 en SuperCollider: numChannels, bufnum, pointer, freqScale, windowSize, envbufnum, overlaps, windowRandRadio
      la definición del tamaño se determina con windowSize y el inicio con pointer. 
      Parámetros tentativos: pointer, freqScale, windowSize, overlaps, windowRandRatio

      El proceso de carga se puee juntar, para asociar la carga del archivo y la codificación en el mismo lugar 
      Pointer: Tiene que ser un número entre 0 y 1 y se tiene que mapear a la duración de la muestra
      freqScale: 1 es el archivo tal cual, 2 el doble, encontrar soluciones para reversa
      windowSize: un numero que tiene que ser menor a 1
      overlaps: No me queda claro cómo es la distribución de las ventanas cuanddo se enciman
      windowRandRatio: La distribución anterior podría ser continua o randomizada, este parámetro lo puede lograr. 
      
    */
   
    // self.set = function(buffer, pointer, freqScale, windowSize, overlaps, windowRandRatio){

    self.set = function(buffer, pointer, freqScale, windowSize, overlaps, windowRandRatio){

	// Estos valores tienen que estar al inicio 
	
	self.buffer = buffer; // Primero definir el buffer
	self.pointer = map_range(pointer, 0, 1, 0, self.buffer.duration); // punto e inicio 
	self.freqScale = freqScale; // Problema con valores negativos
	self.windowSize = windowSize; // punto final en el codigo tendria que ser pointer punto de inicio y pointer + wS como final
	self.overlaps = overlaps; // cantidad de ventanas. Seguramente esto funciona en una tasa de ventanas/s, en SC es posible usar numeros de punto flotante
	self.windowRandRatio = windowRandRatio; // 
	
	// console.log(self.pointer); 	
	
    }
   
    // Iniciar y detener 
    // Tal vez necesitemos audioWorklets
    
    self.start = function(){
	// Si no hay buffer, por favor, carga uno
    }

    self.stop = function(){
    }
    
}

// Pensar que todo lo que suena podría ir a una mezcla general o a una especie de null ( pensando en términos de TD ) y luego esa salida se puede aprovechar para otro procesamiento o para enviar a analizador 

// me imagino un analizador mucho más sofisticado 

export { AudioSetup, Sine, Noise, Analyser, Player2, LoadFile }
