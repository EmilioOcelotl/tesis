
// Nueva clase para leer, limpiar e imprimir

const initSqlJs = require('sql.js'); // para leer sql
import pdfkit from 'pdfkit'
// const PDFDocument = require('pdfkit');
const blobStream  = require('blob-stream');
var axios = require('axios').default;
import fs from 'fs';
// import { readFileSync } from "fs";
// var fs = require('fs');

// console.log(text); 

//import fs from 'fs/promises'
//var fs = require('fs');
//const TurndownService = require('turndown')
const TurndownService = require('turndown').default;

function DbReader(db){
    this.txtdb = [],  pretxtdb = [];
    this.postdb = []; 
    this.read = async function(path){
	
	const sqlPromise = initSqlJs({
	    locateFile: file => `./sql/${file}`
	});
	
	const dataPromise = fetch(path).then(res => res.arrayBuffer());
	const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
	const intarr = new Uint8Array(buf);
	const db = new SQL.Database(intarr);
	//const stmt = db.prepare("SELECT notes.noteId FROM notes ORDER BY dateModified DESC"); // como filtrar para que aparezcan en un orden determinado?
	//const stmt = db.prepare("SELECT note_contents.content FROM note_contents ORDER BY note_contents.content ASC"); // como filtrar para que aparezcan en un orden determinado?
	const stmt = db.prepare("SELECT note_contents.content FROM note_contents ORDER BY dateModified DESC");
	// Aquí tendría que ir el statement que ordena por fecha de modificación. ¿Podría obtener el stmt por otro orden y luego ordenarlo? El back está haciendo otras cosas  
	// console.log(stmt); 
	while (stmt.step()) pretxtdb.push(stmt.get()); // recorre y mientras stmt.step() arroje verdadero, entonces imprime los valores de stmt
	stmt.free();
	// liberar o cerrar hay que checar bien eso
	// convertir de uint8Aimport text from 'bundle-text:./myFile'; rray a un string leíble ( en caso de que sea un uint8array ), si no lo es, deja intacto el texto

	for(let i = 0; i < pretxtdb.length; i++){
	    if(ArrayBuffer.isView(pretxtdb[i][0])){
		var string = new TextDecoder().decode(pretxtdb[i][0]);
		pretxtdb[i] = string;
	    }
	}

	// limpiar la base de datos para quitar los elementos vacíos 
	// Revisar de vez en cuanddo para ver si algo no se está escapando. 
	
	for(let i = 0; i < pretxtdb.length; i++){
	    if(pretxtdb[i].length != 0){
		if(i < 50){
		    this.txtdb.push(pretxtdb[i][0].toString()); // viejo formato
		} else {
		    this.txtdb.push(pretxtdb[i].toString()); // nuevo formato
		}
	    }
	}
	// var regexCode = /<\/\/code/ig;
	// Encontrar una forma más eficiente de eliminar los últimos indices. En otras ocasiones han cambiado. 
	this.postdb = this.txtdb.slice(0, this.txtdb.length-5); // Estos índices ya cambiaron 
	// console.log(this.postdb[105]); 
    }
}

// limpiar db con algún parser 

function dbParser(db){

    const dbsort = db.sort();
	
    var turndownService = new TurndownService()
    var markdown = turndownService.turndown(dbsort.join(' '))
    // console.log(markdown);
    this.db = markdown;  
}

// Crear documento con pdfkit 

function createDoc(md){

    const doc = new pdfkit({font: 'Courier', layout: 'landscape'}); 
    // doc.text(str, 100, 100);
    //const doc = new PDFDocument;
    // pipe the document to a blob
    const stream = doc.pipe(blobStream());
    // add your content to the document here, as usual
    // get a blob when you're done

    // create a document the same way as above
    // Con este sistema sería posible ordenar por bloques de notas y de subcapítulos y de capítulos. 
    
    // doc.text('Este es un bloque de texto mucho mayor entonces voy a ver si funciona bien, probablemente cambiaré a este sistema', 100, 100);

    // console.log(md); 
    // let str = md; 

   
    
    doc.fontSize(12);
    
    doc.text(md,
	     {linebreak: false});

    doc.addPage();
  
    
    doc.end();
    stream.on('finish', function() {
	// get a blob you can do whatever you like with
	// const blob = stream.toBlob('application/pdf');
	// or get a blob URL for display in the browser
	const url = stream.toBlobURL('application/pdf');
	iframe.src = url;
    });
    
    document.getElementById("instrucciones").innerHTML = "";
    var iframe = document.querySelector('iframe');
    iframe.style.visibility = 'visible';
    
    const container = document.getElementById( 'container' );
    container.remove();
    
    
}

export { DbReader, dbParser, createDoc }
