import {define} from 'xtal-latx/define.js';
import {XtallatX, disabled} from 'xtal-latx/xtal-latx.js';

// const xml_string = 'xml-string';
// const xsl_string = 'xsl-string';
const clear_selector = 'clear-selector';
export class XtalSalt extends XtallatX(HTMLElement){
    static get is(){return 'xtal-salt';}
    static get observedAttributes(){
        return super.observedAttributes.concat(clear_selector);
    }

    _domParser = new DOMParser();
   
    _xsl!: Document;
    _xsltProcessor!: XSLTProcessor;

    _xmlString!: string;
    get xmlString(){
        return this._xmlString;
    }
    set xmlString(nv){
        this._xmlString = nv;
        this._xml = this._domParser.parseFromString(nv, 'application/xml');
        this.onPropsChange();
    }

    _xml!: Document;
    get xml(){
        return this._xml;
    }
    set xml(nv){
        const ua = navigator.userAgent;
        if((ua.indexOf('Firefox') > -1) || (ua.indexOf('Edge') > -1)){
            const outerHTML = (<any>nv).outerHTML;
            if(outerHTML){
                this.xmlString = outerHTML;
                return;
            }
        }
        this._xml = nv;
        this.onPropsChange();
        

    }

    _xslString!: string;
    get xslString(){
        return this._xslString;
    }
    set xslString(nv){
        this._xslString = nv;
        this._xsl = this._domParser.parseFromString(nv, 'application/xml');
        this.createProcessor();
        
    }

    _clearSelector: string | null = null;
    get clearSelector(){
        return this._clearSelector;
    }
    set clearSelector(nv){
        this.attr(clear_selector, nv);
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case clear_selector:
                this._clearSelector = nv;
                break;
        }
    }
    // get xsl(){
    //     return this._xsl;
    // }
    // set xsl(nv){
    //     const t = (<any>nv) as HTMLTemplateElement;
    //     if(t.localName === 'template'){
    //         this._xsl = this.appendChild(t.content.cloneNode(true)) as Document
    //     }else{
    //         this._xsl = nv;
    //     }
        
    //     this.createProcessor();
    // }

    createProcessor(){
        this._xsltProcessor = new XSLTProcessor();
        this._xsltProcessor.importStylesheet(this._xsl);
        this.onPropsChange();
    }
    _target: Element | null = null;
    get target(){
        return this._target;
    }
    set target(t: Element | null){
        this._target = t;
        this.onPropsChange();
    }

    _c = false;
    connectedCallback(){
        this._c = true;
        this.style.display = 'none';
        this._upgradeProperties([disabled, 'xmlString', 'xslString', 'xml']);
        this.onPropsChange();
    }


    onPropsChange(){
        if(this._disabled || !this._c || !this._xml || !this._xsltProcessor) return;
        if(this._target === null) {
            this._target = this.parentElement;
        }
        if(this._target === null) return;
        if(this._clearSelector){
            const clear = this._target.querySelector(this._clearSelector);
            if(clear !== null) clear.remove();
        }
        const resultDocument = this._xsltProcessor.transformToFragment(this._xml, document);
        this._target.appendChild(resultDocument);
    }



}
define(XtalSalt);