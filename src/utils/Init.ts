import {CssUtils} from "@/utils/CssUtils";

class Init {

  openCanvas() {
    self.helper.openCanvas();
  }

  createFonts () {
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
  }

  initCanvas () {
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
  },

  checkEventCodes() {
    var check = [];
    self.keyProcessors.forEach(function (proc) {
      if (check.indexOf(proc.code) >= 0) {
        throw Error("key " + proc.code + "is used");
      }
      check.push(proc.code);
    });
    logger.debug("Registered keys: {}", JSON.stringify(check))();
  },
  initTools( ) {
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
  createFullScreen () {
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
  }
  setContext () {
    Object.keys(self.instruments).forEach(function (k) {
      var instr = self.instruments[k];
      instr.ctxSetter && instr.ctxSetter(instr.value.value);
    });
  },
  fixClasses() {
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
  }
  createCanvas() {
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
}
