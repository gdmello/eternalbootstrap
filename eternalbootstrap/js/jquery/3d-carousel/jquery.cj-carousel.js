/* --------------------------------------------- */
/* Author: http://codecanyon.net/user/CodingJack */
/* --------------------------------------------- */

;(function($) {
	
	// GoogleFontLoader is used to accurately measure text size
	// Additional Google fonts can be added to this Array
	var useGoogleFonts = true,
	googleFonts = ["Patua+One"],
	
	ie8,
	canvas, 
	browser,
	callback,
	transform, 
	touchMobile,
	perspective, 
	transformStyle, 
	doc = document, 
	contrast = 1.5,
	brightness = 30,
	
	methods = {
		
		// main jQuery call
		init: function() {
			
			var leg,
			images,
			$this = $(this),
			wrapper = $this.parent(),
			container = $this.children(".cj-container"),
			phone = $(window).width() < 600 && $this.attr("data-smartphonesUseFallback") === "true",
			items = container.find(".cj-thumb");
			
			if(!items.length) return;
			images = items.children("img");
			leg = images.length;
			
			if(!leg) return;
			if(!transform || !canvas || !perspective || !transformStyle || navigator.userAgent.toLowerCase().search('msie') !== -1 || phone) {
				
				// if we can't create the carousel, we'll setup the thumbnail grid
				
				var responsive = $this.attr("data-smartphoneFallbackIsResponsive") === "true";
				if(responsive) wrapper.addClass("cj-grid-option");
				
				Jacked.setEngines({opera: true});
				$("body").addClass("cj-grid");
				
				setupFallback($this, images, items, leg, phone, responsive);
				return;
				
			}
			
			$this.data({
				
				count: 0,
				obj: $this,
				len: leg - 1,
				imagery: images,
				cont: container,
				wrapper: wrapper
				
			});
			
			images.each(imageEach, [$this]);
			
		},
		
		// API method updates translateZ
		updateZ: function(num) {
		
			$(this).data("container")[0].translateZ = num + "px";
		
		},
		
		// API method updates rotateX
		updateX: function(num) {
		
			$(this).data("container")[0].rotateX = num + "deg";
			
		},
		
		// API method updates rotateZ
		rotateZ: function(num) {
		
			$(this).data("container")[0].rotateZ = num + "deg";
			
		},
		
		// API method updates item spacing
		updateSpacing: function(num) {
			
			var $this = $(this).data("container"),
			wide = $this.data("wide"), rotationZ;
			$this = $this.children();
			
			wide += parseFloat(num);
			rotationZ = (((wide / 2) / Math.tan(Math.PI / $this.length)) + 0.5) | 0;
			
			$this.each(updateSpace, [rotationZ]);
			
		},
		
		// API method that adds a callback to be called when the carousel has loaded and animated in
		addCallback: function(func) {
		
			callback = func;
			
		}
		
	};
	
	// main jQuery call
	$.fn.cjCarousel = function(type, args) {
		
		return this.each(methods[type], [args]);
		
	};
	
	// creates a new custom setTimeout
	function CarouselTimer($this) {
	
		this.itm = $this;
		
	}
	
	// custom setTimeout call
	CarouselTimer.prototype.timing = function() {
		
		var $this = this.itm;
		
		this.timer = setTimeout(function() {
			
			startCarousel($this);
			
		}, 3000);
		
	};
	
	// updates the spacing for each carousel item (API method)
	function updateSpace(num) {
			
		var style = this.style[transform];
			
		this.style[transform] = style.split("translateZ")[0] + "translateZ(" + num + "px)";
			
	}
	
	// loads each carousel image
	function imageEach($this) {
		
		var img = $(this), newImage = $("<img />").attr({
			
			width: img.attr("width"),
			height: img.attr("height")
			
		}).data("parent", $this).one("load.cj", imageLoaded).insertAfter(img);
		
		img.remove();
		newImage.attr("src", img.attr("data-src"));
		
	}
	
	// fires after each image has loaded
	function imageLoaded(event) {
	
		event.stopPropagation();
		
		var $this = $(this).data("parent"), data = $this.data();
		
		(data.count < data.len) ? data.count++ : startIt($this, data);
		
	}
	
	// once the images have loaded we're ready to create the carousel
	function startIt($this, data) {
		
		var container = data.cont,
		items = container.children(),
		images = data.imagery,
		leg = data.len + 1, 
		dif = 360 / leg, 
		itm,
		img,
		div,
		frag,
		mask,
		canv,
		image,
		canvs,
		thumb,
		plane,
		content,
		rHeight,
		rotateX,
		rotateZ,
		context,
		contentH,
		addMouse,
		translate,
		imageData,
		hasContent,
		counter = 0,
		cHeight = 0,
		temp = $(images[0]), 
		visibleCaps = $this.attr("data-captionsAlwaysVisible") === "true",
		refAlpha = parseFloat($this.attr("data-reflectAlpha")) || 0.5,
		high = parseInt(temp.attr("height"), 0) || temp.height(),
		wide = parseInt(temp.attr("width"), 0) || temp.width(),
		spacing = parseInt($this.attr("data-spacing"), 10) || 60, 
		reflect = $this.attr("data-reflection") === "true",
		animeIn = $this.attr("data-animateIn") === "true",
		shine = $this.attr("data-hoverShine") === "true",
		wrapper = $this.data("wrapper"),
		totalW = wrapper.width() || 640,
		widePlus = wide + 6,
		highPlus = high + 6,
		halfH = high >> 1,
		
		plusW = wide + spacing,
		rotZ = (((plusW / 2) / Math.tan(Math.PI / leg)) + 0.5) | 0;
		
		container.data({
			
			wide: wide,
			length: leg,
			parent: wrapper,
			halfWidth: totalW >> 1,
			auto: $this.attr("data-autoplay") === "true",
			threshold: parseFloat($this.attr("data-threshold")) || .0025
			
		});
		
		wrapper.data("container", container);
		$this.removeData().data("container", container);
		
		container = container[0];
		container.speed = parseFloat($this.attr("data-speed"));
		container.rotateX = rotateX = parseInt($this.attr("data-rotateX"), 10) + "deg";
		container.rotateZ = rotateZ = parseInt($this.attr("data-rotateZ"), 10) + "deg";
		container.translateZ = translate = parseInt($this.attr("data-translateZ"), 10) + "px";
		container.counter = 0;
		
		if(touchMobile) container.timed = new CarouselTimer(container);
		
		for(var i = 0; i < leg; i++) {
			
			itm = items[i];
			itm.style[transform] = "rotateY(" + counter + "deg) translateZ(" + rotZ + "px)";
			
			counter += dif;
			plane = $(itm).removeData().css("width", wide + 3);
			thumb = plane.children(".cj-thumb");
			
			if(!thumb.length) continue;
			if(thumb.attr("data-url")) thumb.addClass("cj-mouse").on("click.cj", gotoURL);
			
			content = plane.find(".cj-caption");
			hasContent = content.length;
			
			if(hasContent) {
				
				contentH = content.height();
				
				if(!visibleCaps) {
					
					cHeight = 0;
					addMouse = false;
					
					thumb.data({
						
						content: content,
						contentH: contentH
						
					}).on("mouseenter.cj", overMouse).on("mouseleave.cj", outMouse);
					
				}
				else {
					
					addMouse = true;
					cHeight = contentH;
					content.addClass("cj-border");
					
				}
				
				content.css({height: cHeight, width: content.width(), visibility: "visible"});
				
			}
			else {
			
				contentH = 0;
				addMouse = true;
				
			}
			
			image = thumb.children("img");
			img = image[0];
			
			frag = doc.createDocumentFragment();
			canvs = $("<canvas />").attr({width: widePlus, height: highPlus}).appendTo(frag);
			canv = canvs[0];
			image.remove();
			
			context = writeContext(canv, img, wide, high);
			context.restore();
			
			if(shine && !touchMobile) {
			
				canv = canvs.clone().addClass("cj-hover").appendTo(frag);
				canv = canv[0];
				
				context = writeContext(canv, img, wide, high);
				imageData = context.getImageData(0, 0, widePlus, highPlus);
				ripPixels(imageData);
				
				context.putImageData(imageData, 0, 0);
				context.restore();
				
				thumb.data("shine", canv);
				if(addMouse) thumb.on("mouseenter.cj", overMouse);
				
			}
			
			div = $("<div />").addClass("cj-absolute").appendTo(thumb);
			div[0].appendChild(frag);
			
			if(!reflect) continue;
				
			canv = canvs.clone().addClass("cj-reflection").attr({
				
				width: widePlus, 
				height: highPlus
				
			}).css("top", high).appendTo(plane);
			
			rHeight = contentH + high;
			if(hasContent && visibleCaps) canv.css("top", rHeight);
			
			canv = canv[0];
			context = canv.getContext("2d");
			context.save();
			context.translate(3, high + 3);
			context.scale(1, -1);
			context.drawImage(img, 0, 0, wide, high);
			context.restore();
			context.globalCompositeOperation = "destination-out";

			mask = context.createLinearGradient(0, 0, 0, halfH);
			mask.addColorStop(0, "rgba(0, 0, 0, " + (1 - refAlpha) + ")");
			mask.addColorStop(1, "rgba(0, 0, 0, 1.0)");
			context.fillStyle = mask;
			context.rect(0, 0, widePlus, highPlus);
			context.fill();
			
			thumb.data({high: high, reflect: canv, rHeight: rHeight});
			
		}
		
		wrapper.css("background-image", "none");
		$this.css({width: widePlus, visibility: "visible"});
		container.style[transform] = "translateZ(" + (animeIn ? '-5000px' : translate) + ") rotateX(" + rotateX + ") rotateZ(" + rotateZ + ") rotateY(0deg)";
		
		if(animeIn) {
			
			Jacked.transform(container, {transform: "translateZ(" + translate + ") rotateX(" + rotateX + ") rotateZ(" + rotateZ + ") rotateY(-360deg)"}, {
			
				duration: 1000,
				ease: "Quint.easeInOut",
				callback: startCarousel,
				callbackParams: true
				
			});
			
		}
		else {
		
			startCarousel(container, true);
			
		}
		
	}
	
	// called when the carousel is to start auto rotating
	function startCarousel(itm, first, force) {
		
		var $this = $(itm), data = $this.data();
		
		if(data.auto || force) {
			
			Jacked.special(itm, {duration: 20000, ease: "Linear.easeNone", callback: runCarousel});
			
		}
		
		if(!first) return;
		
		if(!touchMobile) {
			
			data.parent.on("mouseenter.cj", moveCarousel).on("mouseleave.cj", mouseOff);
			
		}
		else {

			data.parent.on("touchstart.cj", touchDown).on("touchend.cj", touchUp);
			
		}
		
		if(callback) callback.trigger("cjReady");
		
	}
	
	// rotates the carousel, fires every frame
	function runCarousel($this, a, done) {
		
		$this.counter -= $this.speed;
		$this.style[transform] = "translateZ(" + $this.translateZ + ") rotateX(" + $this.rotateX + ") rotateY(" + $this.counter + "deg) rotateZ(" + $this.rotateZ + ")";
	
		if(done) startCarousel($this);
		
	}
	
	// creates the shine effect on mouse over
	function ripPixels(imageData) {
	
		var imgData = imageData.data,
		px = imgData.length,
		p1 = px * 4,
		p2, 
		p3, 
		rc,
		gc,
		bc;
		
		while(px--) {
			
			p1 -= 4;
			p2 = p1 + 1;
			p3 = p2 + 1;

			rc = (imgData[p1] * contrast) + brightness;
			gc = (imgData[p2] * contrast) + brightness;
			bc = (imgData[p3] * contrast) + brightness;
			
			imgData[p1] = rc > 255 ? 255 : rc < 0 ? 0 : rc;
			imgData[p2] = gc > 255 ? 255 : gc < 0 ? 0 : gc;
			imgData[p3] = bc > 255 ? 255 : bc < 0 ? 0 : bc;
			
		}
		
	}
	
	// mouse click event
	function gotoURL(event) {
		
		event.stopPropagation();
		
		var $this = $(this);
		
		if($this.attr("data-target") !== "_blank") {
			
			window.location = $this.attr("data-url");
			
		}
		else {
			
			window.open($this.attr("data-url"));
			
		}
		
	}
	
	// mouse enter event
	function overMouse() {
		
		var data = $(this).data(), content = data.content, shine = data.shine, reflect = data.reflect;
		
		if(shine) {
			
			Jacked.stopTween(shine);
			shine.style.opacity = 1;
			Jacked.tween(shine, {opacity: 0}, {ease: "Quint.easeInOut"});
				
		}
		
		if(content) {
			
			content.addClass("cj-border");
			Jacked.tween(content[0], {height: data.contentH});
			if(reflect) Jacked.tween(data.reflect, {top: data.rHeight});
			
		}
		
	}
	
	// mouse leave event
	function outMouse() {
		
		var data = $(this).data(), content = data.content, reflect = data.reflect;
		
		if(content) {
			
			content.removeClass("cj-border");	
			Jacked.tween(content[0], {height: 0});
			if(reflect) Jacked.tween(data.reflect, {top: data.high});
			
		}
		
	}
	
	// draws an image to the Canvas 
	function writeContext(canv, img, wide, high) {
	
		var context = canv.getContext("2d");
		
		context.save();
		context.translate(3, 3);
		context.drawImage(img, 0, 0, wide, high);
		context.strokeStyle = "transparent";
		context.lineWidth = 3;
		context.stroke();
		
		return context;
		
	}
	
	// mouse enter event
	function moveCarousel() {
		
		var $this = $(this), data = $this.data(), container = data.container;
		
		if(!container.data("auto")) startCarousel(container[0], false, true);
		
		data.offsetX = $this.on("mousemove.cj", moveMouse).offset().left;
		
	}
	
	// mouse move event
	function moveMouse(event) {
		
		var $this = $(this), 
		container = $this.data("container"),
		 
		data = container.data(),
		center = data.halfWidth,
		x = event.pageX - $this.data("offsetX");
		
		container = container[0];
		
		if(x < center) {
		
			container.speed = -((center - x) * data.threshold);
			container.direction = 0;
			
		}
		else {
			
			container.speed = (x - center) * data.threshold;
			container.direction = 1;
			
		}
		
	}
	
	// mouse leave event
	function mouseOff() {
		
		var $this = $(this).off("mousemove.cj"), container = $this.data("container");
		
		if(!container.data("auto")) {
			
			container = container[0];
			container.throttle = container.speed;
			
			Jacked.special(container, {duration: 3000, ease: "Linear.easeNone", callback: throttleSpeed});
				
		}
		
	}
	
	// smooth stoppage after mouse interaction when autoplay equals false
	function throttleSpeed($this) {
				
		if($this.direction) {
			
			$this.throttle -= 0.01;
			if($this.throttle <= 0) Jacked.stopTween($this);
			$this.counter -= $this.throttle;	
							
		}
		else {
			
			$this.throttle += 0.01;
			if($this.throttle >= 0) Jacked.stopTween($this);
			$this.counter -= $this.throttle;
			
		}
		
		$this.style[transform] = "translateZ(" + $this.translateZ + ") rotateX(" + $this.rotateX + ") rotateY(" + $this.counter + "deg) rotateZ(" + $this.rotateZ + ")";
		
	}
	
	// touch start event for mobile
	function touchDown(event) {
		
		var $this = $(this), container = $this.data("container"), data = container.data();
		container = container[0];
		
		clearTimeout(container.timed.timer);
		Jacked.stopTween(container);
		
		data.prevX = data.pageX = !event.originalEvent.touches ? event.pageX : event.originalEvent.touches[0].pageX;	
		$this.on("touchmove.cj", touchMove);
		
	}
	
	// touch move event for mobile
	function touchMove(event) {
		
		var $this = $(this), container = $this.data("container"), data = container.data(), pageX, prevX = data.prevX, dif;
		
		if(!event.originalEvent || !event.originalEvent.touches) {
			
			pageX = data.pageX = event.pageX;
			
		}
		else {
			
			pageX = data.pageX = event.originalEvent.touches[0].pageX;
			
		}
		
		if(Math.abs(prevX - pageX) > 10) event.preventDefault();
		dif = (pageX - prevX) * (data.threshold * 2);
		
		container = container[0];
		container.counter += dif;
		
		container.style[transform] = "translateZ(" + container.translateZ + ") rotateX(" + container.rotateX + ") rotateY(" + container.counter + "deg) rotateZ(" + container.rotateZ + ")";
		
	}
	
	// touch end event for mobile
	function touchUp(event) {
		
		var $this = $(this).off("touchmove.cj"), container = $this.data("container"), data = container.data(),
		
		prevX = data.prevX, 
		pageX = !event.originalEvent.touches ? event.pageX : data.pageX,
		difX = Math.abs(pageX - prevX);
		
		container = container[0];
		container.timed.timing();
		
		if(difX < 10 || difX > 200) return;
		
		if(pageX < prevX) {

			container.counter -= 360 / data.length;
			
		}
		else {
		
			container.counter += 360 / data.length;
			
		}
		
		Jacked.transform(container, {transform: "translateZ(" + container.translateZ + ") rotateX(" + container.rotateX + ") rotateY(" + container.counter + "deg) rotateZ(" + container.rotateZ + ")"});
		
	}
	
	// intialized when the thumb grid fallback is to be shown
	function setupFallback($this, images, items, leg, phone, responsive) {
		
		var parent = $this.parent().addClass("cj-fallback"),
		
		spacing = parseInt($this.attr("data-fallbackSpacing"), 10) || 5,
		totalWidth = parseInt(parent.css("width"), 10) || parent.width(),
		columns = parseInt($this.attr("data-fallbackColumns"), 10) || 4,
		shine = $this.attr("data-hoverShine") === "true" && !phone,
		minusColumn = columns - 1,
		iLeg = leg - 1,
		newWidth, i;
		
		totalWidth -= minusColumn * spacing;
		newWidth = (totalWidth / columns) | 0;
		
		parent.data({
			
			count: 0,
			leg: iLeg,
			counter: 0,
			shine: shine,
			rowSpacing: 0,
			spacing: spacing,
			newWidth: newWidth,
			minusColumn: minusColumn

		});
		
		for(i = 0; i < leg; i++) {
		
			new MyImage($(images[i]), parent.data(), phone);
			
		}
		
		if(phone && responsive) items.each(responder, [spacing]);
		if(callback) callback.trigger("cjReady");	

	}
	
	// sets up responsive layout
	function responder(spacing) {
		
		var $this = $(this), 
		data = $this.data(),
		image = $this.children("img"),

		newWidth = data.oWidth,
		newHeight = data.oHeight;
		
		if(!image.length) return;
		image.attr({width: newWidth, height: newHeight});
		data.parent.css({width: newWidth, height: "auto", marginBottom: spacing}).addClass("cj-responder");
		
	}
	
	// represents each fallback item
	function MyImage(itm, data, phone) {
		
		var $this = this.image = itm.clone().data("instance", this).css("opacity", 0).insertAfter(itm).one("load.cj", this.imageLoaded),
		
		par = $this.parent(), 
		newWidth = data.newWidth,
		parent = this.parent = par.parent(),
		imgWidth = parseInt($this.attr("width"), 10) || $this.width(),
		imgHeight = parseInt($this.attr("height"), 10) || $this.height(),
		newHeight = (imgHeight * (newWidth / imgWidth)) | 0,
		
		content,
		contentHeight,
		spacing = data.spacing,
		counter = data.counter;
		
		if(newWidth > imgWidth) {
			
			newWidth = imgWidth;
			newHeight = imgHeight;
			
		}
		
		this.shine = data.shine;
		this.newWidth = newWidth;
		this.newHeight = newHeight;
		
		content = $this.next(".cj-caption");
		$this.attr({width: newWidth, height: newHeight});
		par.data({oWidth: imgWidth, oHeight: imgHeight, parent: parent});
		parent.css({width: newWidth, height: newHeight, marginTop: data.rowSpacing});
		
		if(counter !== 0) {
			
			parent.css("margin-left", spacing);
			
		}
		else {
		
			parent.addClass("cj-clear");
			
		}
		
		if(counter < data.minusColumn) {
			
			data.counter += 1;
			
		}
		else {
			
			data.counter = 0;
			data.rowSpacing += spacing;
			
		}
		
		if(data.count === data.leg) {
			
			data.count++;
			
		}
		else {
			
			parent.closest(".cj-wrapper").css("background-image", "none");
			
		}
		
		if(content.length) {
			
			if(!phone) {
			
				this.hasHover = true;
				contentHeight = -(content.children().outerHeight(true));
				content.css({bottom: contentHeight, visibility: "visible"});
				
				// Opera doesn't support rgba for text-shadow so it looks bad unless we remove it
				if(browser === "opera") content.find("h3").css("textShadow", "none");
				
				parent.data({
					
					content: content[0],
					contentH: contentHeight
					
				}).on("mouseenter.cj", fallbackOver).on("mouseleave.cj", fallbackOut);	
				
			}
			else {
			
				content.addClass("cj-caption-option");
				
			}
			
		}
		
		if(par.attr("data-url")) par.addClass("cj-mouse").on("click.cj", gotoURL);
		$this.attr("src", itm.attr("data-src"));
		itm.removeData().remove();
		
	}
	
	// fallback image load event
	MyImage.prototype.imageLoaded = function() {
		
		var img = $(this), $this = img.data("instance");
		
		if(!$this.shine || !canvas) {
			
			finishImage(this, $this, img);
			return;
			
		}
		
		var highPlus = $this.newHeight + 1,
		widePlus = $this.newWidth + 1,
		imageData,
		context,
		
		canv = $("<canvas />").attr({
			
			width: widePlus, 
			height: highPlus
			
		}).css({left: -2, top: -2}).addClass("cj-hover").insertAfter($this.image);
		
		canv = canv[0];
		context = writeContext(canv, this, $this.newWidth, $this.newHeight);
		imageData = context.getImageData(0, 0, widePlus, highPlus);
		$this.parent.data("shine", canv);
		
		ripPixels(imageData);
		context.putImageData(imageData, -1, -1);
		context.restore();
		
		if(!$this.hasHover) $this.parent.on("mouseenter.cj", fallbackOver);
		finishImage(this, $this, img);
		
	};
	
	function finishImage($this, itm, img) {
	
		(!ie8) ? Jacked.tween($this, {opacity: 1}) : $($this).css("opacity", 1);
		img.removeData();
		
		delete itm.parent;
		delete itm.shine;
		delete itm.newWidth;
		delete itm.newHeight;
		delete itm.hasHover;
		
	}
	
	// fallback mouse enter
	function fallbackOver() {
		
		var $this = $(this), data = $this.data(), shine = data.shine, content = data.content;
		
		if(shine) {
			
			Jacked.stopTween(shine);
			shine.style.opacity = 1;
			Jacked.tween(shine, {opacity: 0}, {ease: "Sine.easeInOut"});
				
		}
		
		if(content) Jacked.tween(content, {bottom: 0});
		
	}
	
	// fallback mouse leave
	function fallbackOut() {
		
		var data = $(this).data();
		
		Jacked.tween(data.content, {bottom: data.contentH});
		
	}
	
	// test if the browser supports css3 transforms
	function getTransformStyle(itm) {
		
		if("WebkitTransformStyle" in itm) {
	
			return "WebkitTransformStyle";
			
		}
		else if("MozTransformStyle" in itm) {
		
			return "MozTransformStyle";
			
		}
		else if("OTransformStyle" in itm) {
		
			return "OTransformStyle";
			
		}
		else if("msTransformStyle" in itm) {
		
			return "msTransformStyle";
			
		}
		else if("transformStyle" in itm) {
			
			return "transformStyle";
			
		}
		
		return null;
		
	}
	
	// test if the browser supports 3D
	function getPerspective(itm) {
		
		if("WebkitPerspective" in itm) {
	
			return "WebkitPerspective";
			
		}
		else if("MozPerspective" in itm) {
		
			return "MozPerspective";
			
		}
		else if("OPerspective" in itm) {
		
			return "OPerspective";
			
		}
		else if("msPerspective" in itm) {
		
			return "msPerspective";
			
		}
		else if("perspective" in itm) {
			
			return "perspective";
			
		}
		
		return null;
		
	}
	
	// fired after Google fonts have loaded
	function fontLoaded() {
		
		$(".cj-carousel").cjCarousel("init");
			
	}
	
	// init
	$(doc).ready(function() {
		
		ie8 = Jacked.getIE();
		browser = Jacked.getBrowser();
		touchMobile = Jacked.getMobile();
		transform = Jacked.getTransform();
		brightness = ((brightness - 128) * contrast) + 128;
		
		var style = doc.body.style;
		perspective = getPerspective(style);
		transformStyle = getTransformStyle(style);
		canvas = "getContext" in $("<canvas />")[0];
		
		if(useGoogleFonts) {
			
			var wf = doc.createElement("script"), 
			s = doc.getElementsByTagName("script")[0];
			
			WebFontConfig = {google: {families: googleFonts}, active: fontLoaded};
			wf.src = ("https:" == doc.location.protocol ? "https" : "http") + "://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
			wf.type = "text/javascript";
			wf.async = "true";
			s.parentNode.insertBefore(wf, s);
			
		}
		else {
		
			fontLoaded();
			
		}

	});
	
	
})(jQuery);






