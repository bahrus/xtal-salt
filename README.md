[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/xtal-salt)

<a href="https://nodei.co/npm/xtal-salt/"><img src="https://nodei.co/npm/xtal-salt.png"></a>

<img src="http://img.badgesize.io/https://unpkg.com/xtal-salt@0.0.6/dist/xtal-salt.iife.min.js?compression=gzip">

# xtal-salt

xtal-salt allows us to party like it's 1999, and take advantage of the [increasingly popular](https://www.chromestatus.com/metrics/feature/timeline/popularity/79) XSLT processing that [all modern browsers](https://www.balisage.net/Proceedings/vol21/html/Thompson01/BalisageVol21-Thompson01.html#d8834e412) support.  XSLT was the first isomorphic solution.


## Use cases

XSLT (< 3.0) normally takes XML as its input format.  However, most well-formed html can also qualify.  This can be useful if the light children of a custom element should be simple html, but it needs to be transformed into complex HTML (or som other form) inside the Shadow DOM.

Other scenarios may arise, you never know -- my cable modem router uses xslt to format xml coming from the router, for example, when going to the admin page.  One could also use XSLT as a stand-in for template instantation, until it is ready.  Though you would probably need to run your object through an [object to xml converter](https://www.npmjs.com/package/object-to-xml) to do this.

In the thoughtful, informative essay [An Adventure with Client-Side XSLT to an Architecture for Building Bridges with Javascript](https://www.balisage.net/Proceedings/vol21/html/Thompson01/BalisageVol21-Thompson01.html), a representative from O'Connor's publishing writes:

>As a legal publisher, one of our main product categories is template-style forms for attorneys, which have undergone a limited evolution in their path to electronic delivery. We have traditionally delivered forms to customers as printed books of forms and subordinate forms for the customer to fill in and manually assemble into a complete document. More recently, we launched a subscription-based online service to deliver all of our content from the web. A departure from a book-oriented concept, the online service joins all of our content together, so users can search across the complete corpus, browse content organized by topic or practice area, annotate, and download forms.

>Truly unified with a modern JavaScript UI, we built an XSLT-based application on our terms, uncompromised by the gravity of top-down XML and JavaScript frameworks, and we believe there are strong incentives for combining technologies, each with their best foot forward. 

and concludes:

>Over the last twenty years, the Web has grown increasingly separated from its early XML influences. Despite its evolution into a towering JavaScript monoculture, its ecosystems are now converging on architectures that are fundamentally capable of bridging the gap to other languages. Out of a desire to test that theory, and having a suitable use case for XSLT, emerged a great opportunity to put browser XSLT engines through their paces—and we found them nearly as capable as ever!

## Virtual DOM comes to XSLT?  

Note that version [3.0 of XSLT supports JSON as an input format](https://www.xml.com/articles/2017/02/14/why-you-should-be-using-xslt-30/).  To my knowledge, no browser supports 3.0 yet, [though a hefty 70kb gzipped/minifed JS library is available](http://www.saxonica.com/download/javascript.xml).  Whereas something like lit-html or hyperHTML requires converting dynamic JSON coming from the server to an object, XSLT 3.0 can take the unparsed JSON as it's input.  And interestingly, XSLT 3.0 seems to [support](http://www.saxonica.com/saxon-js/documentation/index.html) sub template updating:

>Instead, the stylesheet can contain rules that respond to user input, such as clicking on buttons, filling in form fields, or hovering the mouse. These events trigger template rules in the stylesheet which can be used to read additional data and modify the content of the HTML page.



## Demo 1

NB:  [CD's](https://www.w3schools.com/xml/xsl_intro.asp) were a popular storage format for music, encyclopedia's, software installation, and PC backup in the [last millenium](https://www.urbandictionary.com/define.php?term=CD).

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

What's interesting here is that the XML input is an already parsed HTMLDocument node.  We try to pass that parsed node to xtal-salt, so that xtal-salt doesn't need to reparse the "xml".  This works for Chrome and Safari, but not Firefox and Edge.  For the latter two browsers, the xml is stringified and reparsed.

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




## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP