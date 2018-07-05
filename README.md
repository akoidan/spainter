# lines-logger  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/deathangel908/lines-logger/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/spainter.svg)](https://www.npmjs.com/package/spainter)

# [DEMO](http://spainter.pychat.org/)
# Web browser painter

1. `npm install spainter`

2. in your html file

```
<link rel="stylesheet" type="text/css" href="./index.css"/>
<script src="./index.js"></script>
<div id="spainterContainer"></div>
```

3. In your javascript

```
var p = new Painter(containerPainer)
```


## CAUTION

Spainter uses [flexbox](https://caniuse.com/#feat=flexbox) if you need to support browsers like IE 9 and below, you're free to create a pull request to remove flexbox.

## build
You need to have **curl** **bash** **sassc** commands to be able to build. Nope, no node build available atm, sorry.
 - npm run build

## Whe the design looks ugly?
I intentionally leaved empty styles so you can easily override them according to your website design.