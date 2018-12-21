import { define } from 'xtal-latx/define.js';
import { XtallatX, disabled } from 'xtal-latx/xtal-latx.js';
// const xml_string = 'xml-string';
// const xsl_string = 'xsl-string';
export class XtalSalt extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._domParser = new DOMParser();
        this._target = null;
        this._c = false;
    }
    static get is() { return 'xtal-salt'; }
    get xmlString() {
        return this._xmlString;
    }
    set xmlString(nv) {
        this._xmlString = nv;
        this._xml = this._domParser.parseFromString(nv, 'application/xml');
        this.onPropsChange();
    }
    get xml() {
        return this._xml;
    }
    set xml(nv) {
        const ua = navigator.userAgent;
        if ((ua.indexOf('Firefox') > -1) || (ua.indexOf('Edge') > -1)) {
            const outerHTML = nv.outerHTML;
            if (outerHTML) {
                this.xmlString = outerHTML;
                return;
            }
        }
        this._xml = nv;
        this.onPropsChange();
    }
    get xslString() {
        return this._xslString;
    }
    set xslString(nv) {
        this._xslString = nv;
        this._xsl = this._domParser.parseFromString(nv, 'application/xml');
        this.createProcessor();
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
    createProcessor() {
        this._xsltProcessor = new XSLTProcessor();
        this._xsltProcessor.importStylesheet(this._xsl);
        this.onPropsChange();
    }
    get target() {
        return this._target;
    }
    set target(t) {
        this._target = t;
        this.onPropsChange();
    }
    connectedCallback() {
        this._c = true;
        this.style.display = 'none';
        this._upgradeProperties([disabled, 'xmlString', 'xslString', 'xml']);
        this.onPropsChange();
    }
    onPropsChange() {
        if (this._disabled || !this._c || !this._xml || !this._xsltProcessor)
            return;
        if (this._target === null) {
            this._target = this.nextElementSibling;
        }
        if (this._target === null) {
            setTimeout(() => {
                this.onPropsChange();
            }, 50);
            return;
        }
        this.style.display = (this._target === this) ? 'block' : 'none';
        this._target.innerHTML = '';
        const resultDocument = this._xsltProcessor.transformToFragment(this._xml, document);
        this._target.appendChild(resultDocument);
    }
}
define(XtalSalt);
//# sourceMappingURL=xtal-salt.js.map