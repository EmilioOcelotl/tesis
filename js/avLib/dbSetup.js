//code 

// ¿dbsetup debería llamarse print o text?
// Si tenemos cierta cantidad de páginas de un texto ¿Cómo podemos distribuir cierta cantidad de imágenes en todo el texto. 
// Hasta donde recuerdo había cits en este documento. Revisar si se perdieron o si todavía son relevantes. 

const initSqlJs = require('sql.js'); // para leer sql
import { jsPDF } from "jspdf";
//const data = require("../../dist/json/imgs.js");
import data from '../../static/json/imgs.js';

 // console.log(data.imgs[0]); 

function DbReader(){

    this.txtdb = [],  pretxtdb = [];
    this.postdb = []; 

    this.read = async function(path){

	const sqlPromise = initSqlJs({
	    locateFile: file => `sql/${file}`
	});

	const dataPromise = fetch(path).then(res => res.arrayBuffer());
	const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
	const intarr = new Uint8Array(buf);
	const db = new SQL.Database(intarr);
	//const stmt = db.prepare("SELECT notes.noteId FROM notes ORDER BY dateModified DESC"); // como filtrar para que aparezcan en un orden determinado?
	const stmt = db.prepare("SELECT note_contents.content FROM note_contents ORDER BY note_contents.content ASC"); // como filtrar para que aparezcan en un orden determinado?
	while (stmt.step()) pretxtdb.push(stmt.get()); // recorre y mientras stmt.step() arroje verdadero, entonces imprime los valores de stmt
	stmt.free(); // liberar o cerrar hay que checar bien eso
	// convertir de uint8Array a un string leíble ( en caso de que sea un uint8array ), si no lo es, deja intacto el texto
	// console.log(pretxtdb); 

	for(let i = 0; i < pretxtdb.length; i++){
	    if(ArrayBuffer.isView(pretxtdb[i][0])){
		var string = new TextDecoder().decode(pretxtdb[i][0]);
		pretxtdb[i] = string;
	    }
	}
	//console.log(pretxtdb); 
	// limpiar la base de datos para quitar los elementos vacíos 
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
	// console.log(this.txtdb.slice(0, this.txtdb.length-5));
	// Encontrar una forma más eficiente de eliminar los últimos indices. En otras ocasiones han cambiado. 
	this.postdb = this.txtdb.slice(0, this.txtdb.length-5); 
    }

    // Aquí pasamos el texto ya trabajado a una serie de modulos analizados etc 

    this.prepare = function(db){

	let prueba = [];

	// NOTA IMPORTANTE: Con el cambio de base de datos parece que las nuevas entradas o las modificaciones se agregan al final de la lista de arreglos, es decir, no quedan ordenadas. Necesitamos algo que ordene cada string alfabéticamente. Esto tiene que suceder antes de que el programa elimine la primera parte, el identificador. 

	const dbsort = db.sort();
	
	// primer filtro: quitar los primeros 13 caracteres y guardar el resultado en un arreglo que después se filtra y transforma. 
	
	for(let i = 3; i < db.length; i++){
	    const firstF = dbsort[i].slice(13);
	    const code = dbsort[i].slice(6, 12);
	    //console.log(code);
	    // para filtrar las entradas que aparecen como código. La referencia a estas notas está en la página web y puede consultarse así como anexo
	    if( code != "//code"){
		prueba.push(firstF);
	    }
	}

	this.result2 = [], this.links = []; 
	// Respetar los saltos de línea, dobles saltos para títulos, quitar caracteres extraños o sustituirlos por espacios
	// Regular expressions ar e the key to powerful, flexible, and efficient text processing (Friedl, 2006)
	const newTest = prueba.join("");	
	var regexRet = /<\/p>/ig;
	let resultRet = newTest.toString().replace(regexRet, "\n\n"); 
	var regexTitle = /<\/h2>/ig;
	let resultTitle = resultRet.toString().replace(regexTitle, "\n\n"); 
	var regexSalto = /\&nbsp;/ig;
	let resultSalto = resultTitle.toString().replace(regexSalto, " "); 
	var regex = /(&nbsp;|<([^>]+)>)/ig;
	let result = resultSalto.toString().replace(regex, "");
	let numChars = 1800
	const palabras = result.split(' ');

	// const titulosregex = /\+(.*)/g;
	// const titulos = palabras.match(titulosregex);
	//console.log(palabras); 
	// Es necesario excluir los saltos de línea como caracteres

	let wordCount = 0, pagsArr = [], total = 0, prueb = [], prepags = 0, last = true, lastNumber = 0, wpp=250; 

	this.pags = 0; 

	//________________________________________________________
	// Todavía hay un problema, los espacios cuentan como caracteres pero en términos del render, ocupan más espacio que las posibles palabras por renglóón
	//________________________________________________________

	// Una vez que ya sé cuántas páginas de texto hay, podría distribuir las páginas de imágenes en el texto 
	// Por acá tendría que ir una parte del código que detecte que hay capítulos y fines de capítulos 
	
	for(let i = 0; i < palabras.length; i++){
	    // por acá tendría que determin
	    if(wordCount > wpp){ // no usar módulo, el primer valor es verdadero y da una pagina de más. 
		prepags++;
		wordCount = 0; 
	    }
	    wordCount++; 
	}
	
	wordCount = 0; 

	for(let i = 0; i < palabras.length; i++){
	    prueb = prueb.concat(palabras[i]); 
	    // Si la cantidad de palabras es mayor que el límite de palabras por página, entonces agrega un bloque y aumenta el número de páginas 
	    if(wordCount > wpp){
		// prueb.join(" "); 
		//console.log(prueb.join(" "));
		//pagsArr.push(prueb);
		this.result2.push(prueb.join(" ")); 
		prueb = []; 
		this.pags++;
		wordCount = 0; 
	    }
	    
	    // si ya estamos en la última página entonces imprime la última página 
	    if(this.pags == prepags && last){
		console.log("última página");
		lastNumber = palabras.length - total;
		last = false; 
	    }
	    
	    // falta imprimir los últimos caracteres, no se imprime la última página si tiene menos de 260 caracteres. A lo mejor un loop for para lo último
	    // También podría lograrse con una resta para imprimir lo últimos caracteres dentro del mismo loop for 
	    wordCount++;
	    total++;
	    // console.log(total%260); 
	}
	
	console.log(palabras.length - lastNumber);
	prueb = []; 

	for(let i = palabras.length - lastNumber; i < palabras.length; i++){
	    prueb = prueb.concat(palabras[i]); 
	}

	this.result2.push(prueb.join(" "));
	// Hubo que cambiar la regex por una iteración. Esto a causa del salto de línea. 
	// Aquí hace falta algún tipo de búsqueda. Si el caracter 1800 es no es un espacio o salto, pasar al siguiente. Así hasta que se cumpla si es un espacio o salgo.

    }

    // Print debería ir en un apartado distinto, tal vez en el render de texto
    
    this.print = function(text){

	// portada, indices, abstract, etc 
	// Considerar guardar los capítulos como entidades indenpendientes. 
	var pageWidth = 10.5,  margin = 1.5, maxLineWidth = pageWidth - margin * 2,   lineHeight = 1, pag = 0;	
	const doc = new jsPDF({unit: "in", lineHeight: lineHeight, format:[10.8, 19.2]});
	// fuente
	// doc.setFont('zapfdingbats', 'normal');
	// doc.setFontType('normal');	
	doc.setFontSize(20);
	// doc.setFontStyle("normal");
	doc.setDrawColor(255, 0, 0);
	doc.rect(0, 0, 10.8, 19.2, "F");
	doc.setTextColor(255);
	// La portada podría también estar en la base de datos. 
	doc.addImage(data.title[0].img, "JPEG", 0, 0, 19.2, 10.8);
	doc.addImage(data.title[0].img, "JPEG", -8.4, 9.6, 19.2, 10.8);
	doc.link(0, 0, 10.8, 19.2, {url: 'https://ocelotl.cc'});
	const portada = doc.splitTextToSize("Universidad Nacional Autónoma de México\n\nPrograma de Maestría y Doctorado en Música\n\nFacultad de Música\nInstituto de Ciencias Aplicadas y Tecnología\nInstituto de Investigaciones Antropológicas\n\n\n\n\n\n\n\n\n\n\n\n\n\nTres Estudios Abiertos\nBuscar un mejor título y subtítulo\n\n\n\n\n\n\n\n\n\n\n\n\n\nQue para optar por el grado de\nDoctor en Música\n(Tecnología Musical)\n\nPresenta\nEmilio Ocelotl Reyes\nTutor Principal: Hugo Solís\nComité Tutor:Iracema de Andrade, Fernando Monreal\n\n", maxLineWidth);
	doc.text(portada, 1.5, 3.5, {align: "left"}); 
	// Agregar la portada 
	doc.addPage();

	/*
	// agregar una página vacía, será esta la causa de que no funcione 
	doc.setFillColor(255, 255, 255);
	doc.rect(0, 0, 10.8, 19.2, "F");
	doc.addPage();
	*/
	
	//doc.addPage();
	//doc.setFillColor(0, 0, 0);
	//doc.rect(0, 0, 10.8, 19.2, "F");

	doc.setFontSize(18);

	const titulosregex = /\·(.*)/g;
	let titulos = [];
	for(let i = 0; i < this.result2.length; i++){
	    const titulo = this.result2[i].match(titulosregex);
	    if(this.result2[i].match(titulosregex)){
		titulos.push(titulo); 
	    }
	}

	// Podría conocer la página exacta de cada elemento del índice e insertar esta página al final. Lo mismo para cada índice.
	
	const titulosprint = titulos.join("\n\n");
	const indice = doc.splitTextToSize("Indice General\n\n\n\n"+titulosprint);
	doc.setFillColor(0, 0, 0);
	doc.rect(0, 0, 10.8, 19.2, "F");
	console.log(titulosprint); 
	doc.text(indice, 1.5, 2.5);
	// Agregar índice
	doc.addPage();
	
	doc.setFillColor(0, 0, 0);
	doc.rect(0, 0, 10.8, 19.2, "F");
	const indiceFiguras = doc.splitTextToSize("Índice de Figuras");
	doc.text(indiceFiguras, 1.5, 2.5);
	// Agregar índice figuras 
	doc.addPage(); 
		
	// Etiquetas para conceptos clave. Cada que se acumulen cierta cantidad de conceptos clave, entonces dibuja una hoja con formas y con hipervínculos a los conceptos clave. También podrían ser los mismos conceptos como palabras y con otras tipografías. 
	// por acá tendría que insertar las páginas de imágenes

	console.log(this.pags); 
	let pagsInt = Math.floor((this.pags+10) / (data.imgs.length));
	console.log(pagsInt); 
	let pagsImgCount = 0; 
	let pagsImgCount2 = 0; 
	
	for(let i = 0; i < text.length; i++){
	    //console.log(pag); 
	    // doc.setDrawColor(255, 0, 0);
	    //let rando = Math.floor(Math.random() * 5); 	    
	    doc.rect(0, 0, 10.8, 19.2, "F");
	    const txtFinal = doc.splitTextToSize(text[i], maxLineWidth); // Hay que investigar el asunto de los números de página 
	    doc.text(txtFinal, 1.5, 2.5);
	    doc.text((pag+1).toString(), 1.5, 17); 
	    // doc.addPage();
	    // Podría alternar los colores de página y de texto
	    doc.addPage([10.8, 19.2], "p");

	    //____________________________________-
	    // Creo que el problema es que la página del texto y de la imagen suceden en la misma iteración. Creo que se podría realizar con INSERT PAGE
	    if(pag%(pagsInt+3) == 0){
		// console.log("imagen");
		if(pagsImgCount2 != 0 && pagsImgCount2 < data.imgs.length+1){
		    // para llevar la cuenta dentro de la iteración principal 
		    pag = pag+1; // por la otra página que agrega   
		}		
		pagsImgCount2++; 
	    }
	    pag++;
	    //console.log(pag); 
	}

	// una iteración secundaria inserta las imágenes 

	let pgInsert = 12;
	
	for(let i = 0; i < data.imgs.length; i++){

//	    const width = Number(data.imgs[pagsImgCount].w);
//	    const height = Number(data.imgs[pagsImgCount].h);

	    const width = 10.8;
	    const height = (Number(data.imgs[pagsImgCount].h)*width) / Number(data.imgs[pagsImgCount].w); 
	    
	    // Se puede redimensionar el tamaño aquí? 
	    
	    doc.insertPage(pgInsert-1);	
	    doc.internal.pageSize.width = width;
	    doc.internal.pageSize.height = height;
	    doc.addImage(data.imgs[pagsImgCount].img, "JPEG", 0, 0, width, height);
	    doc.setFillColor(0, 0, 0);
	    doc.rect(14, 4.8+3, 7, 1.5, "F"); 
	    doc.text(data.imgs[pagsImgCount].nota, 12.5, 5.4+3 );
	    doc.link(0, 0, width, height, {url: data.imgs[pagsImgCount].url});
	    pgInsert = pgInsert + pagsInt;
	    pagsImgCount++;
	}


	//________________--
	// Podría existir una iteración adicional para notas al pie 
	
	
	// También hace falta algo que reconozca la página en la que se encuentra la iteración y que luego imprima en un espacio reservado la cuestión. Podría suceder lo mismo con el cabezal y el pie de página. 
	// Investigar cuántas líneas y cuántos caracteres por línea puede tener un documento.
	// Algo similar para las notas, pero esas tienen que ir a fuerza al final de cada capítulo 
	const f = new Date(); 
	let dateS = f.getDate() + "-"+ f.getMonth()+ "-" +f.getFullYear()+"-"+f.getHours()+"-"+f.getMinutes()+"-"+f.getSeconds();
	// doc.text(JSON.stringify(txtdb[1]), 10, 10);
	doc.save("OcelotlReyesEmilio_Tres_"+dateS+".pdf");
	console.log("PDF Impreso");
	// console.log(JSON.stringify(db)); 
    }

    // El printer tendría que ser otra cosa ?
    // Idea interesante para el futuro: ¿podría leer todos los documentos que tengo e imprimir solamente los comentarios del código?
    // Hay un problema con la última página, pienso que sería conveniente eliminarla para que no se impriman tantas cosas, la otra es aprovechar esos errores para indicar saltos o cambios de algún tipo
    
}

// Compilar la tesis de atrás para adelante 

export { DbReader } 
