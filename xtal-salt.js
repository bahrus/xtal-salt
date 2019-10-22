import { define } from 'trans-render/define.js';
import { disabled, hydrate } from 'trans-render/hydrate.js';
import { XtallatX } from 'xtal-element/xtal-latx.js';
const clear_selector = 'clear-selector';
/**
 * Web Component wrapper around the XSLT processor
 * @element xtal-salt
 */
export class XtalSalt extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._domParser = new DOMParser();
        this._clearSelector = null;
        this._target = null;
        this._c = false;
    }
    static get is() { return 'xtal-salt'; }
    static get observedAttributes() {
        return super.observedAttributes.concat(clear_selector);
    }
    get xmlString() {
        return this._xmlString;
    }
    /**
     * XML input string
     */
    set xmlString(nv) {
        this._xmlString = nv;
        this._xml = this._domParser.parseFromString(nv, 'application/xml');
        this.onPropsChange();
    }
    get xml() {
        return this._xml;
    }
    /**
     * XML input (parsed) document
     */
    set xml(nv) {
        //if(nv === this._xml) return;
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
    /**
     * XSL input string
     * @type {String}
     */
    set xslString(nv) {
        //if(nv === this._xslString) return;
        this._xslString = nv;
        this._xsl = this._domParser.parseFromString(nv, 'application/xml');
        this.createProcessor();
    }
    get clearSelector() {
        return this._clearSelector;
    }
    /**
     * CSS Selector inside target that should be removed prior to rendering/
     * @attr clear-selector
     */
    set clearSelector(nv) {
        this.attr(clear_selector, nv);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case clear_selector:
                this._clearSelector = nv;
                break;
        }
    }
    createProcessor() {
        this._xsltProcessor = new XSLTProcessor();
        this._xsltProcessor.importStylesheet(this._xsl);
        this.onPropsChange();
    }
    get target() {
        return this._target;
    }
    /**
     * Target element to render the result of the XSLT transform.
     */
    set target(t) {
        this._target = t;
        this.onPropsChange();
    }
    connectedCallback() {
        this._c = true;
        this.style.display = 'none';
        this.propUp([disabled, 'xmlString', 'xslString', 'xml']);
        //this.onPropsChange();
    }
    onPropsChange() {
        if (this._disabled || !this._c || !this._xml || !this._xsltProcessor)
            return;
        if (this._target === null) {
            this._target = this.parentElement;
        }
        if (this._target === null)
            return;
        if (this._clearSelector) {
            const clear = this._target.querySelector(this._clearSelector);
            if (clear !== null)
                clear.remove();
        }
        const resultDocument = this._xsltProcessor.transformToFragment(this._xml, document);
        this._target.appendChild(resultDocument);
    }
}
define(XtalSalt);
