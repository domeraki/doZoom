/*
 doZoom 0.1.6
 http://domeraki.github.io/doZoom
 MIT licensed
 Copyright (C) 2017 domeraki.com - A project by DoMeraki
*/
(function(c) {
  "function" === typeof define && define.amd ? define(["jquery"], c) : "undefined" !== typeof exports ? module.exports = c(require("jquery")) : c(jQuery);
})(function(c) {
  function k(a, b) {
    this.$targetParent = c(a);
    this.opts = c.extend({}, l, b, "destroy");
    void 0 === this.isInit && this.init();
  }
  var f, g, l = {srcAttribute:"bgsrc", noChild:!0, selector:".item", includeParent:!0, autoCover:!1, defaultSize:"cover", restSize:!1, restPosition:!1, showerror:!0, errorMessage:"Faild to load image.", hideerror:!0, errorDuration:3, additionWidth:0, additionHeight:0, afterLoad:null, onHover:null, onMoveing:null, onLeave:null, onInitialized:null, onInitialize:null, onChange:null, debug:!1, loadingClass:"doZoom-loading", readyClass:"doZoom-ready", hoverClass:"doZoom-hover", leaveClass:"doZoom-leave", 
  movingClass:"doZoom-moving", errorClass:"doZoom-error", notifyClass:"doZoom-notify"};
  k.prototype = {constructor:k, init:function() {
    c.isFunction(this.opts.onInitialize) && this.opts.onInitialize.call(this);
    this.opts.debug && this.debug("Initialize doZoom");
    this.$notify = c('<div class="doZoom-notify" />');
    this.isActiveNotify = this.isNotify = !1;
    this.$realTarget = this.$targetParent;
    this.opts.noChild || (this.$realTarget = this.$target = this.$targetParent.find(this.opts.selector));
    "undefined" == typeof this.lastoffset && (this.lastoffset = this.$realTarget.offset());
    "undefined" == typeof this.$realTarget.attr(this.opts.srcAttribute) ? (this.opts.errorMessage = "src attribute not found ", this.error()) : (this.$realTarget.css("background-image", "url(" + this.$realTarget.attr(this.opts.srcAttribute) + ")"), "" != this.opts.defaultSize && this.$realTarget.css("background-size", this.opts.defaultSize), this.iserror = !1);
    this.$event = this.$targetParent;
    this.opts.includeParent || this.opts.noChild || (this.$event = this.$target);
    c(window).on({resize:c.proxy(this.show, this)});
    this.$event.on({"mousemove.doZoom touchmove.doZoom":c.proxy(this.move, this), "mouseleave.doZoom touchend.doZoom":c.proxy(this.unHover, this), "mouseenter.doZoom touchstart.doZoom":c.proxy(this.hover, this)});
    this.opts.debug && this.debug("doZoom Initialized");
    c.isFunction(this.opts.onInitialized) && this.opts.onInitialized.call(this, {target:this.$realTarget});
  }, show:function(a) {
    if (!this.isReady) {
      var b = this._loadImage(this.$realTarget.attr(this.opts.srcAttribute));
      this.$realTarget.attr("imgwidth", b.width);
      this.$realTarget.attr("imgheight", b.height);
    }
    if (!this.iserror) {
      b = this.$realTarget.outerWidth() + this.opts.additionWidth;
      var d = this.$realTarget.outerHeight() + this.opts.additionHeight;
      var e = this.$realTarget.attr("imgwidth");
      var h = this.$realTarget.attr("imgheight");
      this.isInit = !0;
      this._diff = b / d > e / h;
      if (this.opts.autoCover) {
        this.imgrWidth = e / h * d;
        this.imgrHeight = h / e * b;
        var f = this.imgrWidth - b;
        var g = this.imgrHeight - d;
        h = this.imgrHeight;
        this._diff ? this.$realTarget.css("background-size", "100% " + this.imgrHeight + "PX") : this.$realTarget.css("background-size", this.imgrWidth + "px 100%");
      } else {
        f = e - b, g = h - d, this.$realTarget.css("background-size", e + "px " + h + "px");
      }
      this.rw = f / b;
      this.rh = g / d;
      c.isFunction(this.opts.beforeZoom) && this.opts.beforeZoom.call(this, {imgWidth:imgWidth, imgHeight:h});
      a && this.moving(a);
    }
  }, hover:function(a) {
    var b = a.originalEvent.touches;
    c.isFunction(this.opts.onHover) && this.opts.onHover.call(this);
    this.$realTarget.removeClass(this.opts.leaveClass).addClass(this.opts.hoverClass);
    this.isMouseOver = !0;
    this.opts.debug && this.debug("hover function");
    b && 1 != b.length || (a.preventDefault(), this.isReady || this.show(a));
  }, move:function(a) {
    "undefined" != typeof this.isReady && this.isReady && 0 != this.$realTarget.attr("imgwidth") && "undefined" != typeof this.$realTarget.attr("imgwidth") && this.isInit || (this.isReady = !1, this.show(a));
    this.isInit && !this.iserror && (this.opts.debug && this.debug("Moving over background"), a.preventDefault(), this.moving(a));
  }, unHover:function() {
    this.iserror || (this.$realTarget.removeClass(this.opts.hoverClass + " " + this.opts.movingClass).addClass(this.opts.leaveClass), this.opts.restPosition && this.$realTarget.animate({"background-position-y":"0px", "background-position-x":"0px"}, 1000), this.opts.autoCover && (this._diff ? this.$realTarget.css("background-size", "100% " + this.imgrHeight + "PX") : this.$realTarget.css("background-size", this.imgrWidth + "px 100%")), this.opts.restSize && this.$realTarget.css("background-size", 
    ""), this.isMouseOver = !1, this.opts.debug && this.debug("Unhover Background"), c.isFunction(this.opts.onLeave) && this.opts.onLeave.call(this));
  }, load:function(a) {
    a.currentTarget.width && (this.$notify.detach(), this.isReady = !0, this.iserror = !1, this.opts.debug && this.debug("load"), this.$realTarget.removeClass(this.opts.loadingClass).addClass(this.opts.readyClass), c.isFunction(this.opts.afterLoad) && this.opts.afterLoad.call(this));
  }, error:function() {
    this.iserror = !0;
    this.isReady = !1;
    this.opts.debug && this.debug("Faild to load image check srcAttribute.");
    this.$realTarget.removeClass(this.opts.loadingClass).addClass(this.opts.errorClass);
    this.showNotify();
  }, debug:function(a) {
    console.log(a);
  }, showNotify:function() {
    this.isNotify || this.$realTarget.append(this.$notify);
    this.isNotify = !0;
    if (!this.isActiveNotify) {
      var a = 0;
      var b = this;
      a = this.opts.errorDuration;
      a = "undefined" == typeof a ? 3000 : 1 > a ? 1000 : 1000 * a;
      this.opts.showerror && (this.$notify.text(this.opts.errorMessage), this.$notify.css({top:"0"}), this.isActiveNotify = !0, this.opts.hideerror && (b.detachnotify = setTimeout(function() {
        b.hideNotify();
      }, a)));
    }
  }, hideNotify:function() {
    this.$notify.stop(!0, !0).css({top:"-50px"});
    this.isActiveNotify = !1;
  }, _loadImage:function(a) {
    var b = new Image;
    b.src = a;
    this.$realTarget.addClass(this.opts.loadingClass);
    this.$zoom = c(b).on("error", c.proxy(this.error, this)).on("load", c.proxy(this.load, this));
    this.isReady = 0 == b.width ? !1 : !0;
    return b;
  }, moving:function(a) {
    if (!this.iserror) {
      0 === a.type.indexOf("touch") ? (a = a.touches || a.originalEvent.touches, f = a[0].pageX, g = a[0].pageY) : (f = a.pageX || f, g = a.pageY || g);
      var b = this.lastoffset;
      var d = g - b.top;
      a = f - b.left;
      var e = this.$realTarget.offset();
      if (b.top != e.top || b.left != e.left) {
        d = g - e.top, a = f - e.left, c.isFunction(this.opts.onChange) && this.opts.onChange.call(this, {change:e, old:b}), this.lastoffset = e;
      }
      d = -1 * Math.ceil(d * this.rh);
      a = -1 * Math.ceil(a * this.rw);
      this.$realTarget.addClass(this.opts.movingClass);
      this.opts.autoCover ? this._diff ? this.$realTarget.css({"background-position-y":d, "background-position-x":"0px"}) : this.$realTarget.css({"background-position-y":"0px", "background-position-x":a}) : this.$realTarget.css({"background-position-y":d, "background-position-x":a});
      c.isFunction(this.opts.onMove) && this.opts.onMove.call(this, {top:d, left:a});
    }
  }, undo:function() {
    this.$event.off(".doZoom");
    delete this.$notify;
    this.$realTarget.css({"background-size":"", "background-image":"", "background-position":""}).removeClass(this.loadingClass, this.readyClass, this.hoverClass, this.leaveClass, this.movingClass, this.errorClass, this.notifyClass);
  }};
  c.fn.doZoom = function(a) {
    var b = Array.prototype.slice.call(a, 1), c;
    return this.each(function() {
      "object" == typeof a[0] || "undefined" == typeof a[0] ? this.doZoom = new k(this, a) : c = this.doZoom[a].apply(this.doZoom, b);
      if ("undefined" != typeof c) {
        return c;
      }
    });
  };
});