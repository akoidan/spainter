[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/deathangel908/lines-logger/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/spainter.svg)](https://www.npmjs.com/package/spainter) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/akoidan/spainter/issues/new) [![HitCount](http://hits.dwyl.io/akoidan/spainter.svg)](http://hits.dwyl.io/akoidan/spainter)

# Spainter. Web browSer painter

## [DEMO](http://spainter.pychat.org/)

### Integrating into you server:

 - If you use bundler like webpack:

```bash
npm i spainter lines-logger
```

```ecmascript 6
import Painter from 'spainter';
import 'spainter/index.sass'; // you can impor index.css if you don't have sass, ensure that you copy the fonts from the directory as well to production. Set `$FontelloPath: "../node_modules/spainter/font"`
import {LoggerFactory} from 'lines-logger'; // yarn install lines-logger
const containerPainter = document.createElement('div');
document.body.appendChild(containerPainter);
const p = new Painter(containerPainter, {logger: new LoggerFactory().getLogger('spainter')});
```
If you use [fontello](http://fontello.com/) in your server, you can generate single font importing [no-fonts.sass](no-fonts.sass), joining it with [config.json](config.json)

 - If you use server rendering and cdn:

```html
<script src="https://cdn.jsdelivr.net/npm/spainter@1.0.0/index.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/spainter@1.0.1/index.css"/>
<div id="containerPainter"></div>
<script>
var p = new Painter(containerPainter);
</script>
```
Target the latest version instead of `1.0.0` [![npm version](https://img.shields.io/npm/v/spainter.svg)](https://www.npmjs.com/package/spainter)

 - You can find an example on [pychat](https://github.com/akoidan/pychat/blob/3c82c75c719dc5d84700efde415e2842d355dcf3/fe/src/components/pages/PainterPage.vue)

 - Additional parameters

```javascript
new Painter(containerPainer, {
  textClass: 'input-txt-class', // set class for all input[type=text] elements
  buttonClass: 'input-button-class', // set class for all input[type=button] elements
  rangeClass: 'input-range-class', // set class for all input[type=range]elements
  rangeFactory: () => { // use this div for input[range], e.g. you can use material-design
    var input = document.createElement('input');
    input.type = 'range';
    return input;
  },
  onBlobPaste: function(blob) { // example of uploading image to server
    var formData = new FormData();
    formData.append('file', blob, 'specifyFileNameHereIfNeeded.png');
    fetch(`${host}/upload_file`, {
      method: "POST",
      body: formData,
    }).then(e => {
      console.log('server response', e);
    });
  },
  logger: { // better use lines-logger instead this constructions. If you don't wanna install it, use this ugly construction below
    debug: function log() {
      var args = Array.prototype.slice.call(arguments);
      var parts = args.shift().split('{}');
      var params = [window.console, '%c' + 'painter', 'red'];
      for (var i = 0; i < parts.length; i++) {
        params.push(parts[i]);
        if (typeof args[i] !== 'undefined') {
          params.push(args[i])
        }
      }
      return Function.prototype.bind.apply(console.log, params);
    }
  }
})
```

### CAUTION

Spainter uses [flexbox](https://caniuse.com/#feat=flexbox) if you need to support browsers like IE 9 and below, you're free to create a pull request to remove flexbox.

### Contribute
To build spainter you need
 - yarn run build
 - Open [index.html](index.html) in browser
To modify icons use `bash generate-fontello.sh`. it will show you help.

I also intentionally leaved styles empty so you can easily override them according to your website design. If you want to prettify it a bit, you're wellcome to create a separate .css file with styles.
