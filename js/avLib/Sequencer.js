
class Sequencer{

    constructor(aCtx, audioFile, type='sequencer'){
	self = this;
	self.audioFile = audioFile;
	self.audioCtx = aCtx;
	self.buffer = 0;
	self.futureTickTime = self.audioCtx.currentTime,
	self.counter = 1,
	self.tempo = 120,
	self.secondsPerBeat = 60 / self.tempo,
	self.counterTimeValue = (self.secondsPerBeat / 4),
	self.timerID = undefined,
	self.isPlaying = false;
	self.seq = [0, 0, 0, 0, 0, 0, 0, 0];
    }

        // ¿eso es innecesario? No aparece en algún otro lado
    
    startSeq = function(){
	self.counter = 0;
	self.futureTickTime = self.audioCtx.currentTime;
	self.scheduler(); 
    }
    
    playSource = function(time){
	console.log("Playing source"); 
	self.source = self.audioCtx.createBufferSource();
	self.source.connect(self.audioCtx.destination);
	self.source.buffer = self.buffer;
	self.source.start(self.audioCtx.currentTime + time);
    }

    schedule = function(time){
	if(self.seq[self.counter] == 1){ 
	    self.playSource(time);
	    console.log("Moving..."); 
	}
    }

    playTick = function() {
	//console.log(self.counter);
	self.secondsPerBeat = 60 / self.tempo;
	self.counterTimeValue = (self.secondsPerBeat / 1);
	self.counter += 1;
	self.futureTickTime += self.counterTimeValue;
	if(self.counter == self.seq.length){
	    self.counter = 0; 
	}

    }
    
    scheduler = function() {
	if (self.futureTickTime < self.audioCtx.currentTime + 0.1) {
            self.schedule(self.futureTickTime - self.audioCtx.currentTime);
            self.playTick();
	}
	
	self.timerID = setTimeout(self.scheduler, 0);
    }

    sequence = function(seq){
	self.seq = seq; 
    }

    stop = function(){
	clearTimeout(self.timerID);
    }

    // console.log(self.buffer); 
    // self.load(); // esto es mandatory 

    
}

module.exports = { Sequencer } 
