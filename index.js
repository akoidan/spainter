function Painter(containerPaitner, conf) {
  var logger;
  if (!conf) {
    conf = {}
  }
  if (conf.logger) {
    logger = conf.logger;
  } else {
    logger = {
      debug: function () {
        return function () {
        };
      }
    }
  }

  var FLOOD_FILL_CURSOR = '<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg    xmlns:osb="http://www.openswatchbook.org/uri/2009/osb"    xmlns:dc="http://purl.org/dc/elements/1.1/"    xmlns:cc="http://creativecommons.org/ns#"    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"    xmlns:svg="http://www.w3.org/2000/svg"    xmlns="http://www.w3.org/2000/svg"    xmlns:xlink="http://www.w3.org/1999/xlink"    height="128"    width="128"    id="svg12"    xml:space="preserve"    enable-background="new 0 0 1000 1000"    viewBox="0 0 128 128"    y="0px"    x="0px"    version="1.1"><defs      id="defs16"><linearGradient        osb:paint="solid"        id="linearGradient4668"><stop          id="stop4666"          offset="0"          style="stop-color:#a70000;stop-opacity:1;" /></linearGradient><linearGradient        gradientUnits="userSpaceOnUse"        y2="129.24489"        x2="8692.8536"        y1="129.24489"        x1="124.50469"        id="linearGradient4670"        xlink:href="#linearGradient4668" /></defs><metadata      id="metadata2"> Svg Vector Icons : http://www.onlinewebfonts.com/icon <rdf:RDF><cc:Work      rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type        rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><g      transform="matrix(-0.06545548,0,0,0.06545548,96.091518,32.9054)"      id="g10"><g        id="g8"        transform="matrix(0.1,0,0,-0.1,0,511)"><path          style="fill-opacity:1;fill:url(#linearGradient4670)"          id="path4"          d="M 2923.3,4723.5 C 2495.2541,4641.7289 2116.2015,4282.4666 2019.575,3861.7722 2010.936,2974.8482 2002.3121,2087.9242 1993.7,1201 1372.6067,561.9446 713.75686,-43.111911 124.50469,-711.1 177.79443,-1124.6012 696.18046,-1384.5817 946.92256,-1721.6746 1873.0645,-2644.7129 2784.7436,-3583.1992 3733.8,-4482.7 c 414.8568,-14.5444 672.1458,554.0816 1010.5846,786.2741 C 5933.4015,-2520.7561 7113.1744,-1335.7883 8297.1,-155 8684.9234,-201.73044 8869.3553,83.429201 8467.4077,323.01301 7303.9011,1506.5241 6142.0458,2693.2924 4939.988,3837.6106 4686.657,4091.5786 4729.7111,3391.5044 4719.1559,3565.1616 4714.1012,2956.3168 4711.3726,2347.458 4708.5,1738.6 5031.0341,1335.4454 4991.2388,661.12765 4526.4426,380.70059 4035.9919,26.383144 3257.4044,327.55874 3152.1031,931.46414 c -39.8563,589.13426 159.3241,863.35076 203.329,893.32976 2.2707,246.6969 2.431,493.4008 2.1679,740.1061 -300.1928,-300.1072 -600.3595,-600.2405 -900.5,-900.4 12.8139,725.2498 -32.7477,1454.2178 35.8271,2176.4281 162.6751,558.7872 1062.6877,586.7614 1253.7345,27.8061 112.979,-515.8061 41.7341,-1055.8192 61.1384,-1582.3166 -12.3655,-253.837 24.6538,-527.0728 -18.3526,-768.8737 -333.2237,-217.6526 -244.4878,-787.61406 173.4897,-834.19331 511.1059,-79.84462 657.2051,617.00781 295.0629,870.31461 -13.3602,773.8703 35.6765,1552.1607 -42.4,2322.3348 -122.666,568.0766 -724.5835,955.0335 -1292.3,847.5 z" /><path          style="fill:{};fill-opacity:1"          id="path6"          d="m 8652.1,-872.8 c -387.3878,-526.6483 -739.4695,-1099.2442 -952.5422,-1720.4453 -255.0408,-767.135 561.8384,-1583.3109 1332.0652,-1367.7587 707.6368,133.0412 1091.285,1010.324 735.7851,1630.769 -236.9486,492.8542 -488.9007,986.3895 -824.0081,1420.335 -74.892,70.77849 -202.3378,99.68687 -291.3,37.1 z" /></g></g></svg>';

  containerPaitner.innerHTML = '<div class="toolsAndCanvas">\
        <div class="painterTools">\
        </div>\
        <div class="canvasWrapper">\
            <canvas></canvas>\
            <div class="canvasResize"></div>\
            <span class="text spainterHidden paintTextSpan" tabindex="-1"\
                  contenteditable="true"></span>\
            <div pos="m" class="paint-crp-rect spainterHidden">\
                <div pos="l"></div>\
                <div pos="r"></div>\
                <div pos="t"></div>\
                <div pos="b"></div>\
                <div pos="tl"></div>\
                <div pos="tr"></div>\
                <div pos="bl"></div>\
                <div pos="br"></div>\
                <img class="paintPastedImg" pos="m"/>\
            </div>\
        </div>\
    </div>\
    <div class="bottomTools">\
        <div class="paintResizeTools spainterHidden">\
            <input type="text" placeholder="width"/>\
            <span>X</span>\
            <input type="text" placeholder="height"/>\
        </div>\
 \
        <div class="paintXYdimens">\
           <div>\
             <div class="paintXY" title="[x, y] zoom"></div> \
             <div>\
               <span class="paintDimensions" title="width x height"></span>\
               <input type="checkbox" checked title="Trim image on send" class="trimImage"/>  \
             </div>\
           </div>\
           <input type="button" value="Paste" class="paintSend"/>\
        </div>\
    </div>';

  var mouseWheelEventName = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
  var tmpCanvasContext = document.createElement('canvas').getContext('2d');


  var CssUtils = {
    visibilityClass: 'spainterHidden',
    showElement: function (element) {
      CssUtils.removeClass(element, CssUtils.visibilityClass)
    },
    hideElement: function (element) {
      CssUtils.addClass(element, CssUtils.visibilityClass);
    },
    setClassToState: function(element, isVisible, clazz){
      if (isVisible) {
        CssUtils.removeClass(element, clazz);
      } else {
        CssUtils.addClass(element, clazz);
      }
    },
  };

  (function () {
    var cl = document.documentElement.classList;
    if (cl && cl.add) {
      CssUtils.addClass = function (element, className) {
        element.classList.add(className)
      }
    } else {
      CssUtils.addClass = function (element, className) {
        if (!CssUtils.hasClass(element, className)) {
          var oldClassName = element.className;
          element.className += (' '+ className);
        }
      }
    }
    if (cl && cl.remove) {
      CssUtils.removeClass = function (element, className) {
        element.classList.remove(className)
      }
    } else {
      CssUtils.removeClass = function (element, className) {
        if (element.className) {
          element.className.replace(new RegExp('(?:^|\\s)'+ className + '(?:\\s|$)'), ' ');
        }
      }
    }
    if (cl && cl.toggle) {
      CssUtils.toggleClass = function (element, className) {
        return element.classList.toggle(className)
      }
    } else {
      CssUtils.toggleClass = function (element, className) {
        if (CssUtils.hasClass(element, className)) {
          CssUtils.removeClass(element, className);
          return false;
        } else {
          CssUtils.addClass(element, className);
          return true;
        }
      }
    }
    if (cl && cl.contains) {
      CssUtils.hasClass = function (element, className) {
        return element.classList.contains(className);
      }
    } else {
      CssUtils.hasClass = function (element, className) {
        return element.className && element.className.split(' ').indexOf(className) >= 0;
      }
    }
  })();


  var $ = function (selector) {
    var el = containerPaitner.querySelector(selector);
    if (!el) {
      throw Error(selector + " Not found")
    }
    return el;
  };


  function format(string) {
    return  function () {
      var args = arguments,  replacement = 0;
      return string.replace(/\{\}/g, function() {
        return args[replacement++];
      });
    };
  }


  function formatPos(string) {
    return function () {
      var args = arguments;
      return string.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    }
  }


  var reverseExponentialMap = {'0': '0', '1': 5, '2': 13, '3': 18, '4': 21, '5': 24, '6': 27, '7': 29, '8': 30, '9': 32, '10': 34, '11': 35, '12': 36, '13': 37, '14': 38, '15': 39, '16': 40, '17': 41, '18': 42, '19': 43, '21': 44, '22': 45, '24': 46, '26': 47, '28': 48, '30': 49, '32': 50, '34': 51, '36': 52, '39': 53, '42': 54, '45': 55, '48': 56, '51': 57, '55': 58, '59': 59, '63': 60, '68': 61, '72': 62, '78': 63, '83': 64, '89': 65, '100': 66};
  // Fn(x) = Math.round(Math.exp((Math.log(1000)/100) * x
  var exponentialMap = {'0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 2, '7': 2, '8': 2, '9': 2, '10': 2, '11': 2, '12': 2, '13': 2, '14': 3, '15': 3, '16': 3, '17': 3, '18': 3, '19': 4, '20': 4, '21': 4, '22': 5, '23': 5, '24': 5, '25': 6, '26': 6, '27': 6, '28': 7, '29': 7, '30': 8, '31': 9, '32': 9, '33': 10, '34': 10, '35': 11, '36': 12, '37': 13, '38': 14, '39': 15, '40': 16, '41': 17, '42': 18, '43': 19, '44': 21, '45': 22, '46': 24, '47': 26, '48': 28, '49': 30, '50': 32, '51': 34, '52': 36, '53': 39, '54': 42, '55': 45, '56': 48, '57': 51, '58': 55, '59': 59, '60': 63, '61': 68, '62': 72, '63': 78, '64': 83, '65': 89, '66': 100}

  var self = this;
  self.zoom = 1;
  self.ZOOM_SCALE = 1.1;
  self.PICKED_TOOL_CLASS = 'active-icon';
  self.dom = {
    container: containerPaitner,
    canvas: $('canvas'),
    bottomTools: $('.bottomTools'),
    paintDimensions: $('.paintDimensions'),
    paintXY: $('.paintXY'),
    trimImage :  $('.trimImage'),
    header: document.createElement('div'),
    canvasResize: $('.canvasResize'),
    canvasWrapper: $('.canvasWrapper'),
    painterTools: $('.painterTools'),
    paintPastedImg: $('.paintPastedImg'),
    paintSend: $('.paintSend'),
    paintCrpRect: $('.paint-crp-rect'),
    paintTextSpan:  $('.paintTextSpan'),
    paintResizeTools: $('.paintResizeTools'),

  };
  self.tmp = new function() {
    var tool = this;
    tool.tmpCanvas = document.createElement('canvas');
    tool.tmpData = tool.tmpCanvas.getContext('2d');
    tool.saveState = function() {
      tool.tmpCanvas.width = self.dom.canvas.width;
      tool.tmpCanvas.height = self.dom.canvas.height;
      tool.tmpData.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
      tool.tmpData.drawImage(self.dom.canvas, 0, 0);
      logger.debug("Context saved")();
    };
    tool.restoreState = function() {
      self.ctx.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
      self.helper.drawImage(tool.tmpCanvas, 0, 0);
      //clear in case new image is transparen
    }
  };
  self.instruments = {
    color: {
      title: 'Color',
      text: "C:",
      holderClass: 'paintColor',
      hiddenByDefault: true,
      inputFactory: function() {
        var input = document.createElement('input');
        input.type = 'color';
        input.value = '#ff0000';
        return input;
      },
      handler: 'onChangeColor',
      ctxSetter: function (v) {
        self.ctx.strokeStyle = v;
      }
    },
    opacity: {
      handler: 'onChangeOpacity',
      range: true,
      ctxSetter: function (v) {
        self.ctx.globalAlpha = v / 100;
        self.instruments.opacity.inputValue = v / 100;
      },
      title: 'Alpha (color transparency)',
      text: "A:",
      holderClass: 'paintOpacity',
      hiddenByDefault: true,
      inputFactory: function() {
        var input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('step', 1);
        input.value = '100';
        return input;
      },
    },
    colorFill: {
      handler: 'onChangeColorFill',
      ctxSetter: function (v) {
        self.ctx.fillStyle = v;
      },
      title: 'Fill color',
      text: "CF:",
      holderClass: 'paintColorFill',
      hiddenByDefault: true,
      inputFactory: function() {
        var input = document.createElement('input');
        input.type = 'color';
        input.value = '#0000ff';
        return input;
      },

    },
    opacityFill: {
      handler: 'onChangeFillOpacity',
      range: true,
      ctxSetter: function (v) {
        self.instruments.opacityFill.inputValue = v / 100;
      },
      title: 'Fill alpha (color transparency)',
      text: "AF:",
      holderClass: 'paintFillOpacity',
      hiddenByDefault: true,
      inputFactory: function() {
        var input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('step', 1);
        input.value = '100';
        return input;
      },
    },
    width: {
      range: true,
      handler: 'onChangeRadius',
      ctxSetter: function (v) {
        self.ctx.lineWidth = v;
      },
      title: 'Width',
      text: "W:",
      holderClass: 'paintRadius',
      hiddenByDefault: true,
      inputFactory: function() {
        var input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('step', 1);
        input.value = '10';
        return input;
      },
    },
    font: {
      handler: 'onChangeFont',
      ctxSetter: function (v) {
        self.ctx.fontFamily = v;
      },
      title: 'Font',
      text: "F:",
      holderClass: 'paintFont',
      hiddenByDefault: true,
      inputFactory: function() {
        var input = document.createElement('select');
        return input;
      },
    },
    apply: {
      trigger: 'click',
      handler: 'onApply',
      holderClass: 'paintApplyText',
      hiddenByDefault: true,
      inputFactory: function() {
        var input = document.createElement('input');
        input.type = 'button';
        input.value = 'Appply';
        return input;
      },

    },

  };
  self.init = {
    createFullScreen: function () {
      self.dom.header.ondblclick = function () {
        var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight || e.clientHeight || g.clientHeight

        self.dom.canvasWrapper.style.width = x - 60 + 'px';
        self.dom.canvasWrapper.style.height = y - 95 + 'px';
        self.dom.container.style.left = '1px';
        self.dom.container.style.top = '1px';
      };
    },
    createCanvas: function() {
      self.ctx = self.dom.canvas.getContext('2d');
      self.ctx.imageSmoothingEnabled= false;
      self.ctx.mozImageSmoothingEnabled = false;
      var height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
        document.documentElement.scrollHeight, document.documentElement.offsetHeight);
      var width = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
        document.documentElement.scrollHeight, document.documentElement.offsetHeight);
      self.helper.setDimensions(500, 500);
      // self.dom.canvasWrapper.style.height = height * 0.9 - 100 + 'px'
      // self.dom.canvasWrapper.style.width = width * 0.9 - 80 + 'px'
    },
    initInstruments: function () { // TODO this looks bad
      Object.keys(self.instruments).forEach(function (k) {
        var instr = self.instruments[k];

        instr.holder = document.createElement('div')
        instr.holder.title = instr.title;
        instr.holder.className = instr.holderClass;
        if (instr.hiddenByDefault) {
          CssUtils.hideElement(instr.holder)
        }
        if (instr.text) {
          var span = document.createElement('span');
          span.innerText = instr.text;
          instr.holder.appendChild(span);
        }
        instr.value =  instr.inputFactory();
        instr.holder.appendChild(instr.value);
        self.dom.bottomTools.appendChild(instr.holder);
        instr.value.addEventListener(instr.trigger || 'input', function (e) {
          if (instr.range && instr.value.value.length > 2 && this.value != 100) { // != isntead !== in case it's a string
            instr.value.value = this.value.slice(0, 2)
          }
          instr.ctxSetter && instr.ctxSetter(e.target.value);
          var handler = self.tools[self.mode][instr.handler];
          handler && handler(e);
          if (instr.range) {
            instr.range.value =  reverseExponentialMap[instr.value.value];
          }
        });
        if (instr.range) {
          instr.value.addEventListener('keypress', function (e) {
            var charCode = e.which || e.keyCode;
            return charCode > 47 && charCode < 58;
          });
          if (conf.rangeFactory) {
            instr.range = conf.rangeFactory();
          } else {
            instr.range = document.createElement('input');
            instr.range.type = 'range';
          }
          instr.range.max = 66;
          var div = document.createElement('div');
          div.appendChild(instr.range);
          instr.holder.appendChild(div);
          instr.range.addEventListener('input', function (e) {
            // exponential growth
            var value = exponentialMap[instr.range.value];
            instr.value.value = value;
            instr.ctxSetter(value);
            var handler = self.tools[self.mode][instr.handler];
            handler && handler(e);
          });
        }
      });
    },
    fixClasses: function() {
      CssUtils.addClass(containerPaitner, 'spainterContainer');
      containerPaitner.setAttribute('tabIndex', 0)
      var fixInputs = {
        'input[type=button]': conf.buttonClass,
        'input[type=text]': conf.textClass,
        'input[type=range]': conf.rangeClass
      };
      for (var input in fixInputs) {
        if (fixInputs[input]) {
          var btns = containerPaitner.querySelectorAll(input);
          for (var i = 0; i < btns.length; i++) {
            CssUtils.addClass(btns[i], fixInputs[input])
          }
        }
      }
    },
    setContext: function () {
      Object.keys(self.instruments).forEach(function (k) {
        var instr = self.instruments[k];
        instr.ctxSetter && instr.ctxSetter(instr.value.value);
      });
    },
    initTools: function () {
      var toolsHolder = self.dom.painterTools;
      self.keyProcessors = [];
      self.dom.paintPastedImg.ondragstart= function(e) {e.preventDefault()};
      if (conf.onBlobPaste) {
        self.dom.paintSend.onclick = self.helper.pasteToTextArea;
      } else {
        CssUtils.hideElement(self.dom.paintSend);
        CssUtils.hideElement(self.dom.trimImage);
      }
      function createIcon(keyActivator,f) {
        var i = document.createElement('i');
        toolsHolder.appendChild(i);
        i.setAttribute('title', keyActivator.title);
        i.className = keyActivator.icon;
        keyActivator.clickAction = f;
        i.onclick = f;
        self.keyProcessors.push(keyActivator);
        return i;
      }
      for (var tool in self.tools) {
        if (!self.tools.hasOwnProperty(tool)) continue;
        self.tools[tool].icon = createIcon(self.tools[tool].keyActivator, self.setMode.bind(self, tool));
      }
      self.actions.forEach(function(a) {
        var i = createIcon(a.keyActivator, function(e) {
          a.handler(e);
          self.helper.applyZoom();
        });
      });
      self.buffer.setIconsState()
    },
    checkEventCodes: function() {
      var check = [];
      self.keyProcessors.forEach(function (proc) {
        if (check.indexOf(proc.code) >= 0) {
          throw Error("key " + proc.code + "is used");
        }
        check.push(proc.code);
      });
      logger.debug("Registered keys: {}", JSON.stringify(check))();
    },
    initCanvas: function () {
      [
        {dom: self.dom.canvas, listener: ['mousedown', 'touchstart'], handler: 'onmousedown'},
        {dom: self.dom.canvas, listener: ['mousemove', 'touchmove'], handler: 'onmousemove'},
        {dom: self.dom.canvasWrapper, listener: ['mouseleave'], handler: 'onmouseup'},
        {dom: self.dom.container, listener: 'keydown', handler: 'contKeyPress', params: false},
        {dom: document.body, listener: 'paste', handler: 'canvasImagePaste', params: false},
        {dom: self.dom.canvasWrapper, listener: mouseWheelEventName, handler: 'onmousewheel', params: {passive: false}},
        {dom: self.dom.container, listener: 'drop', handler: 'canvasImageDrop', params: {passive: false}},
        {dom: self.dom.canvasResize, listener: 'mousedown', handler: 'painterResize'}
      ].forEach(function (e) {
        var listeners = Array.isArray(e.listener) ? e.listener: [e.listener];
        listeners.forEach(function(listener) {
          e.dom.addEventListener(listener, self.events[e.handler], e.params);
        });

      });
      // do not scroll when painting, otherwise the canvas will
      self.dom.canvas.addEventListener('touchmove', function(e) {
        if (self.mode !== 'move') {
          e.preventDefault()
        }
      })
    },
    createFonts: function () {
      var select = self.instruments.font.value;
      var fonts = [
        'Arial, Helvetica, sans-serif',
        '"Arial Black", Gadget, sans-serif',
        '"Comic Sans MS", cursive, sans-serif',
        'Impact, Charcoal, sans-serif',
        '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
        'Tahoma, Geneva, sans-serif',
        '"Trebuchet MS", Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        '"Courier New", Courier, monospace',
        '"Lucida Console", Monaco, monospace'
      ];
      fonts.forEach(function (t) {
        var o = document.createElement('option');
        select.appendChild(o);
        o.textContent = t;
        o.style.fontFamily = t;
        o.value = t;
      });
    },
    openCanvas: function() {
      self.helper.openCanvas();
    }
  };
  self.helper = {
    setUIText: function(text) {
      self.dom.paintXY.textContent = text + ' ' + Math.round(self.zoom * 100) + '%';
    },
    openCanvas: function (e) {
      self.show();
      self.buffer.clear();
      self.init.setContext();
      self.setMode('pen');
    },
    getPageXY: function(e) {
      return {
        pageX: e.pageX || e.touches[0].pageX,
        pageY: e.pageY || e.touches[0].pageY,
      }
    },
    pasteToTextArea: function () {
      if (self.dom.trimImage.checked) {
        var trimImage = self.helper.trimImage();
        if (trimImage) {
          trimImage.toBlob(conf.onBlobPaste);
          self.hide();
        } else {
          logger.debug("image is empty")();
        }
      } else {
        self.dom.canvas.toBlob(conf.onBlobPaste);
        self.hide();
      }
    },
    drawImage: function() {
      var savedA = self.ctx.globalAlpha;
      self.ctx.globalAlpha = 1;
      self.ctx.drawImage.apply(self.ctx, arguments);
      self.ctx.globalAlpha = savedA;
    },
    setCursor: function(text) {
      self.dom.canvas.style.cursor = text;
    },
    buildCursor: function (fill, stroke, width) {
      width = width * self.zoom / 2
      if (width < 3) {
        width = 3;
      } else if (width > 126) {
        width = 126;
      }
      var svg = formatPos('<svg xmlns="http://www.w3.org/2000/svg" height="128" width="128"><circle cx="64" cy="64" r="{0}" fill="{1}"{2}/></svg>')(width, fill, stroke);
      return format('url(data:image/svg+xml;base64,{}) {} {}, auto')(btoa(svg), 64, 64);
    },
    isNumberKey: function (evt) {
      var charCode = evt.which || evt.keyCode;
      return charCode > 47 && charCode < 58;
    },
    trimImage: function () { // TODO this looks bad
      var pixels = self.ctx.getImageData(0, 0, self.dom.canvas.width, self.dom.canvas.height),
        l = pixels.data.length,
        i,
        bound = {
          top: null,
          left: null,
          right: null,
          bottom: null
        },
        x, y;
      for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
          x = (i / 4) % self.dom.canvas.width;
          y = ~~((i / 4) / self.dom.canvas.width);
          if (bound.top === null) {
            bound.top = y;
          }
          if (bound.left === null) {
            bound.left = x;
          } else if (x < bound.left) {
            bound.left = x;
          }
          if (bound.right === null) {
            bound.right = x;
          } else if (bound.right < x) {
            bound.right = x;
          }
          if (bound.bottom === null) {
            bound.bottom = y;
          } else if (bound.bottom < y) {
            bound.bottom = y;
          }
        }
      }
      var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left;
      if (trimWidth && trimHeight) {
        var trimmed = self.ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
        tmpCanvasContext.canvas.width = trimWidth;
        tmpCanvasContext.canvas.height = trimHeight;
        tmpCanvasContext.putImageData(trimmed, 0, 0);
        return tmpCanvasContext.canvas;
      } else {
        return false;
      }
    },
    setZoom: function (isIncrease) {
      if (isIncrease) {
        self.zoom *= self.ZOOM_SCALE;
      } else {
        self.zoom /= self.ZOOM_SCALE;
      }
      self.helper.setUIText(self.dom.paintXY.textContent.split(' ')[0]);
      if (self.tools[self.mode].onZoomChange) {
        self.tools[self.mode].onZoomChange(self.zoom);
      }
    },
    applyZoom: function() {
      self.dom.canvas.style.width = self.dom.canvas.width * self.zoom + 'px';
      self.dom.canvas.style.height = self.dom.canvas.height * self.zoom + 'px';
    },
    getScaledOrdinate: function (ordinateName, clientOrdinateName, value) {
      var clientOrdinate = self.dom.canvas[clientOrdinateName];
      var ordinate = self.dom.canvas[ordinateName];
      return ordinate == clientOrdinate ? value : Math.round(ordinate * value / clientOrdinate); // apply page zoom
    },
    getOffset: function (el) {
      var _x = 0;
      var _y = 0;
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
      }
      return {offsetTop: _y, offsetLeft: _x};
    },
    setOffset: function(e) {
      if (!e.offsetX && e.touches) {
        var offset = self.helper.getOffset(self.dom.canvas);
        var pxy = self.helper.getPageXY(e);
        e.offsetX = Math.round(pxy.pageX- offset.offsetLeft);
        e.offsetY = Math.round(pxy.pageY- offset.offsetTop);
      }
    },
    getXY: function (e) {
      var newVar = {
        x: self.helper.getScaledOrdinate('width', 'clientWidth', e.offsetX),
        y: self.helper.getScaledOrdinate('height', 'clientHeight', e.offsetY)
      };
      return newVar
    },
    setDimensions: function(w, h) {
      var state = self.buffer.getState();
      w = parseInt(w);
      h = parseInt(h);
      self.dom.canvas.width = w;
      self.dom.canvas.height = h;
      self.buffer.restoreState(state);
      self.dom.paintDimensions.textContent = w+ 'x' + h;
    }
  };
  self.Appliable = function() {
    var tool = this;
    tool.enableApply = function() {
      self.instruments.apply.value.removeAttribute('disabled');
    };
    tool.disableApply = function() {
      self.instruments.apply.value.setAttribute('disabled', 'disabled');
    };
  };
  self.events = {
    mouseDown: false,
    onmousedown: function (e) {
      var tool = self.tools[self.mode];
      if (!tool.onMouseDown) {
        return;
      }
      self.helper.setOffset(e);
      // logger.debug("{} mouse down", self.mode)();
      self.events.mouseDown = true
      var rect = self.dom.canvas.getBoundingClientRect();
      var imgData;
      if (!tool.bufferHandler) {
        imgData = self.buffer.startAction();
      }
      tool.onMouseDown(e, imgData);
    },
    onmousemove: function(e) {
      var tool = self.tools[self.mode];
      self.helper.setOffset(e);
      var xy = self.helper.getXY(e);
      self.helper.setUIText("["+xy.x+"," +xy.y+"]");
      if (self.events.mouseDown && tool.onMouseMove) {
        tool.onMouseMove(e, xy);
      }
    },
    onmouseup: function (e) {
      if (self.events.mouseDown) {
        self.events.mouseDown = false;
        var tool = self.tools[self.mode];
        if (!tool.bufferHandler) {
          self.buffer.finishAction();
        }
        var mu = tool.onMouseUp;
        if (mu) {
          // logger.debug("{} mouse up", self.mode)();
          mu(e)
        }
      }
    },
    onmousewheel: function (e) {
      if (!e.ctrlKey) {
        return;
      }
      e.preventDefault();
      self.helper.setOffset(e);
      var xy = self.helper.getXY(e)
      self.helper.setZoom(e.detail < 0 || e.wheelDelta > 0); // isTop
      self.helper.applyZoom()
      var clientRect = self.dom.canvasWrapper.getBoundingClientRect();
      var scrollLeft = (xy.x * self.zoom) - (e.clientX - clientRect.left);
      var scrollTop = (xy.y * self.zoom) - (e.clientY - clientRect.top);
      self.dom.canvasWrapper.scrollLeft = scrollLeft
      self.dom.canvasWrapper.scrollTop = scrollTop;
    },
    contKeyPress: function (event) {
      logger.debug("keyPress: {} ({})", event.keyCode, event.code)();
      if (event.keyCode === 13) {
        if (self.tools[self.mode].onApply) {
          self.tools[self.mode].onApply();
        } else {
          self.helper.pasteToTextArea();
        }
      }
      if (self.mode === 'text') {
        return // don't enter into another mode when we enter text
      }
      self.keyProcessors.forEach(function(proc) {
        if (event.code == proc.code &&
            ((event.shiftKey && !proc.ctrlKey) || (proc.ctrlKey && event.ctrlKey))) {
          proc.clickAction(event);
        }
      });
    },
    painterResize: function(e) {
      var st = self.dom.canvasWrapper.style;
      var w = parseInt(st.width.split('px')[0]);
      var h = parseInt(st.height.split('px')[0]);
      var pxy =self.helper.getPageXY(e);
      var listener = function(e) {
        var cxy = self.helper.getPageXY(e);
        self.dom.canvasWrapper.style.width = w - pxy.pageX + cxy.pageX + 'px';
        self.dom.canvasWrapper.style.height = h - pxy.pageY + cxy.pageY + 'px';
      };
      logger.debug("Added mousmove. touchmove")();
      document.addEventListener('mousemove', listener);
      document.addEventListener('touchmove', listener);
      var remove = function() {
        document.removeEventListener('mousemove', listener);
        document.removeEventListener('touchmove', listener);
      };
      document.addEventListener('mouseup', remove);
      document.addEventListener('touchend', remove);
    },
    canvasImageDrop: function (e) {
      self.dropImg(e.dataTransfer.files, e, function(e) {
        return e
      });
    },
    canvasImagePaste: function (e) {
      if (document.activeElement === self.dom.container && e.clipboardData) {
        self.dropImg(e.clipboardData.items, e, function (b) {
          return b.getAsFile();
        })
      }
    }
  };
  self.dropImg = function (files, e, getter) {
    if (files) {
      for (var i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image') >= 0) {
          logger.debug("Pasting images")();
          self.setMode('img');
          self.tools.img.readAndPasteCanvas(getter(files[i]));
          e.preventDefault(e);
          return;
        }
      }
    }
  };
  self.resizer = new (function() {
    var tool = this;
    tool.cursorStyle = document.createElement('style');
    document.head.appendChild(tool.cursorStyle);
    tool.imgHolder = self.dom.paintCrpRect;
    tool.params = {
      alias: {
        width: 'ow',
        height: 'oh',
        top: 'oy',
        left: 'ox'
      },
      restoreOrd: function(name, padd) {
        logger.debug("restore ord {} {}", name, padd)();
        var alias = tool.params.alias[name];
        tool.params[name] = tool.params.lastCoord[alias] + (padd ? tool.params.lastCoord[padd] : 0)  ;
        tool.imgHolder.style[name] = tool.params[name]* self.zoom + 'px';
      },
      setOrd: function(name, v, ampl, padding) {
        logger.debug("setOrd ord {} {} {} {}", name, v, ampl, padding)();
        ampl = ampl || 1;
        padding = padding || 0;
        var alias = tool.params.alias[name];
        tool.imgHolder.style[name] = ampl * ((tool.params.lastCoord[alias] + padding) * self.zoom)+ v + 'px';
        tool.params[name] = ampl * tool.params.lastCoord[alias] + v / self.zoom + padding;
      },
      rotate: function() {
        var w = tool.imgHolder.style.width;
        tool.imgHolder.style.width = tool.imgHolder.style.height;
        tool.imgHolder.style.height = w;
        w = tool.params.width;
        tool.params.width = tool.params.height;
        tool.params.height = w;
      }
    };
    tool.setMode = function (m) {
      tool.mode = m;
    };
    tool.setData = function (t, l, w, h) {
      tool.params.top = t / self.zoom;
      tool.params.left = l / self.zoom;
      tool.params.width = w;
      tool.params.height = h;
      tool.imgHolder.style.left = l - 1 + 'px';
      tool.imgHolder.style.top = t - 1 + 'px';
      tool.imgHolder.style.width = w * self.zoom + 2 + 'px';
      tool.imgHolder.style.height = h * self.zoom + +2 + 'px';
    };
    tool._setCursor = function (cursor) {
      tool.cursorStyle.textContent = cursor ? (".paintPastedImg, .paint-crp-rect, .painter {cursor: " + cursor + " !important}") : "";
    };
    tool.onZoomChange = function () {
      tool.imgHolder.style.width = tool.params.width * self.zoom + 2 + 'px';
      tool.imgHolder.style.height = tool.params.height * self.zoom + 2 + 'px';
      tool.imgHolder.style.top = tool.params.top * self.zoom - 1 + 'px';
      tool.imgHolder.style.left = tool.params.left * self.zoom - 1 + 'px';
    };
    tool.show = function () {
      CssUtils.showElement(tool.imgHolder);
      logger.debug("Adding mouseUp doc listener")();
      document.addEventListener('mouseup', tool.docMouseUp);
      document.addEventListener('touchend', tool.docMouseUp);
    };
    tool.hide = function() {
      tool._setCursor(null);
      CssUtils.hideElement(tool.imgHolder);
      logger.debug("Removing mouseUp doc listener")();
      tool.docMouseUp();
      document.removeEventListener('mouseup', tool.docMouseUp);
      document.removeEventListener('touchend', tool.docMouseUp);
    };
    tool.trackMouseMove = function(e, mode) {
      logger.debug("Resizer mousedown")();
      tool.mode = mode || e.target.getAttribute('pos');
      self.dom.canvasWrapper.addEventListener('mousemove', tool.handleMouseMove);
      self.dom.canvasWrapper.addEventListener('touchmove', tool.handleMouseMove);
      tool.setParamsFromEvent(e);
      tool._setCursor(tool.cursors[tool.mode]);
    };
    tool.imgHolder.onmousedown = tool.trackMouseMove;
    tool.imgHolder.ontouchstart = tool.trackMouseMove;
    tool.setParamsFromEvent = function(e) {
      var pxy =self.helper.getPageXY(e);
      tool.params.lastCoord = {
        x: pxy.pageX,
        y: pxy.pageY,
        ox: tool.params.left, // origin x
        oy: tool.params.top, // origin y
        ow: tool.params.width, // origin width
        oh: tool.params.height, // origin height
        op: tool.params.width / tool.params.height // origin proportion
      };
      // ( lastCoord.op * x)^2 + x^2 = z;
      tool.params.lastCoord.nl = Math.pow(tool.params.lastCoord.op, 2) + 1;
    };
    tool.docMouseUp = function (e) {
      //logger.debug("Resizer mouseup")();
      self.dom.canvasWrapper.removeEventListener('mousemove', tool.handleMouseMove);
      self.dom.canvasWrapper.removeEventListener('touchmove', tool.handleMouseMove);
    };
    tool.cursors = {
      m: 'move',
      b: 's-resize',
      t: 's-resize',
      l: 'e-resize',
      r: 'e-resize',
      tl: 'se-resize',
      br: 'se-resize',
      bl: 'ne-resize',
      tr: 'ne-resize'
    };
    tool.handlers = {
      m: function (x, y) {
        tool.params.setOrd('top', y);
        tool.params.setOrd('left', x);
      },
      b: function (x, y) {
        if (y / self.zoom < -tool.params.lastCoord.oh) {
          tool.params.setOrd('height', -y, -1);
          tool.params.setOrd('top', y, null, tool.params.lastCoord.oh);
        } else {
          tool.params.setOrd('height', y);
          tool.params.restoreOrd('top');
        }
      },
      t: function (x, y) {
        if (y / self.zoom > tool.params.lastCoord.oh) {
          tool.params.setOrd('height', y, -1);
          tool.params.restoreOrd('top', 'oh');
        } else {
          tool.params.setOrd('top', y);
          tool.params.setOrd('height', -y);
        }
      },
      l: function (x, y) {
        if (x / self.zoom  > tool.params.lastCoord.ow) {
          tool.params.setOrd('width', x, -1);
          tool.params.restoreOrd('left', 'ow');
        } else {
          tool.params.setOrd('left', x);
          tool.params.setOrd('width', -x);
        }
      },
      r: function (x, y) {
        if (x / self.zoom  < -tool.params.lastCoord.ow) {
          tool.params.setOrd('width', -x, -1);
          tool.params.setOrd('left', x, null, tool.params.lastCoord.ow);
        } else {
          tool.params.restoreOrd('left');
          tool.params.setOrd('width', x);
        }
      }
    };
    tool.calcProportion = function (x, y) {
      var d = {
        tl: {dx: 1, dy: 1},
        tr: {dx: 1, dy: -1},
        bl: {dx: -1, dy: 1},
        br: {dx: 1, dy: 1}
      }[tool.mode];
      var dx = x > 0 ? 1 : -1;
      var dy = y > 0 ? 1 : -1;
      var nl = x * x * dx * d.dx + y * y * dy * d.dy;
      var dnl = nl > 0 ? 1 : -1;
      var v = dnl * Math.sqrt(Math.abs(nl) / tool.params.lastCoord.nl);
      y = v * d.dy;
      x = v * tool.params.lastCoord.op * d.dx;
      return {x: x, y: y};
    };
    tool.handleMouseMove = function (e) {
      //logger.debug('handleMouseMove {}', e)();
      var pxy =self.helper.getPageXY(e);
      var x = pxy.pageX - tool.params.lastCoord.x;
      var y = pxy.pageY - tool.params.lastCoord.y;
      if (e.shiftKey && tool.mode.length === 2) {
        var __ret = tool.calcProportion(x, y);
        x = __ret.x;
        y = __ret.y;
      }
      logger.debug('handleMouseMove ({}, {})', x, y)();
      tool.handlers[tool.mode.charAt(0)](x, y);
      if (tool.mode.length === 2) {
        tool.handlers[tool.mode.charAt(1)](x, y);
      }
    };
  })();
  self.tools = {
    select: new (function () {
      var tool = this;
      self.Appliable.call(this);
      tool.keyActivator = {
        code: 'KeyS',
        icon: '' +
        'icon-selection',
        title: 'Select (Shift+S)'
      };
      tool.bufferHandler = true;
      tool.domImg = self.dom.paintPastedImg;
      tool.getCursor = function () {
        return 'crosshair';
      };
      tool.onActivate = function() {
        tool.inProgress = false;
        tool.mouseUpClicked = false;
      };
      // document.addEventListener('copy', tool.onCopy);
      tool.onZoomChange = self.resizer.onZoomChange;
      tool.onDeactivate = function () {
        if (tool.inProgress) {
          var params = self.resizer.params;
          logger.debug(
            'Applying image {}, {}x{}, to  {x: {}, y: {}, w: {}, h:{}',
            tool.imgInfo.width,
            tool.imgInfo.height,
            params.left,
            params.top,
            params.width,
            params.height
          )();
          self.helper.drawImage(tool.domImg,
            0, 0, tool.imgInfo.width, tool.imgInfo.height,
            params.left, params.top, params.width, params.height);
          self.buffer.finishAction();
          tool.inProgress = false; // don't restore in onDeactivate
        }
        self.resizer.hide();
        CssUtils.hideElement(tool.domImg);
      };
      tool.isSelectionActive = function() {
        return self.mode === 'select' && tool.inProgress && tool.mouseUpClicked;
      };
      tool.onMouseDown = function (e) {
        //logger.debug('select mouseDown')();
        tool.onDeactivate();
        tool.mouseUpClicked = false;
        self.resizer.show();
        self.resizer.setData(e.offsetY, e.offsetX, 0, 0);
        self.resizer.trackMouseMove(e, 'br');
      };
      tool.onMouseUp = function (e) {
        if (tool.mouseUpClicked) {
          return;
        }
        var params = self.resizer.params;
        if (!params.width || !params.height) {
          self.resizer.hide();
        } else {
          //logger.debug('select mouseUp')();
          tool.inProgress = true;
          tool.mouseUpClicked = true;
          var imageData = self.ctx.getImageData(params.left, params.top, params.width, params.height);
          tmpCanvasContext.canvas.width = params.width;
          tmpCanvasContext.canvas.height = params.height;
          tool.imgInfo = {width: params.width, height: params.height};
          tmpCanvasContext.putImageData(imageData, 0, 0);
          CssUtils.showElement(tool.domImg);
          tool.domImg.src = tmpCanvasContext.canvas.toDataURL();
          self.buffer.startAction();
          self.ctx.clearRect(params.left, params.top, params.width, params.height);
        }
      };
      tool.rotateInfo = function() {
        var c = tool.imgInfo.width;
        tool.imgInfo.width = tool.imgInfo.height;
        tool.imgInfo.height = c;
        self.resizer.params.rotate();
      };
      tool.getAreaData = function() {
        return {
          width: tool.imgInfo.width,
          height: tool.imgInfo.height,
          img: tool.domImg
        }
      };
    })(),
    pen: new (function () {
      var tool = this;
      tool.keyActivator = {
        code: 'KeyB',
        icon: 'icon-brush-1',
        title: 'Brush (Shift+B)'
      };
      tool.onChangeColor = function (e) {
        self.helper.setCursor(tool.getCursor());
      };
      tool.onZoomChange = function (e) {
        self.helper.setCursor(tool.getCursor());
      };
      tool.onChangeRadius = function (e) {
        self.helper.setCursor(tool.getCursor());
      };
      tool.onChangeOpacity = function (e) {
        self.helper.setCursor(tool.getCursor());
      };
      tool.getCursor = function () {
        return self.helper.buildCursor(self.ctx.strokeStyle, '', self.ctx.lineWidth);
      };
      tool.onActivate = function () {
        self.ctx.lineJoin = 'round';
        self.ctx.lineCap = 'round';
      };
      tool.onMouseDown = function (e) {
        var coord = self.helper.getXY(e);
        self.ctx.moveTo(coord.x, coord.y);
        tool.points = [];
        self.tmp.saveState();
        tool.onMouseMove(e, coord)
      };
      tool.onMouseMove = function (e, coord) {
        // logger.debug("mouse move,  points {}", JSON.stringify(tool.points))();
        self.tmp.restoreState();
        tool.points.push(coord);
        self.ctx.beginPath();
        self.ctx.moveTo(tool.points[0].x, tool.points[0].y);
        for (var i = 0; i < tool.points.length; i++) {
          self.ctx.lineTo(tool.points[i].x, tool.points[i].y);
        }
        self.ctx.stroke();
      };
      tool.onMouseUp = function (e) {
        self.ctx.closePath();
        tool.points = [];
      };
    }),
    line: new (function () {
      var tool = this;
      tool.keyActivator = {
        code: 'KeyL',
        icon: 'icon-line',
        title: 'Line (Shift+L)'
      };
      tool.getCursor = function () {
        return 'crosshair';
      };
      tool.onChangeColor = function (e) { };
      tool.onChangeRadius = function (e) { };
      tool.onChangeOpacity = function (e) { };
      tool.onMouseDown = function (e) {
        self.tmp.saveState();
        tool.startCoord = self.helper.getXY(e);
        tool.onMouseMove(e, tool.startCoord);
      };
      tool.calcProportCoord = function(currCord) {
        var deg = Math.atan((tool.startCoord.x - currCord.x) / (currCord.y - tool.startCoord.y)) * 8 / Math.PI;
        if (Math.abs(deg) < 1) { // < 45/2
          currCord.x = tool.startCoord.x;
        } else if (Math.abs(deg) > 3) { // > 45 + 45/2
          currCord.y = tool.startCoord.y;
        } else {
          var base = (Math.abs(currCord.x - tool.startCoord.x) + Math.abs(currCord.y - tool.startCoord.y, 2)) / 2;
          currCord.x = tool.startCoord.x + base * (tool.startCoord.x < currCord.x ? 1 : -1);
          currCord.y = tool.startCoord.y + base * (tool.startCoord.y < currCord.y ? 1 : -1);
        }
      };
      tool.onMouseMove = function (e, currCord) {
        self.tmp.restoreState();
        self.ctx.beginPath();
        if (e.shiftKey) {
          tool.calcProportCoord(currCord);
        }
        self.ctx.moveTo(tool.startCoord.x, tool.startCoord.y);
        self.ctx.lineTo(currCord.x, currCord.y);
        self.ctx.stroke();
      };
      tool.onMouseUp = function (e) {
        self.ctx.closePath();
      };
    })(),
    fill: new (function (ctx) {
      var tool = this;
      tool.keyActivator = {
        code: 'KeyF',
        icon: 'icon-fill',
        title: 'Flood Fill (Shift+F)'
      };
      tool.bufferHandler = true;
      tool.buildCursor = function() {
        var rawString = format(FLOOD_FILL_CURSOR, self.ctx.fillStyle);
        return format('url(data:image/svg+xml;base64,{}) {} {}, auto')(btoa(rawString), 39, 86);
      }
      tool.getCursor = function() {
        return tool.buildCursor();
      };
      tool.onChangeColorFill = function(e) {
        self.helper.setCursor(tool.buildCursor());
      };
      tool.onChangeFillOpacity = function(e) {};
      tool.floodFill = (function() {
        /** Flood fill algorithm based on gman stackoverflow answer
         * https://stackoverflow.com/a/56221940/3872976
         */
        function getPixel(x, y, width, height, data) {
          if (x < 0 || y < 0 || x >= width || y >= height) {
            return -1;
          } else {
            return data[y * width + x];
          }
        }


        function doWhile(pixelsToCheck, width, height, data, targetColor, fillColor, cb) {
          var tickCount = 1;
          while (pixelsToCheck.length > 0) {
            if (tickCount % 5000 === 0) { // do not block event loop
              // do not block event loop
              setTimeout(doWhile, 0, pixelsToCheck, width, height, data, targetColor, fillColor, cb);
              return;
            }
            var y = pixelsToCheck.pop();
            var x = pixelsToCheck.pop();
            var currentColor = getPixel(x, y, width, height, data);
            if (currentColor === targetColor) {
              tickCount++;
              data[y * width + x] = fillColor;
              pixelsToCheck.push(x + 1, y);
              pixelsToCheck.push(x - 1, y);
              pixelsToCheck.push(x, y + 1);
              pixelsToCheck.push(x, y - 1);
            }
          }
          cb();
        }

        function floodFill(data, x, y, fillColor, width, height, cb) {

          // get the color we're filling
          var targetColor = getPixel(x,y, width,height, data);

          // check we are actually filling a different color
          if (targetColor !== fillColor) {
            doWhile([x, y], width, height, data, targetColor, fillColor, cb);
          } else {
            cb()
          }
        }
        return floodFill;
      })();
      tool.getRGBA = function () {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(self.ctx.fillStyle);
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b =parseInt(result[3], 16);
        var a =(self.instruments.opacityFill.inputValue || 0) * 255;
        if (!result) {
          throw Error("Invalid color");
        }
        //https://stackoverflow.com/a/14963574/3872976
        //return a << 24 | (b << 16) | (g << 8) | r; this doesn't work because it's signed int, we need unsinged
        return new Uint32Array(new Uint8Array([r,g,b,a]).buffer)[0];
      };
      tool.onMouseDown = function (e) {
        if (!((self.dom.canvas.width * self.dom.canvas.height) < 4000001)) {
          alert("Can't flood fill, because your browser is unable to process canvas size " + self.dom.canvas.width + "x" + self.dom.canvas.height+ ", which is more than 4kk pixels.");
        } else {
          var floodFillIcon = $('.' + tool.keyActivator.icon);
          if (CssUtils.hasClass(floodFillIcon, 'disabled')) {
            return
          }
          var xy = self.helper.getXY(e);
          var image = self.buffer.startAction();
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray#Browser_compatibility
          var processData = new Uint32Array(image.data.slice(0).buffer); // clone data,so we won't modify history

          CssUtils.addClass(floodFillIcon, 'disabled');
          tool.floodFill(processData, xy.x, xy.y, tool.getRGBA(), image.width, image.height, function() {
            CssUtils.removeClass(floodFillIcon, 'disabled');
            var resultingImg = new ImageData(new Uint8ClampedArray(processData.buffer), image.width, image.height);
            self.ctx.putImageData(resultingImg, 0, 0);
            self.buffer.finishAction(resultingImg);
          });
        }
      }
    })(),
    rect: new (function () {
      var tool = this;
      tool.keyActivator = {
        code: 'KeyQ',
        icon: 'icon-rect',
        title: 'Rectangle (Shift+Q)'
      };
      tool.getCursor = function () {
        return 'crosshair';
      };
      tool.onChangeRadius = function (e) { };
      tool.onChangeColor = function (e) { };
      tool.onChangeOpacity = function (e) { };
      tool.onChangeColorFill = function (e) { };
      tool.onChangeFillOpacity = function (e) { };
      tool.onMouseDown = function (e) {
        self.tmp.saveState();
        tool.startCoord = self.helper.getXY(e);
        tool.onMouseMove(e, tool.startCoord)
      };
      tool.calcProportCoord = function(currCord) {
        if (currCord.w < currCord.h) {
          currCord.h = currCord.w;
        } else {
          currCord.w = currCord.h;
        }
      };
      tool.onMouseMove = function (e, endCoord) {
        var dim = {
          w: endCoord.x - tool.startCoord.x,
          h: endCoord.y - tool.startCoord.y,
        };
        if (e.shiftKey) {
          tool.calcProportCoord(dim);
        }
        self.ctx.beginPath();
        self.tmp.restoreState();
        self.ctx.rect(tool.startCoord.x, tool.startCoord.y, dim.w, dim.h);
        self.ctx.globalAlpha = self.instruments.opacityFill.inputValue;
        self.ctx.fill();
        self.ctx.globalAlpha = self.instruments.opacity.inputValue;
        self.ctx.stroke();
      };
    })(),
    ellipse: new (function () {
      var tool = this;
      tool.keyActivator = {
        code: 'KeyE',
        icon: 'icon-ellipse',
        title: 'Eclipse (Shift+E)'
      };
      tool.getCursor = function () {
        return 'crosshair';
      };
      tool.onChangeColor = function (e) { };
      tool.onChangeColorFill = function (e) { };
      tool.onChangeRadius = function (e) { };
      tool.onChangeOpacity = function (e) { };
      tool.onChangeFillOpacity = function (e) { };
      tool.onMouseDown = function (e, data) {
        self.tmp.saveState();
        tool.startCoord = self.helper.getXY(e);
        tool.onMouseMove(e, tool.startCoord)
      };
      tool.calcProportCoord = function(currCord) {
        if (currCord.w < currCord.h) {
          currCord.h = currCord.w;
        } else {
          currCord.w = currCord.h;
        }
      };
      tool.draw = function (x, y, w, h) {
        var kappa = .5522848,
          ox = (w / 2) * kappa, // control point offset horizontal
          oy = (h / 2) * kappa, // control point offset vertical
          xe = x + w,           // x-end
          ye = y + h,           // y-end
          xm = x + w / 2,       // x-middle
          ym = y + h / 2;       // y-middle
        self.ctx.moveTo(x, ym);
        self.ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        self.ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        self.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        self.ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      };
      tool.onMouseMove = function (e, endCoord) {
        var dim = {
          w: endCoord.x - tool.startCoord.x,
          h: endCoord.y - tool.startCoord.y
        };
        self.tmp.restoreState();
        self.ctx.beginPath();
        if (e.shiftKey) {
          tool.calcProportCoord(dim);
        }
        tool.draw(tool.startCoord.x, tool.startCoord.y, dim.w, dim.h);
        self.ctx.closePath();
        self.ctx.globalAlpha = self.instruments.opacityFill.inputValue;
        self.ctx.fill();
        self.ctx.globalAlpha = self.instruments.opacity.inputValue;
        self.ctx.stroke();
      };
    })(),
    text: new (function () {
      var tool = this;
      self.Appliable.call(this);
      tool.keyActivator = {
        code: 'KeyT',
        icon: 'icon-text',
        title: 'Text (Shift+T)'
      };
      tool.span = self.dom.paintTextSpan;
      //prevent self.events.contKeyPress
      tool.span.addEventListener('keypress', function (e) {
        if (e.keyCode !== 13 || e.shiftKey) {
          e.stopPropagation(); //proxy onapply
        }
      });
      tool.bufferHandler = true;
      tool.onChangeFont = function (e) {
        tool.span.style.fontFamily = e.target.value;
      };
      tool.onActivate = function () { // TODO this looks bad
        tool.disableApply();
        tool.onChangeFont({target: {value: self.ctx.fontFamily}});
        tool.onChangeRadius({target: {value: self.ctx.lineWidth}});
        tool.onChangeFillOpacity({target: {value: self.instruments.opacityFill.inputValue * 100}});
        tool.onChangeColorFill({target: {value: self.ctx.fillStyle}});
        tool.span.innerHTML = '';
      };
      tool.onDeactivate = function () {
        if (tool.lastCoord) {
          tool.onApply();
        }
        CssUtils.hideElement(tool.span);
      };
      tool.onApply = function () {
        self.buffer.startAction();
        self.ctx.font = (5 + self.ctx.lineWidth) + "px "+ self.ctx.fontFamily;
        self.ctx.globalAlpha = self.instruments.opacityFill.inputValue;
        var width = 5 + self.ctx.lineWidth; //todo lineheight causes so many issues
        var lineheight = parseInt(width * 1.25);
        var linediff = parseInt(width * 0.01);
        var lines = tool.span.textContent.split('\n');
        for (var i = 0; i < lines.length; i++) {
          self.ctx.fillText(lines[i], tool.lastCoord.x, width + i * lineheight + tool.lastCoord.y - linediff);
        }
        self.ctx.globalAlpha = self.instruments.opacity.inputValue;
        self.buffer.finishAction();
        self.setMode('pen');
      };
      tool.onZoomChange = function () {
        tool.span.style.fontSize = (self.zoom * (self.ctx.lineWidth + 5)) + 'px';
        tool.span.style.top = (tool.originOffest.y * self.zoom  / tool.originOffest.z) + 'px';
        tool.span.style.left = (tool.originOffest.x * self.zoom  / tool.originOffest.z) + 'px';
      };
      tool.getCursor = function () {
        return 'text';
      };
      tool.onChangeRadius = function (e) {
        tool.span.style.fontSize = (self.zoom * (5 + parseInt(e.target.value))) + 'px';
      };
      tool.onChangeFillOpacity = function (e) {
        tool.span.style.opacity = e.target.value / 100
      };
      tool.onChangeColorFill = function (e) {
        tool.span.style.color = e.target.value;
      };
      tool.onMouseDown = function (e) {
        CssUtils.showElement(tool.span);
        tool.originOffest = {
          x: e.offsetX,
          y: e.offsetY,
          z: self.zoom
        };
        tool.enableApply();
        tool.span.style.top = tool.originOffest.y +'px';
        tool.span.style.left = tool.originOffest.x +'px';
        tool.lastCoord = self.helper.getXY(e);
        setTimeout(function (e) {
          tool.span.focus()
        });
      };
    }),
    eraser: new (function () {
      var tool = this;
      tool.keyActivator = {
        code: 'KeyD',
        icon: 'icon-eraser',
        title: 'Eraser (Shift+D)'
      };
      tool.onZoomChange = function (e) {
        self.helper.setCursor(tool.getCursor());
      };
      tool.getCursor = function () {
        return self.helper.buildCursor('#aaaaaa', ' stroke="black" stroke-width="2"', self.ctx.lineWidth);
      };
      tool.onChangeRadius = function (e) {
        self.helper.setCursor(tool.getCursor());
      };
      tool.onActivate = function () {
        tool.tmpAlpha = self.ctx.globalAlpha;
        self.ctx.globalAlpha = 1;
        self.ctx.globalCompositeOperation = "destination-out";
      };
      tool.onDeactivate = function () {
        self.ctx.globalAlpha = tool.tmpAlpha;
        self.ctx.globalCompositeOperation = "source-over";
      };
      tool.onMouseDown = function (e) {
        var coord = self.helper.getXY(e);
        self.ctx.moveTo(coord.x, coord.y);
        self.ctx.beginPath();
        tool.onMouseMove(e, coord)
      };
      tool.onMouseMove = function (e, coord) {
        self.ctx.lineTo(coord.x, coord.y);
        self.ctx.stroke();
      };
      tool.onMouseUp = function () {
        self.ctx.closePath();
      };
    })(),
    img: new (function () {
      var tool = this;
      tool.keyActivator = {
        icon: 'icon-picture spainterHidden',
        title: 'Pasting image'
      };
      tool.img = self.dom.paintPastedImg;
      tool.bufferHandler = true;
      tool.imgObj = null;
      tool.readAndPasteCanvas = function (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
          tool.imgObj = new Image();
          var b64 = event.target.result;
          tool.imgObj.onload = function () {
            tool.img.src = b64;
            self.resizer.setData(
              self.dom.canvasWrapper.scrollTop,
              self.dom.canvasWrapper.scrollLeft,
              tool.imgObj.width,
              tool.imgObj.height
            );
          };
          tool.imgObj.src = b64;
        };
      };
      tool.getCursor = function () {
        return null;
      };
      tool.onApply = function (event) {
        var data = self.buffer.startAction();
        var params = self.resizer.params;
        var nw = params.left + params.width;
        var nh = params.top + params.height;
        if (nw > self.dom.canvas.width || nh > self.dom.canvas.height) {
          self.helper.setDimensions(
            Math.max(nw, self.dom.canvas.width),
            Math.max(nh, self.dom.canvas.height)
          );
          self.ctx.putImageData(data, 0, 0);
        }
        self.helper.drawImage(tool.imgObj,
          0, 0, tool.imgObj.width, tool.imgObj.height,
          params.left, params.top, params.width, params.height);
        self.buffer.finishAction();
        self.setMode('pen');
      };
      tool.onZoomChange = self.resizer.onZoomChange;
      tool.onActivate = function(e) {
        self.resizer.show();
        CssUtils.showElement(tool.img);
      };
      tool.onDeactivate = function() {
        tool.onApply();
        self.resizer.hide();
        CssUtils.hideElement(tool.img);
      };
    }),
    crop: new (function () {
      var tool = this;
      self.Appliable.call(this);
      tool.keyActivator = {
        code: 'KeyC',
        icon: 'icon-crop',
        title: 'Crop Image (Shift+C)'
      };
      tool.bufferHandler = true;
      tool.getCursor = function () {
        return 'crosshair';
      };
      tool.onApply = function () {
        var params = self.resizer.params;
        if (!params.width || !params.height) {
          logger.debug("Can't crop to {}x{}", params.width, params.height)();
        } else {
          self.buffer.startAction();
          var img = self.ctx.getImageData(params.left, params.top, params.width, params.height);
          self.helper.setDimensions(params.width, params.height);
          self.ctx.putImageData(img, 0, 0);
          self.buffer.finishAction(img);
          self.setMode('pen');
        }
      };
      tool.onActivate = function() {
        tool.disableApply();
      };
      tool.onZoomChange = self.resizer.onZoomChange;
      tool.onDeactivate = function() {
        self.resizer.hide();
        tool.enableApply();
      };
      tool.onMouseDown = function (e) {
        self.resizer.show();
        tool.disableApply();
        self.resizer.setData(e.offsetY, e.offsetX, 0, 0);
        self.resizer.trackMouseMove(e, 'br');
      };
      tool.onMouseUp = function (e) {
        var params = self.resizer.params;
        if (!params.width || !params.height) {
          self.resizer.hide();
        } else {
          tool.onApply();
        }

      };
    })(),
    resize: new (function () {
      var tool = this;
      tool.keyActivator = {
        code: 'KeyW',
        icon: 'icon-resize',
        title: 'Change dimensions (Shift+W)'
      };
      tool.container = self.dom.paintResizeTools;
      tool.width = tool.container.querySelector('[placeholder=width]');
      tool.height = tool.container.querySelector('[placeholder=height]');
      tool.lessThan4 = function(e) {
        if (this.value.length > 4) {
          this.value = this.value.slice(0, 4);
        }
      };
      tool.onlyNumber = function(e) {
        var charCode = e.which || e.keyCode;
        return  charCode > 47 && charCode < 58;
      };
      tool.width.onkeypress = tool.onlyNumber;
      tool.width.oninput = tool.lessThan4;
      tool.height.oninput = tool.lessThan4;
      tool.height.onkeypress = tool.onlyNumber;
      tool.onApply = function() {
        var data = self.buffer.startAction();
        self.helper.setDimensions(tool.width.value, tool.height.value);
        self.ctx.putImageData(data, 0, 0);
        self.buffer.finishAction();
        self.setMode('pen')
      };
      tool.getCursor = function() {
        return null;
      };
      tool.onActivate = function() {
        CssUtils.showElement(tool.container);
        tool.width.value = self.dom.canvas.width;
        tool.height.value = self.dom.canvas.height;
      };
      tool.onDeactivate = function() {
        CssUtils.hideElement(tool.container);
      };
    }),
    move: new (function () {
      var tool = this;
      tool.keyActivator = {
        code: 'KeyM',
        icon: 'icon-move',
        title: 'Move (Shift+M)'
      };
      tool.getCursor = function () {
        return 'move';
      };
      tool.onMouseDown = function (e) {
        var pxy = self.helper.getPageXY(e);
        tool.lastCoord = {x: pxy.pageX, y: pxy.pageY};
      };
      tool.onMouseMove = function (e) {
        if (e.type === 'touchmove') {
          return // touchmove already has this in default behaviour
        }
        var pxy = self.helper.getPageXY(e);
        var x = tool.lastCoord.x - pxy.pageX;
        var y = tool.lastCoord.y - pxy.pageY;
        logger.debug("Moving to: {{}, {}}", x, y)();
        self.dom.canvasWrapper.scrollTop += y;
        self.dom.canvasWrapper.scrollLeft += x;
        tool.lastCoord = {x: pxy.pageX, y: pxy.pageY};
        // logger.debug('X,Y: {{}, {}}', self.dom.canvasWrapper.scrollLeft, self.dom.canvasWrapper.scrollTop )();
      };
      tool.onMouseUp = function (coord) {
        tool.lastCoord = null;
      };
    })
  };
  self.actions = [
    {
      keyActivator: {
        code: 'KeyR',
        icon: 'icon-rotate',
        title: 'Rotate (Shift+R)'
      },
      handler: function () {
        if (self.tools['select'].isSelectionActive()) {
          var m = self.tools.select;
          var d = m.getAreaData();
          logger.debug("{}x{}", d.width, d.height)();
          tmpCanvasContext.canvas.width = d.height; //specify width of your canvas
          tmpCanvasContext.canvas.height = d.width; //specify height of your canvas
          var ctx = tmpCanvasContext;
          ctx.save();
          ctx.translate(d.height / 2, d.width / 2);
          ctx.rotate(Math.PI / 2);
          ctx.drawImage(d.img, -d.width / 2, -d.height / 2); //draw it
          ctx.restore();
          d.img.src = tmpCanvasContext.canvas.toDataURL();
          m.rotateInfo();
        } else {
          self.buffer.startAction();
          var tmpData = self.dom.canvas.toDataURL();
          var w = self.dom.canvas.width;
          var h = self.dom.canvas.height;
          self.helper.setDimensions(h, w);
          self.ctx.save();
          self.ctx.translate(h / 2, w / 2);
          self.ctx.rotate(Math.PI / 2);
          var img = new Image();
          img.onload = function (e) {
            self.helper.drawImage(img, -w / 2, -h / 2);
            self.ctx.restore();
            self.buffer.finishAction();
          };
          img.src = tmpData;
        }
      }
    }, {
      keyActivator: {
        code: 'KeyZ',
        ctrlKey: true,
        icon: 'icon-undo',
        title: 'Undo (Ctrl+Z)'
      },
      handler: function () {
        self.buffer.undo();
      }
    }, {
      keyActivator: {
        code: 'KeyY',
        ctrlKey: true,
        icon: 'icon-redo',
        title: 'Redo (Ctrl+Y)'
      },
      handler: function () {
        self.buffer.redo();
      }
    }, {
      keyActivator: {
        code: '+',
        icon: 'icon-zoom-in',
        title: 'Zoom In (Ctrl+)/(Mouse Wheel)'
      },
      handler: function () {
        self.helper.setZoom(true);
      }
    }, {
      keyActivator: {
        code: '-',
        icon: 'icon-zoom-out',
        title: 'Zoom Out (Ctrl-)/(Mouse Wheel)'
      },
      handler: function () {
        self.helper.setZoom(false);
      }
    }, {
      keyActivator: {
        code: 'Delete',
        icon: 'icon-trash-circled',
        title: 'Delete (Shift+Del)'
      },
      handler: function () {
        if (self.tools['select'].isSelectionActive()) {
          self.tools['select'].inProgress = false; // don't restore image
          self.buffer.finishAction();
          self.tools['select'].onDeactivate();
        } else {
          self.buffer.startAction();
          self.ctx.clearRect(0, 0, self.dom.canvas.width, self.dom.canvas.height);
          self.buffer.finishAction();
        }
      }
    }
  ];
  self.buffer = new (function () {
    var tool = this;
    var undoImages = [];
    var redoImages = [];
    var buStateData = ['lineWidth', 'fillStyle', 'strokeStyle', 'fontFamily', 'font', 'globalAlpha', 'lineJoin', 'lineCap', 'globalCompositeOperation'];
    var current = null;
    tool.getCanvasImage = function (img) {
      return {
        width: self.dom.canvas.width,
        height: self.dom.canvas.height,
        data: img || self.ctx.getImageData(0, 0, self.dom.canvas.width, self.dom.canvas.height)
      }
    };
    tool.clear = function () {
      undoImages = [];
      redoImages = [];
      current = null;
    };
    tool.getUndo = function() {
      return undoImages;
    };
    tool.getRedo = function() {
      return redoImages;
    };
    tool.dodo = function(from, to) {
      var restore = from.pop();
      if (restore) {
        to.push(current);
        current = restore;
        if (self.dom.canvas.width != current.width
          || self.dom.canvas.height != current.height) {
          logger.debug("Resizing canvas from {}x{} to {}x{}",
            self.dom.canvas.width, self.dom.canvas.height,
            current.width, current.height
          )();
          self.helper.setDimensions(current.width, current.height)
        }
        self.ctx.putImageData(restore.data, 0, 0);
        tool.setIconsState();
      }
    };
    tool.setIconsState = function() {
      CssUtils.setClassToState($('.icon-redo'), redoImages.length, 'disabled');
      CssUtils.setClassToState($('.icon-undo'), undoImages.length, 'disabled');
    };
    tool.redo = function () {
      tool.dodo(redoImages, undoImages);
    };
    tool.undo = function () {
      tool.dodo(undoImages, redoImages);
    };
    tool.finishAction = function (img) {
      logger.debug('finish action')();
      if (current) {
        undoImages.push(current);
      }
      redoImages = [];
      tool.setIconsState();
      current = tool.getCanvasImage(img);
      self.helper.applyZoom();
    };
    tool.getState = function() {
      var d = {};
      buStateData.forEach(function (e) {
        d[e] = self.ctx[e];
      });
      return d;
    };
    tool.restoreState = function (state) {
      buStateData.forEach(function (e) {
        self.ctx[e] = state[e];
      });
    };
    tool.setCurrent = function(newCurrent) {
      current = newCurrent;
    };
    tool.startAction = function () {
      logger.debug('start action')();
      if (!current) {
        current = tool.getCanvasImage();
      }
      return current.data;
    };
  })();
  self.setMode = function (mode) {
    var oldMode = self.tools[self.mode];
    self.mode = mode;
    if (oldMode) {
      oldMode.onDeactivate && oldMode.onDeactivate();
      CssUtils.removeClass(oldMode.icon, self.PICKED_TOOL_CLASS);
    }
    var newMode = self.tools[self.mode];
    newMode.onActivate && newMode.onActivate();
    newMode.getCursor && self.helper.setCursor(newMode.getCursor());
    newMode.icon && CssUtils.addClass(newMode.icon, self.PICKED_TOOL_CLASS);
    Object.keys(self.instruments).forEach(function (k) {
      var instr = self.instruments[k];
      if (oldMode && oldMode[instr.handler]) {
        CssUtils.hideElement(instr.holder);
      }
      if (newMode[instr.handler]) {
        CssUtils.showElement(instr.holder);
      }
    });
  };
  self.show = function () {
    document.body.addEventListener('mouseup', self.events.onmouseup, false);
    document.body.addEventListener('touchend', self.events.onmouseup, false);
  };
  self.superHide = self.hide;
  self.hide = function () {
    document.body.removeEventListener('mouseup', self.events.onmouseup, false);
    document.body.removeEventListener('touchend', self.events.onmouseup, false);
  };
  Object.keys(self.init).forEach(function (k) {
    self.init[k]()
  });
}

if (typeof module === 'object') {
  module.exports =  Painter;
}
