
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
				"seqs":
					[[1, 0, 0, 0, 0, 0, 1, 0],
					[0, 1, 0, 0, 1, 0, 0, 1],
					[1, 0, 1, 0, 1, 1, 0, 0],
					[1, 0, 0, 0, 1, 0, 1, 0]]
			},
			"sn": {
				"query": "hit clap short",
				"noteseq": true,
				"seqs":
					[[0, 0, 0, 0, 1, 1, 0, 0],
					[0, 0, 0, 0, 1, 0, 1, 0],
					[0, 0, 0, 0, 1, 0, 1, 0],
					[1, 0, 0, 0, 1, 0, 1, 0]]
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
				"query": "kick percussion electronic",
				"noteseq": true,
				"seqs":
					[[1, 0, 0, 0, 0, 0, 1, 0],
					[0, 1, 0, 0, 1, 0, 0, 1],
					[1, 0, 1, 0, 1, 1, 0, 0],
					[1, 0, 0, 0, 1, 0, 1, 0]]
			},
			"sn": {
				"query": "hit wood",
				"noteseq": true,
				"seqs":
					[[0, 0, 0, 0, 1, 1, 0, 0],
					[0, 0, 0, 0, 1, 0, 1, 0],
					[0, 0, 0, 0, 1, 0, 1, 0],
					[1, 0, 0, 0, 1, 0, 1, 0]]
			}
		}
	}
}

export default track0 
