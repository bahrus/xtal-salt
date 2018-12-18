import { define } from 'xtal-latx/define.js';
import { XtallatX, disabled } from 'xtal-latx/xtal-latx.js';
// const xml_string = 'xml-string';
// const xsl_string = 'xsl-string';
export class XtalSalt extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._domParser = new DOMParser();
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
    get xslString() {
        return this._xslString;
    }
    set xslString(nv) {
        this._xslString = nv;
        this._xsl = this._domParser.parseFromString(nv, 'text/xml');
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
        this._upgradeProperties([disabled, 'xmlString', 'xslString']);
        this.onPropsChange();
    }
    onPropsChange() {
        if (this._disabled || !this._c || !this._xml || !this._xsltProcessor)
            return;
        if (!this._target) {
            this._target = this;
        }
        this.style.display = (this._target === this) ? 'block' : 'none';
        this._target.innerHTML = '';
        const resultDocument = this._xsltProcessor.transformToFragment(this._xml, document);
        this._target.appendChild(resultDocument);
    }
}
define(XtalSalt);
//# sourceMappingURL=xtal-salt.js.map