// Este módulo se basa en el trabajo realizado en el Seminario Permanente de Tecnología musical: link seminario. De nuevo la pregunta sobre la referencia a bloques de código más terminados 

import { defaultKeymap } from '@codemirror/commands'
import { EditorState, Prec, Compartment } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import {
  defaultHighlightStyle,
  HighlightStyle,
  syntaxHighlighting
} from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { javascript } from '@codemirror/lang-javascript'
import { keymap, KeyBinding } from '@codemirror/view'

function EditorParser(){
     
    const keymaps = []
    keymaps.push(keymap.of({key: 'Ctrl-Enter', run: () => this.evaluar(), preventDefault: true}))
    keymaps.push(keymap.of(defaultKeymap))

    
    let language = new Compartment, tabSize = new Compartment
    const windowHeight = document.documentElement.clientHeight;

    const myHighlightStyle = HighlightStyle.define([
	{tag: tags.keyword, color: "white"},
	{tag: tags.comment, color: "white", fontStyle: "italic"},
	{tag: tags.string, color: "white"}
    ])

    let textoActivo = "Enlace"
    let url = "https://ocelotl.cc"; 
    
    let state = EditorState.create({
	//doc: JSON.stringify(txtdb[1]), 
	doc: "Tres Estudios Abiertos\n\nInstrucciones. Podrían también formar parte de losa archivos que están en la db",
	extensions: [
	    // hyperLink,
	    keymaps,
	    basicSetup,
	    EditorView.lineWrapping, 
	    language.of(javascript()),
	    // defaultHighlightStyle, 
	    syntaxHighlighting(myHighlightStyle),
	    tabSize.of(EditorState.tabSize.of(8)),
	    EditorView.theme({

		"&": {fontSize:"24px", width: "50%"}, 
		".cm-scroller": { overflox: "auto", height:"50vw"},
		".cm-gutters": {color: "white", background: "transparent"},
		".cm-line":{color:"white"},
		".cm-activeline-background":{background:"black"}
	    })]    
    })
    
    view = new EditorView({
	state, 
	parent: document.querySelector('#editor'),	
    })

    
    this.evaluar = function(){

	const currentLine = view.state.doc.lineAt(
	    view.state.selection.main.head
	).number
	const cursorText = view.state.doc.text[currentLine - 1]
	console.log(cursorText); 

	// ¿aquí mismo podrían ir las comprobaciones de regex?

	
	
	return true
    }
    
}

export { EditorParser }
