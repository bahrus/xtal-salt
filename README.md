[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/xtal-salt)

<a href="https://nodei.co/npm/xtal-salt/"><img src="https://nodei.co/npm/xtal-salt.png"></a>

<img src="http://img.badgesize.io/https://unpkg.com/xtal-salt@0.0.6/dist/xtal-salt.iife.min.js?compression=gzip">

# xtal-salt

xtal-salt allows us to party like it's 1999, and take advantage of the [increasingly popular](https://www.chromestatus.com/metrics/feature/timeline/popularity/79) XSLT processing that [all modern browsers](https://developer.mozilla.org/en-US/docs/Web/XSLT/XSLT_JS_interface_in_Gecko/Advanced_Example) support.

## Use cases

XSLT normally takes XML as its input format.  However, most well-formed html can also qualify.  This can be useful if the light children of an element should be simple html, but it needs to be transformed into complex HTML inside the Shadow DOM.

Other scenarios may arise, you never know -- my cable modem router uses xslt to format xml coming from the router, for example, when going to the admin page.  One could also use XSLT as a stand-in for template instantation, until it is ready.  Though you would probably need to run your object through an [object to xml converter](https://www.npmjs.com/package/object-to-xml) to do this.

## Demo 1

<!--
```
<custom-element-demo>
<template>
    <div>
        <template>
            <catalog>
                <cd>
                    <title>Empire Burlesque</title>
                    <artist>Bob Dylan</artist>
                    <country>USA</country>
                    <company>Columbia</company>
                    <price>10.90</price>
                    <year>1985</year>
                </cd>
                <cd>
                    <title>Hide your heart</title>
                    <artist>Bonnie Tyler</artist>
                    <country>UK</country>
                    <company>CBS Records</company>
                    <price>9.90</price>
                    <year>1988</year>
                </cd>
                <cd>
                    <title>Greatest Hits</title>
                    <artist>Dolly Parton</artist>
                    <country>USA</country>
                    <company>RCA</company>
                    <price>9.90</price>
                    <year>1982</year>
                </cd>

            </catalog>
        </template>
        <!-- Pass down ("p-d") content of template above to xtal-salt's xmlString prop -->
        <p-d on="load" to="xtal-salt" prop="xmlString" val="target.innerHTML" m="1"></p-d>
        <template>
                <?xml version="1.0" encoding="UTF-8"?>
                <xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        
                <xsl:template match="/">
                    <h2>My CD Collection</h2>
                    <div>
                        <div class="header row">
                            <div style="text-align:left" class="left">Title</div>
                            <div style="text-align:left" class="right">Artist</div>
                        </div>
                        <xsl:for-each select="catalog/cd">
                            <div class="row">
                                <div class="left"><xsl:value-of select="title" /></div>
                                <div class="right"><xsl:value-of select="artist" /></div>
                            </div>
                        </xsl:for-each>
                    </div>
                </xsl:template>
                </xsl:stylesheet>
        </template>
        <!-- pass content of template above to xslString prop of next element -->
        <p-d on="load" prop="xslString" val="target.innerHTML"></p-d>
        <xtal-salt></xtal-salt>
        <div></div>
        <style>
                .header .left,.header .right{
                    font-weight: 800;
                }
                .row{
                    display: flex;
                    flex-direction: row;
                }
                .left{
                    flex:1 50%;
                }
                .right{
                    flex:2 50%
                }
            </style>
        <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-salt@0.0.6/dist/xtal-salt.iife.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.97/dist/p-all.iife.js"></script>
    </div>
</custom-element-demo>
```
-->

## Demo 2

<!--
```
<custom-element-demo>
<template>
    <div>
        <my-non-existent-element>
            <!-- "Light Children" -->
            <div>
                <ul>
                    <li>1</li>
                    <li>2</li>
                </ul>
            </div>
            <p-d on="load" to="xtal-salt" prop="xml" val="target.firstElementChild" m="1"></p-d>
            <template>
                <?xml version="1.0" encoding="UTF-8"?>
                <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

                    <xsl:template match="/">
                        <div>
                            <xsl:for-each select="ul/li">
                                <div>const x<xsl:value-of select="."></xsl:value-of> = <xsl:value-of select="."></xsl:value-of>;</div>
                            </xsl:for-each>
                        </div>

                    </xsl:template>
                </xsl:stylesheet>
            </template>
            <p-d on="load" to="xtal-salt" prop="xslString" val="target.innerHTML"></p-d>
            <xtal-salt></xtal-salt>
            <div role="target"></div>
        </my-non-existent-element>
        <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-salt@0.0.6/dist/xtal-salt.iife.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.97/dist/p-all.iife.js"></script>
    </div>
</template>
</custom-element-demo>
```
-->

What's interesting here is that the input is a parsed HTMLDocument node.  We try to pass that parsed node to xtal-salt, so that xtal-salt doesn't need to reparse the "xml".  This works for Chrome, but not Firefox and Edge.  For those browsers, the xml is stringified and reparsed.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP