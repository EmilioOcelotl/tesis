class Load {
    constructor(aCtx, audioFile, type='load') {
	aCtx.resume(); // Según yo se queda de la configuración del caché
	this.audioCtx = aCtx; // Para pasar el ctx
	this.buffer = 0;
	this.revBuffer = 0; // Solo Dios sabe si esto  va a funcionar

	// algo 
	
	
    }
}

module.exports = { Load }
