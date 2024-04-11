import * as THREE from 'three';
import Hydra from 'hydra-synth'

function HydraTex(){

    self = this; 
    //self.hydraInit = function(){
    self.hydra = new Hydra({
	canvas: document.getElementById("myCanvas"),
	detectAudio: false,
	//makeGlobal: false
    }) // antes tenía .synth aqui 
    
    let elCanvas = document.getElementById("myCanvas");
    self.vit = new THREE.CanvasTexture(elCanvas);
	elCanvas.style.filter = 'grayscale(100%)';

    // self.materialVit 
    //}

    self.update = function(){
	// self.vit.needsUpdate = true; 
    }

    self.select = function(cs){
	// let rand = Math.floor(Math.random() * 10);
	switch( cs ){
	case 0:

    	    osc(8,-0.5, 1).color(-1.5, -1.5, -1.5).blend(o0).rotate(-0.5, -0.5).modulate(shape(4).rotate(0.5, 0.5).scale(2).repeatX(2, 2).modulate(o0, () => mouse.x * 0.0005).repeatY(2, 2)).out(o0)

	    src(o2).add(o0, [-0.1, 0.3].smooth().fast(0.2)).layer(src(o0).mask(shape(4, 0.8, 0).repeat().invert())).scrollX(0.0004).scrollY(-0.001).out(o1)


	    src(o1).hue(1.6).color(0.98,0.18,0.98).luma(0.2).colorama(2).posterize([4,2,2,1].smooth(0.9),4).diff(src(o2),0.25).diff(osc([1,2,4,2].smooth(0.9).fast(0.05),0.005),0.75).rotate(()=>time/24).out(o2)

	    src(o1).scrollY(-0.001).colorama(0.001).shift(-0.001).layer(src(o0).diff(src(o0).scrollY(0,-0.1)).scale(2.3).mask(shape(4,[0.5,0].fast(0.1),0.2).scale(0.8,0.5).repeat(1,1).scrollX(-0.3).scrollY(0.1))).layer(src(o2).mask(shape(4,[0,0.5].fast(0.03),0.2).scale(0.8,0.5).repeat(1,1).scrollX(-0.4)).scrollX([0.001,-0.002].fast(0.1)).blend(o3,0.2).scale([1.01,0.99].fast(0.1))).shift(-0.002).colorama(-0.001).layer(src(o2).mask(noise(3,0.5).thresh(0.5)).luma(0.1)).out(o3)
	    render(o3)
	    
	    break;
	case 1:
	    //algo
	    break;
	case 2:
	    //algo
	    break;
	case 3:
	    break;
	case 4:
	    break;
	case 5:
	    break;
	case 6:
	    break;
	case 7:
	    break;
	}

    }
}

export { HydraTex } 
