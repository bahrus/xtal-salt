import {define} from 'trans-render/define.js';
import {disabled, hydrate} from 'trans-render/hydrate.js';
import {XtallatX} from 'xtal-element/xtal-latx.js';


const clear_selector = 'clear-selector';
/**
 * Web Component wrapper around the XSLT processor
 * @element xtal-salt
 */
export class XtalSalt extends XtallatX(hydrate(HTMLElement)){
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
    /**
     * XML input string
     */
    set xmlString(nv){
        this._xmlString = nv;
        this._xml = this._domParser.parseFromString(nv, 'application/xml');
        this.onPropsChange();
    }

    _xml!: Document;
    get xml(){
        return this._xml;
    }
    /**
     * XML input (parsed) document
     */
    set xml(nv){
        //if(nv === this._xml) return;
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
    /**
     * XSL input string
     * @type {String}
     */
    set xslString(nv){
        //if(nv === this._xslString) return;
        this._xslString = nv;
        this._xsl = this._domParser.parseFromString(nv, 'application/xml');
        this.createProcessor();
        
    }

    _clearSelector: string | null = null;
    get clearSelector(){
        return this._clearSelector;
    }
    /**
     * CSS Selector inside target that should be removed prior to rendering/
     * @attr clear-selector 
     */
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
    

    createProcessor(){
        this._xsltProcessor = new XSLTProcessor();
        this._xsltProcessor.importStylesheet(this._xsl);
        this.onPropsChange();
    }
    _target: Element | null = null;
    get target(){
        return this._target;
    }
    /**
     * Target element to render the result of the XSLT transform.
     */
    set target(t: Element | null){
        this._target = t;
        this.onPropsChange();
    }

    _c = false;
    connectedCallback(){
        this._c = true;
        this.style.display = 'none';
        this.propUp([disabled, 'xmlString', 'xslString', 'xml']);
        //this.onPropsChange();
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