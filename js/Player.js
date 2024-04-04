
class Player {

	constructor(aCtx, type = 'player') { // aquí hace falta poner la secuencia, audiofile está en html 

		this.buffer = 0;
		self = this;
		this.audioCtx = aCtx;
		this.audioFile = 0;
		this.futureTickTime = this.audioCtx.currentTime;
		this.counter = 1;
		this.tempo = 120;
		this.secondsPerBeat = 120 / this.tempo,
			this.counterTimeValue = (this.secondsPerBeat / 4),
			this.timerID = undefined,
			this.isPlaying = false;
		this.seq = [0, 0, 0, 0, 0, 0, 0, 0];
		// this.buffer = audioFile; 
		//self.source.connect(self.audioCtx.destination) // Pregunta: una vez que termina, también se desconecta? 
		//self.source.start() // no es necesario reproducirlo aqui
		// console.log("sample");
		// console.log(self.buffer);

		// aquí se reproduce la secuencia 

		// ¿eso es innecesario? No aparece en algún otro lado
	}

	load = function (audioFile) {
		this.buffer = audioFile;
	}

	startSeq = function () {
		this.counter = 0;
		this.futureTickTime = this.audioCtx.currentTime;
		this.scheduler();
	}

	playSource = function (time) {
		//console.log("Inicio"); 
		this.source = this.audioCtx.createBufferSource();
		this.source.connect(this.audioCtx.destination);
		this.source.buffer = this.buffer;
		this.source.start(this.audioCtx.currentTime + time);
	}

	schedule = function (time) {
		if (this.seq[this.counter] == 1) {
			this.playSource(time);
			//console.log("Suena"); 
		}
	}

	playTick = function () {
		// console.log(self.counter);
		this.secondsPerBeat = 70 / this.tempo;
		this.counterTimeValue = (this.secondsPerBeat / 4);
		this.counter += 1;
		this.futureTickTime += this.counterTimeValue;
		if (this.counter == this.seq.length) {
			this.counter = 0;
		}
	}

	scheduler = function () {
		if (this.futureTickTime < this.audioCtx.currentTime + 0.1) {
			this.schedule(this.futureTickTime - this.audioCtx.currentTime);
			this.playTick();
		}

		this.timerID = setTimeout(this.scheduler.bind(this), 0);
	}

	sequence = function (seq) {
		this.seq = seq;
	}

	stop = function () {
		clearTimeout(this.timerID);
	}

	// console.log(self.buffer); 
	// self.load(); // esto es mandatory 

}

export { Player }


/*
function Player (aCtx, audioFile){ // aquí hace falta poner la secuencia, audiofile está en html 

	self = this; 
	self.audioFile = audioFile;

	self.audioCtx = aCtx;
    
	// self.startTime = self.audioCtx.currentTime; // para medir

	// si no hay argumentos, entonces reproduce el audio una sola vez

	// separar load al menos para conceptualmente tener claro que primero se tiene que cargar el archivo. Esto sucede en cada evento
	// self.source;

	//self.buffer = 0;

	self.futureTickTime = self.audioCtx.currentTime,
	self.counter = 1,
	self.tempo = 120,
	self.secondsPerBeat = 60 / self.tempo,
	self.counterTimeValue = (self.secondsPerBeat / 4),
	self.timerID = undefined,
	self.isPlaying = false;
	self.seq = [0, 0, 0, 0, 0, 0, 0, 0]; 
	self.buffer = audioFile; 
		//self.source.connect(self.audioCtx.destination) // Pregunta: una vez que termina, también se desconecta? 
		//self.source.start() // no es necesario reproducirlo aqui
	console.log("sample");
	// console.log(self.buffer);
   
	// aquí se reproduce la secuencia 
    
	// ¿eso es innecesario? No aparece en algún otro lado
    
	self.startSeq = function(){
	self.counter = 0;
	self.futureTickTime = self.audioCtx.currentTime;
	self.scheduler(); 
	}
    
	self.playSource = function(time){
	console.log("algo"); 
	self.source = self.audioCtx.createBufferSource();
	self.source.connect(self.audioCtx.destination);
	self.source.buffer = self.buffer;
	self.source.start(self.audioCtx.currentTime + time);
	}

	self.schedule = function(time){
	if(self.seq[self.counter] == 1){ 
		self.playSource(time);
		console.log("otro algo"); 
	}
	}

	self.playTick = function() {
	console.log(self.counter);
	self.secondsPerBeat = 60 / self.tempo;
	self.counterTimeValue = (self.secondsPerBeat / 1);
	self.counter += 1;
	self.futureTickTime += self.counterTimeValue;
	if(self.counter == self.seq.length){
		self.counter = 0; 
	}

	}
    
	self.scheduler = function() {
	if (self.futureTickTime < self.audioCtx.currentTime + 0.1) {
			self.schedule(self.futureTickTime - self.audioCtx.currentTime);
			self.playTick();
	}

	self.timerID = setTimeout(self.scheduler.bind(this), 0);
	}

	self.sequence = function(seq){
	self.seq = seq; 
	}

	self.stop = function(){
	clearTimeout(self.timerID);
	}

	// console.log(self.buffer); 
	// self.load(); // esto es mandatory 
   
}

export { Player }
*/
