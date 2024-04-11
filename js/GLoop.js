// En general: Hay una contradicción entre GLoop y la forma en la que funciona grain. 
// Grain por sí mismo es un secuenciador que sigue la sintaxis de Player pero GLoop no funciona igual 
// Entonces necesito o hacer otra clase que modifique Grains como secuencia o que en el mismo Grains exista la secuencia. 
// Voy a poner el parámetro de ganancia en el loop de tween. En este sentido, el loop debería cambiar más rápido. 

const { map_range } = require('./utils.js');
import * as TWEEN from 'tween'; 

// La clase GLoop se encarga de modificar los parámetros de un sintetizador Grain. Por esto, es el primer elemento del constructor. Hay un parámetro para que el loop no inicie inmediatamente. 

class GLoop {
    
    constructor(grain, seqpointer = [0.5], seqfreqscale = [1], seqwindowsize = [0.15], seqoverlaps = [0.01], seqwindowrandratio = [0.5], seqtime = [8000], grainsequence = [0.5], tweenloop = true, type='gloop'){

		self = this;
		// self.grain = grain;
		this.grain = grain; 
		this.seqpointer = seqpointer;
		this.seqfreqScale = seqfreqscale;
		this.seqwindowSize= seqwindowsize; 
		this.seqoverlaps = seqoverlaps;
		this.seqwindowRandRatio= seqwindowrandratio; 
		this.seqtime = seqtime;
		this.count = 0;
		this.grainsequence = grainsequence; 
		this.tweenloop = tweenloop; 
		// this.gainValue = sequence; // Este parámetro podría ser secuenciado 
	
    }

    // es posible modificar sobre la marcha los valores de Grain. Valdría la pena quitar los parámetros definidos y definir todos de una vez o como una lista. 

    set = function(seqpointer = [0.5], seqfreqscale = [1], seqwindowsize = [0.5], seqoverlaps = [0.75], seqwindowrandratio = [0.5], seqtime = [1000], grainsequence = [0.5], tweenloop = true){
	
		this.seqpointer = seqpointer;
		this.seqfreqScale = seqfreqscale;
		this.seqwindowSize= seqwindowsize; 
		this.seqoverlaps = seqoverlaps;
		this.seqwindowRandRatio= seqwindowrandratio; 
		this.seqtime = seqtime;
		this.count = 0;
		this.grainsequence = grainsequence; 
		this.tweenloop = tweenloop;
	
    }

	load = function(audioFile){
		this.grain.grain.load(audioFile); 
	}


	sequence = function(seq){ // Será una palabra reservada? Revisar colorado 
		this.grainsequence = seq; 
	}

    // Los valores de TWEEN tienen que actualizarse dentro de un bucle. Esto permite tener un continuo con los valores de sonido. Pienso que aquí podría existir una contradicción con respecto a las tasas de señales de control. Investigar cuál es la tasa que utilizan plataformas como SuperCollider. 

    update = function(){
		TWEEN.update(); 
    }

    // Activar o desactivar un loop 

    loop = function(loop){
		this.tweenloop = loop; 
    }

    // Iniciar. Una vez que se inicializa y si los valores del loop son verdaderos, no se detendrá. En este sentido hay que pensar en un botón de pánico o en un fadeOut sutil que permita disminuir la amplitud en un lapso de tiempo. 
    
    start = function(){

	// Estado inicial. Es el estado actual que está cambiando 

    // con esto el start de grain se iniciaría solamente una vez 
	if(this.count == 0){
		console.log("primer start"); 
		this.grain.grain.start(); 
	}
	
	this.paramsInit = {

	    pointer: this.seqpointer[this.count % this.seqpointer.length],
	    freqScale: this.seqfreqScale[this.count % this.seqfreqScale.length],
	    windowSize: this.seqwindowSize[this.count % this.seqwindowSize.length],
	    overlaps: this.seqoverlaps[this.count % this.seqoverlaps.length],
	    windowRandRatio: this.seqwindowRandRatio[this.count % this.seqwindowRandRatio.length],
		sequence: this.grainsequence[this.count % this.grainsequence.length], 
	    time: this.seqtime[this.count % this.seqtime.length]
	    
	}

	// Estado final. Es el estado de llegada. Revisar si puede tener this o si pueden influir sobre la marcha. 

	let paramsEnd = {
	    
	    pointer: this.seqpointer[(this.count+1) % this.seqpointer.length],
	    freqScale: this.seqfreqScale[(this.count+1) % this.seqfreqScale.length],
	    windowSize: this.seqwindowSize[(this.count+1) % this.seqwindowSize.length],
	    overlaps: this.seqoverlaps[(this.count+1) % this.seqoverlaps.length],
	    windowRandRatio: this.seqwindowRandRatio[(this.count+1) % this.seqwindowRandRatio.length],
		sequence: this.grainsequence[(this.count+1) % this.grainsequence.length], 
	    time: this.seqtime[(this.count+1) % this.seqtime.length]
	    
	}

	// Ejecución de la curva. Estaría bueno configurar el tipo de suavizado 
	
	const tween = new TWEEN.Tween(this.paramsInit, false)
	      .to(paramsEnd, 2000) // El tiempo no está siendo secuenciado. Revisar esto en el futuro 
	      .easing(TWEEN.Easing.Quadratic.InOut)

	      .onUpdate(() => { // Cambio del estado inicial al estado final 
		  
		  this.grain.grain.pointer = map_range(this.paramsInit.pointer, 0, 1, 0, this.grain.grain.buffer.duration); 
		  this.grain.grain.freqScale = this.paramsInit.freqScale;
		  this.grain.grain.windowSize = this.paramsInit.windowSize;
		  this.grain.grain.overlaps = this.paramsInit.overlaps;
		  this.grain.grain.windowRandRatio = this.paramsInit.windowRandRatio; 
		  this.grain.grain.gain = this.paramsInit.sequence; 

	      })
	
	      .onComplete(() => { // cuando termina, el estado final se convierte en el estado inicial y se recorren las posiciones en los arreglos, si es que hay más de un elemento. 

			console.log("cambio")
			/*	
		  // console.log(this.grain.grain.pointer); 
		  console.log("cambio"); 
         document.getElementById("mensajes").innerHTML += "<p>pointer: "+this.grain.grain.pointer+"</p>";
         document.getElementById("mensajes").innerHTML += "<p>freqScale: "+this.grain.grain.freqScale+"</p>";
         document.getElementById("mensajes").innerHTML += "<p>windowSize: "+this.grain.grain.windowSize+"</p>";
         document.getElementById("mensajes").innerHTML += "<p>overlaps: "+this.grain.grain.overlaps+"</p>";
         document.getElementById("mensajes").innerHTML += "<p>windowRandRatio: "+this.grain.grain.windowRandRatio+"</p>";

		document.getElementById("mensajes").scrollTop = document.getElementById("mensajes").scrollHeight;
		*/
		  // Para reiniciar
		  if(true){
		      this.start();
		  }

		  // Para cambiar al siguiente índice del arreglo 

		  this.count++; // Esto no se vuelve un problema si el programa se ejecuta constantemente? 
		  
	      })
	
	      .start()

    }

	stop = function(){
		// En algún momento tiene que parar XP 
	}

}	

module.exports = { GLoop } 
