
const track0 = {
	"sc0": {
		"tempo": 160,
		"degrees": [50, 52, 54],
		"hydra": "osc(() => cursorY * 0.01, () => cursorX * 0.001, 0).color(0.3, 0.1, 0.5).rotate(0.1, 0.1, 0.5).mult(osc(0.1, 1)).modulateScrollX(o0, 0.99).out(o0);",
		"randomness": 0.5,
		"instruments": {
			"bd": {
				"query": "kick percussion electronic",
				"noteseq": true,
				"grain": false, 
				"seqs":
					[[1, 0, 0, 0, 0, 0, 1, 0],
					[0, 1, 0, 0, 1, 0, 0, 1],
					[1, 0, 1, 0, 1, 1, 0, 0],
					[1, 0, 0, 0, 1, 0, 1, 0]]
			},
			"sn": {
				"query": "hit clap short",
				"noteseq": true,
				"grain": false, 
				"seqs":
					[[0, 0, 0, 0, 1, 1, 0, 0],
					[0, 0, 0, 0, 1, 0, 1, 0],
					[0, 0, 0, 0, 1, 0, 1, 0],
					[1, 0, 0, 0, 1, 0, 1, 0]]
			},
			"wp": {
				"query": "cdmx",
				"noteseq": true, 
				"grain": true, 
				"seqs": [0.1], 
				"seqfreqScale": [0.1, 0.12, 0.13, 0.14, 0.15],
				"seqwindowSize": [1, 1.1, 1, 1.4, 1],
				"seqoverlaps": [0.1, 0.5, 0.01, 0.5, 0.1],
				"seqwindowRandRatio": [0, 0.3, 1, 0.3, 0]
			}
		}
	},
	"sc1": {
		"tempo": 160,
		"degrees": [50, 52, 54],
		"hydra": "osc(() => cursorY * 0.01, () => cursorX * 0.001, 0).color(0.3, 0.1, 0.5).rotate(0.1, 0.1, 0.5).mult(osc(0.1, 1)).modulateScrollX(o0, 0.99).out(o0);",
		"randomness": 0.5,
		"instruments": {
			"bd": {
				"query": "bd elektron",
				"noteseq": true,
				"grain": false, 
				"seqs":
					[[1, 0, 0, 0, 0, 0, 1, 0],
					[0, 1, 0, 0, 1, 0, 0, 1],
					[1, 0, 1, 0, 1, 1, 0, 0],
					[1, 0, 0, 0, 1, 0, 1, 0]]
			},
			"sn": {
				"query": "sn elektron ",
				"noteseq": true,
				"grain": false, 
				"seqs":
					[[0, 1, 0],
					[0, 1, 1],
					[0, 1, 0],
					[1, 0, 1]]
			},
			"wp": {
				"query": "cdmx",
				"noteseq": true, 
				"grain": true, 
				"seqs": [0.1, 0.1, 0], 
				"seqfreqScale": [0.1, 0.12, 0.13, 0.14, 0.15],
				"seqwindowSize": [1, 1.1, 1, 1.4, 1],
				"seqoverlaps": [0.1, 0.5, 0.01, 0.5, 0.1],
				"seqwindowRandRatio": [0, 0.3, 1, 0.3, 0]
			}
		}
	}
}

export default track0 
