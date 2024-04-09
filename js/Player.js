
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

	start = function () {
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


