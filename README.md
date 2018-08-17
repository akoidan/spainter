[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/deathangel908/lines-logger/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/spainter.svg)](https://www.npmjs.com/package/spainter)

# Spainter. Web browSer painter

## [DEMO](https://spainter.pychat.org/)

### Use:

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

4. If you want to get Blob and e.g. upload it to server, you can use 2nd parameter of constructor:

```
new Painter(containerPainer, {
  onBlobPaste: function(blob) {
    var formData = new FormData();
    formData.append('file', blob, 'specifyFileNameHereIfNeeded.png');
    fetch(`${host}/upload_file`, {
      method: "POST",
      body: formData,
    }).then(e => {
      console.log('server response', e);
    });
  }
})
```

5. By default logs are off, you can turn them on with:
```
new Painter(containerPainer, {
   logger: {
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

You can also pass [lines-logger](https://www.npmjs.com/package/lines-logger) instead of the ugly construction above

### CAUTION

Spainter uses [flexbox](https://caniuse.com/#feat=flexbox) if you need to support browsers like IE 9 and below, you're free to create a pull request to remove flexbox.

### Contribute
So there're 2 things you need:
 - Download [fontello](http://fontello.com/) icons from [config.json](config.json). You can use `generate-fontello.sh` script for that. The script requires **curl** and **bash** commands
 - Build css from sass. You can use **sassc** index.sass index.css
 - Open index.html in browser

I also intentionally leaved styles empty so you can easily override them according to your website design. If you want to prettify it a bit, you're wellcome to create a separate .css file with styles.
