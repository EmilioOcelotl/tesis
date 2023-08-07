// En controlSetup definitivamente tiene que estar osc 
// También tendría que estar lo de gamepad
// Y lo de codeMirror 

import { MultiTxt } from "./textSetup"

const OSC = require('osc-js'); // pal osc 

function TxtOsc(scene){
    
    self = this; 

    self.nText = new MultiTxt(scene); 

    self.osc = new OSC();
    self.osc.open();
    
    self.text = function(){
	self.on('/message', message => {
	    self.nText.txtUpdate(message.args[0]); 
	})
    }
    
}

function GamePad(){

    // button 0 = b
    // button 1 = a 
    
    self = this;
    
    self.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

    self.update = function(){

	var pads = navigator.getGamepads();
	// console.log(pads[0].buttons[9].pressed);

	if(pads[0].buttons[1].pressed){
	    
	    let rand = Math.floor(Math.random(8)*10);
	    console.log(rand); 
	}

    }
        
}

function keyDown(){
    
}

export { TxtOsc, GamePad }
