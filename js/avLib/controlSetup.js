// En controlSetup definitivamente tiene que estar osc 
// También tendría que estar lo de gamepad
// Y lo de codeMirror 

// import { MultiTxt } from "./textSetup"
const OSC = require('osc-js'); // pal osc 
import * as TWEEN from "tween"; 

function twCamera(camera){

    self = this;
    self.camera = camera; 

    self.change = function(toX, toY, toZ, time){

	self.from = {
	    x: self.camera.position.x,
	    y: self.camera.position.y,
	    z: self.camera.position.z 
	}
	
	self.to = {
	    x: toX,
	    y: toY,
	    z: toZ
	}

	self.tween = new TWEEN.Tween(self.from)
	    .to(self.to, time)
	    .easing( TWEEN.Easing.Linear.None)
	    .onupdate(function(){
		self.camera.position.set(self.from.x, self.from.y, self.from.z);
		self.camera.looAt(new THREE.Vector3(0, 0, 0))
	    })
	    .start();

    }
	self.update = function(){
	    self.tween.update(); 
	}
    
}

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

export { TxtOsc, GamePad, twCamera }
