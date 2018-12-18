# xtal-salt

xtal-salt allows us to party like it's 1999, and take advantage of the [increasingly popular](https://www.chromestatus.com/metrics/feature/timeline/popularity/79) XSLT processing that [all modern browsers](https://developer.mozilla.org/en-US/docs/Web/XSLT/XSLT_JS_interface_in_Gecko/Advanced_Example) support.

## Use cases

XSLT normally takes XML as its input format.  However, most well-formed html can also qualify.  This can be useful if the light children of an element should be simple html, but it needs to be transformed into complex HTML inside the Shadow DOM.

Other scenarios may arise, you never know -- my cable modem router uses xslt to format xml coming from the router, for example, when going to the admin page.  One could also use XSLT as a stand-in for template instantation, until it is ready.  Though you would probably need to run your object through a [object to xml converter](https://www.npmjs.com/package/object-to-xml) to do this.

## Demo

<!--
```
<custom-element-demo>
<template>

</custom-element-demo>
```
-->