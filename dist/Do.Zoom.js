/*!
 * doZoom 0.1.5
 * http://domeraki.github.io/doZoom
 * MIT licensed
 *
 * Copyright (C) 2017 domeraki.com - A project by DoMeraki 
 */
(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            factory($);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.DoZoom = factory(require('jquery')));
    } else {
        root.DoZoom = factory(root.jQuery);
    }
}(this, function ($) {

    'use strict';

    var dw, //diffrent width (image and container[parent])
        dh, //diffrent height (image and container[parent])
        rw, rh, lx, ly,
        parentWidth, 		// parentWidth width
        parentHeight, 		// parentWidth height
        imgsrc,		// image url
        imgwidth, // image width
        imgheight, // image height
        imgrWidth,
        imgrHeight;

    var defaults = {
        // Attribute to retrieve the source image URL from.
        srcAttribute: 'bgsrc',


        // background added to main div not to child.
        noChild: true,  
		
		// Dom Elemnt for child.
        selector: ".item",

        // Include parent if noChild is false.
        includeParent: true,


        // make Background cover.
        autoCover: false,

		// Change Defult image size.
        defaultSize: "cover",
		
		
        // Rest Background size.
        restSize: false,

        // Rest Background position .
        restPosition: false,


        // Show Error Message Or Not.
        showError: true,


        // The text to display if an error occurs when loading image from srcAttribute has falid.
        errorMessage: 'Faild to load image.',

        // Disable error message from auto hide.
        hideError: true,

        // The time (in seconds) to display the error .
        errorDuration: 3,

		// Add Or Subtract width.
        additionWidth: 0,
		
		// Add Or Subtract height.
        additionHeight: 0,
		
		//Callback fired once the image have been loaded and ready to zooom it;
        afterLoad: null,

        // Callback function to execute when the cursor is moving over the selector.
        onHover: null,

 
        // Callback function to execute when the cursor is moving over the selector.
        onMoveing: null,

        // Callback function to execute when mouse leave (unhover).
        onLeave: null,
		
        // Callback function to execute after doZoom Initialized.
        onInitialized: null,
		
        // Callback function to execute on Initialize do zoo,
        onInitialize: null,
		
        // Callback function to execute on change happend on offset,
        onChange: null,

        // Debug.
        debug: false,
		
		loadingClass:"doZoom-loading",
		readyClass :"doZoom-ready",
		hoverClass :"doZoom-hover",
		leaveClass :"doZoom-leave",
		movingClass:"doZoom-moving",
		errorClass :"doZoom-error",
		notifyClass:"doZoom-notify",

    };

    /**
     * DoZoom
     */
    function DoZoom(target, options) {
        this.$targetParent = $(target);
        this.opts = $.extend({}, defaults, options, 'destroy');

        this.isInit === undefined && this._init();
    }

    /**
     * Init
     * @private
     */

    DoZoom.prototype._init = function () {
		
		$.isFunction(this.opts.onInitialize) && this.opts.onInitialize.call(this);
		
		 if (this.opts.debug) {
            this.__debug("Initialize doZoom");
        }
        this.$notify = $('<div class="doZoom-notify" />');
		this.isNotify = false;
		this.isActiveNotify = false;
		
                  this.$realTarget = this.$targetParent;

        if (!this.opts.noChild) {
			        this.$target = this.$targetParent.find(this.opts.selector);

			            this.$realTarget = this.$target;
		      }
			  	if(typeof this.lastoffset == 'undefined')
					this.lastoffset = this.$realTarget.offset();

				
  	if(typeof this.$realTarget.attr(this.opts.srcAttribute) == 'undefined')
	{
		this.opts.errorMessage = "src attribute not found "
		this.__Error();
	}
	else
	{
	this.$realTarget.css("background-image","url("+this.$realTarget.attr(this.opts.srcAttribute)+")");
	if (this.opts.defaultSize != ""){
	this.$realTarget.css("background-size",this.opts.defaultSize);
                }
		this.isError = false;
	}
 					this.$event = this.$targetParent;

				if(!this.opts.includeParent && !this.opts.noChild ){
					this.$event = this.$target;	
				}

	  this.$event.on({
            'mousemove.doZoom touchmove.doZoom': $.proxy(this.__move, this),
            'mouseleave.doZoom touchend.doZoom': $.proxy(this.__unHover, this),
            'mouseenter.doZoom touchstart.doZoom': $.proxy(this.__hover, this)
        });
        if (this.opts.debug) {
            this.__debug("doZoom Initialized");
        }
	$.isFunction(this.opts.onInitialized) && this.opts.onInitialized.call(this,{target:this.$realTarget});

    };

 
    /**
     * Show
     */
    DoZoom.prototype.show = function (e) {
        var self = this;
        var img = new Array();
        if (!this.isReady) {
            var imgload = this._loadImage(this.$realTarget.attr(this.opts.srcAttribute));
            this.$realTarget.attr("imgwidth", imgload.width);
            this.$realTarget.attr("imgheight", imgload.height);
        }
 
				        if (this.isError) return;

 
        parentWidth = (this.$realTarget.outerWidth())+(this.opts.additionWidth);
         parentHeight = (this.$realTarget.outerHeight())+(this.opts.additionHeight);
        imgwidth = this.$realTarget.attr("imgwidth");
        imgheight = this.$realTarget.attr("imgheight");


        this.isInit = true;
        this._diff = parentWidth / parentHeight > imgwidth / imgheight;
         if (this.opts.autoCover) {
           var imgWratio = imgwidth / imgheight;
            imgrWidth = imgWratio * parentHeight;
            var imgHratio = imgheight / imgwidth;
            imgrHeight = imgHratio * parentWidth;

            dw = imgrWidth - parentWidth;
            dh = imgrHeight - parentHeight;
imgwidth =imgrWidth;imgheight=imgrHeight;
            if (this._diff) {
                this.$realTarget.css("background-size", "100% " + imgrHeight + "PX");

            } else {
                this.$realTarget.css("background-size", imgrWidth + "px " + "100%");

            }

        } else {
            dw = imgwidth - parentWidth;
            dh = imgheight - parentHeight;
            this.$realTarget.css("background-size", imgwidth + "px " + imgheight + "px");
        }
        rw = dw / parentWidth;
        rh = dh / parentHeight;
  	$.isFunction(this.opts.beforeZoom) && this.opts.beforeZoom.call(this,{imgWidth:imgWidth,imgHeight:imgheight});
 
         e && this.moving(e);
    };

    /**
     * On hover
     */
   
    DoZoom.prototype.__hover = function (e) {
		this.Reshow = false;
        var touches = e.originalEvent.touches;
	$.isFunction(this.opts.onHover) && this.opts.onHover.call(this);
         this.$realTarget.removeClass(this.opts.leaveClass).addClass(this.opts.hoverClass);
        this.isMouseOver = true;
        if (this.opts.debug) {
            this.__debug("hover function");
        }
	
         if (!touches || touches.length == 1) {
            e.preventDefault();
			if(!this.isReady || this.Reshow)
             this.show(e);
        }
		
    };

    /**
     * On move
     */
    DoZoom.prototype.__move = function (e) {
			if(typeof this.isReady == 'undefined' 
		|| !this.isReady  
		|| this.$realTarget.attr("imgwidth") == 0 
		|| typeof this.$realTarget.attr("imgwidth") == 'undefined'
		|| !this.isInit
		){
         this.isReady = false;
            this.show(e);

		}
 

		        if (!this.isInit) return;
		        if (this.isError) return;

        if (this.opts.debug) {
            this.__debug("Moving over background")
        }
        e.preventDefault();
        this.moving(e);

    };

    /**
     * On un hover
     */
    DoZoom.prototype.__unHover = function () {
		        if (this.isError) return;

        this.$realTarget
            .removeClass(this.opts.hoverClass+" "+this.opts.movingClass)
            .addClass(this.opts.leaveClass);


 if (this.opts.restPosition)
 this.$realTarget.animate({
	 "background-position-y": "0px",
	 "background-position-x": "0px",
	 },1000);


        if (this.opts.autoCover) {
            if (this._diff) {
                 this.$realTarget.css("background-size", "100% " + imgrHeight + "PX");

            } else {
                this.$realTarget.css("background-size", imgrWidth + "px " + "100%");
 
            }

        }
        if (this.opts.restSize)
            this.$realTarget.css("background-size", "");
		

        this.isMouseOver = false;
        if (this.opts.debug) {
            this.__debug("Unhover Background");
        }
        $.isFunction(this.opts.onLeave) && this.opts.onLeave.call(this);

    };

    /**
     * On load
     */
    DoZoom.prototype.__load = function (e) {
        if (!e.currentTarget.width) return;
        this.$notify.detach();

        this.isReady = true;
        this.isError = false;
        if (this.opts.debug) {
            this.__debug("load");
        }
        this.$realTarget.removeClass(this.opts.loadingClass).addClass(this.opts.readyClass);
		  	$.isFunction(this.opts.afterLoad) && this.opts.afterLoad.call(this);


    };

    /**
     * On error
     */
    DoZoom.prototype.__Error = function () {
        var self = this;
        this.isError = true;
        this.isReady = false;

        if (this.opts.debug) {
            this.__debug("Faild to load image check srcAttribute.");
        }
this.$realTarget.removeClass(this.opts.loadingClass).addClass(this.opts.errorClass);
this.__showNotify();
 

    };
       /**
     * Debugging
     */
    DoZoom.prototype.__debug = function (log) {
		
		console.log(log);
	}
    /**
     * Show notify
     */
    DoZoom.prototype.__showNotify = function () {
		if(!this.isNotify){
		this.$realTarget.append(this.$notify);
		}
this.isNotify = true;
if(this.isActiveNotify) return;
		 var duration = 0;var self =this;
		 var seconds =this.opts.errorDuration;
        if (typeof seconds == 'undefined') {
            var duration = 3000;
        }
        else if (seconds < 1) {
            duration = 1000;
        }
        else {
            duration = seconds * 1000;
        }

     if (this.opts.showError) {
  this.$notify.text(this.opts.errorMessage);
   			   this.$notify.css({"top":"0"});
this.isActiveNotify = true;
       if (this.opts.hideError) {
           self.detachnotify = setTimeout(function () {
self.__hideNotify();
		   }, duration);
          }
           ;
       }
        ;
        
	}
	
	 /**
     * Hide notify
     */
    DoZoom.prototype.__hideNotify = function () {
				  
		this.$notify.stop(true,true).css({"top":"-50px"});
this.isActiveNotify = false;


	}
   
   
	 /**
     * Load Image and check error
     */
    DoZoom.prototype._loadImage = function (href) {

        var imgload = new Image;
		imgload.src = href;

        this.$realTarget.addClass(this.opts.loadingClass);
                this.$zoom = $(imgload)
            .on('error', $.proxy(this.__Error, this))
            .on('load', $.proxy(this.__load, this));
			if(imgload.width == 0){
				        this.isReady = false;

			}else{
				        this.isReady = true;

			}

        return imgload;
    };

    /**
     * Moveing
     */
    DoZoom.prototype.moving = function (e) {
	 
        if (this.isError) return;
		var self = this;

        if (e.type.indexOf('touch') === 0) {
            var touchlist = e.touches || e.originalEvent.touches;
            lx = touchlist[0].pageX;
            ly = touchlist[0].pageY;
        } else {
            lx = e.pageX || lx;
            ly = e.pageY || ly;
        }

        var offset = this.lastoffset;
        var pt = ly - offset.top;
        var pl = lx - offset.left;

			var newOffset   = this.$realTarget.offset()
		  if(offset.top != newOffset.top ||
		  offset.left != newOffset.left){
         var pt = ly - newOffset.top;
        var pl = lx - newOffset.left;
	$.isFunction(this.opts.onChange) && this.opts.onChange.call(this,{change:newOffset,old:offset});

this.lastoffset = newOffset;

 		  }

		

        var xt = Math.ceil(pt * rh);
        var xl = Math.ceil(pl * rw);

        var top = (xt) * -1;
        var left = (xl) * -1;
        this.$realTarget.addClass(this.opts.movingClass);

        if (this.opts.autoCover) {
            if (this._diff) {
                this.$realTarget.css({
                    "background-position-y": top,
                    "background-position-x": "0px",
                });
            } else {
                this.$realTarget.css({
                    "background-position-y": "0px",
                    "background-position-x": left,
                });
            }

        } else {
            this.$realTarget.css({
                "background-position-y": top,
                "background-position-x": left,
            });
        }


        $.isFunction(this.opts.onMove) && this.opts.onMove.call(this,{top:top,left:left});


    };
 /*
        * Destroys bgZoom plugin events and  its html markup and style
        */
       DoZoom.prototype.destroy = function() {
		   console.log("DD");
		   this.$event
            .off('.doZoom');

			this.$realTarget.removeClass(this.loadingClass,this.readyClass,this.hoverClass,
			this.leaveClass,this.movingClass,this.errorClass,this.notifyClass);
			delete this.$notify;
			this.$realTarget.css({
				"background-size":"",
				"background-image":"",
				"background-position":""
				
			})
			
     };

     $.fn.doZoom = function (options) {
 		 
        return this.each(function () {
            var api = $.data(this, 'doZoom');
				 if(options == "destroy")
			  api.destroy()
            if (!api) {
                $.data(this, 'doZoom', new DoZoom(this, options));
            } else if (api.isInit === undefined) {
                api._init();
            }
        });
    };
}));
