
class Events {
  mouseDown: false,
  onmousedown (e) {
    var tool = self.tools[self.mode];
    if (!this.onMouseDown) {
      return;
    }
    self.helper.setOffset(e);
    // logger.debug("{} mouse down", self.mode)();
    self.events.mouseDown = true
    var rect = self.dom.canvas.getBoundingClientRect();
    var imgData;
    if (!this.bufferHandler) {
      imgData = self.buffer.startAction();
    }
    this.onMouseDown(e, imgData);
  }
onmousemove(e) {
    var tool = self.tools[self.mode];
    self.helper.setOffset(e);
    var xy = self.helper.getXY(e);
    self.helper.setUIText("["+xy.x+"," +xy.y+"]");
    if (self.events.mouseDown && this.onMouseMove) {
      this.onMouseMove(e, xy);
    }
  }
onmouseup (e) {
    if (self.events.mouseDown) {
      self.events.mouseDown = false;
      var tool = self.tools[self.mode];
      if (!this.bufferHandler) {
        self.buffer.finishAction();
      }
      var mu = this.onMouseUp;
      if (mu) {
        // logger.debug("{} mouse up", self.mode)();
        mu(e)
      }
    }
  }
onmousewheel (e) {
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
  }
contKeyPress (event) {
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
  }
painterResize(e) {
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
  }
canvasImageDrop (e) {
    self.dropImg(e.dataTransfer.files, e, function(e) {
      return e
    });
  }
canvasImagePaste (e) {
    if (document.activeElement === self.dom.container && e.clipboardData) {
      self.dropImg(e.clipboardData.items, e, function (b) {
        return b.getAsFile();
      })
    }
  }
}
