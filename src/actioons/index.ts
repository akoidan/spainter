self.actions = [
  {
    keyActivator: {
      code: 'KeyR',
      icon: 'icon-rotate',
      title: 'Rotate (Shift+R)'
    },
    handler () {
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
    handler () {
      self.buffer.undo();
    }
  }, {
    keyActivator: {
      code: 'KeyY',
      ctrlKey: true,
      icon: 'icon-redo',
      title: 'Redo (Ctrl+Y)'
    },
    handler () {
      self.buffer.redo();
    }
  }, {
    keyActivator: {
      code: '+',
      icon: 'icon-zoom-in',
      title: 'Zoom In (Ctrl+)/(Mouse Wheel)'
    },
    handler () {
      self.helper.setZoom(true);
    }
  }, {
    keyActivator: {
      code: '-',
      icon: 'icon-zoom-out',
      title: 'Zoom Out (Ctrl-)/(Mouse Wheel)'
    },
    handler () {
      self.helper.setZoom(false);
    }
  }, {
    keyActivator: {
      code: 'Delete',
      icon: 'icon-trash-circled',
      title: 'Delete (Shift+Del)'
    },
    handler () {
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
