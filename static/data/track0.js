
const track0 = {
    
    "sc0": {
	"tempo": 160,
	"degrees": [50, 52, 54],
	"hydra": "osc(() => cursorY * 0.01, () => cursorX * 0.001, 0).color(0.3, 0.1, 0.5).rotate(0.1, 0.1, 0.5).mult(osc(0.1, 1)).modulateScrollX(o0, 0.99).out(o0);",
	"randomness": 0.5, 
	"wp": {
	    "query": "sonidos de cierto tipo",
	    "noteseq": true
	},
	"bd": {
	    "query": "kick percussion electronic",
	    "noteseq": false,
	    "seqs": [[1, 0, 0, 0, 0, 0, 1, 0],
		     [0, 1, 0, 0, 1, 0, 0, 1],
		     [1, 0, 1, 0, 1, 1, 0, 0],
		     [1, 0, 0, 0, 1, 0, 1, 0]]
	},
	"sn": {
	    "query": "snare",
	    "noteseq": true 
	},
	"hi": {
	    "query": "sonido de hihat",
	    "noteseq": false 
	}
    },
    
    "sc1": {
	"tempo": 120,
	"degrees": [50, 52, 54],
	"hydra": "codigo de hydra",
	"randomness": 0.5, 
	"wp": {
	    "query": "sonidos de cierto tipo",
	    "noteseq": true
	},
	"bd": {
	    "query": "sonidos de cierto tipo",
	    "noteseq": true,
	    "seqs": [1, 0, 0, 0, 1, 0, 0, 0]
	},
	"sn": {
	    "query": "snare",
	    "noteseq": true 
	},
	"hi": {
	    "query": "sonido de hihat",
	    "noteseq": false 
	}
    },

    "sc2": {
	"tempo": 120,
	"degrees": [50, 52, 54],
	"hydra": "codigo de hydra",
	"randomness": 0.5, 
	"wp": {
	    "query": "sonidos de cierto tipo",
	    "noteseq": true
	},
	"bd": {
	    "query": "sonidos de cierto tipo",
	    "noteseq": true,
	     "seqs": [1, 0, 0, 0, 1, 0, 0, 0]
	},
	"sn": {
	    "query": "snare",
	    "noteseq": true 
	},
	"hi": {
	    "query": "sonido de hihat",
	    "noteseq": false 
	}
    }
}

export default track0 
