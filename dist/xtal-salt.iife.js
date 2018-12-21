
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
// const xml_string = 'xml-string';
// const xsl_string = 'xsl-string';
const clear_selector = 'clear-selector';
class XtalSalt extends XtallatX(HTMLElement) {
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
    get clearSelector() {
        return this._clearSelector;
    }
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
    })();  
        