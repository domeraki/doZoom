var $ = jQuery.noConflict();

 

var currentActiveSection = 'docs-start-installation';

function onePageCurrentSection(){
    $(".docs-content-inner").each(function(index) {
        var h = $(this).offset().top;
        var y = $(window).scrollTop();

        if( y + 250 >= h && y < h + $(this).height() && $(this).attr('id') != currentActiveSection ) {
            currentActiveSection = $(this).attr('id');
        }
    });

    return currentActiveSection;
}

$(document).ready(function(){
 

        // Scroll to Top

		$(window).scroll(function() {
			if($(this).scrollTop() > 450) {
                $('#gotoTop').fadeIn();
			} else {
				$('#gotoTop').fadeOut();
			}
		});

		$('#gotoTop').click(function() {
			$('body,html').animate({scrollTop:0},400);
            return false;
		});
	// responsive nav
	var responsiveNav = $('#toggle-nav');
	var navBar = $('.nav-bar');

	responsiveNav.on('click',function(e){
		e.preventDefault();
		 		$("body").toggleClass('active_right_nav');

 		navBar.toggleClass('active');
	});
$(document).on("click",".doc_nav_trigger",function(){
		 		$("div#docs").toggleClass('active_left_nav');

  $(".docs-navigation").toggleClass("active");
})
 
 	var resizing = false;
 
 	$(window).on('resize', function(){
		if( !resizing ) {
			(!window.requestAnimationFrame) ? 
			setTimeout(moveNavigation, 300) : 
			window.requestAnimationFrame(moveNavigation);
			resizing = true;
		}
	});
	function checkMQ() {
		//check if mobile or desktop device
		return window.getComputedStyle(document.querySelector('.main-content'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}

	function moveNavigation(){
  		var mq = checkMQ();
        
        if ( mq == 'mobile'  ) {
console.log("mobile");
		} else if ( ( mq == 'tablet' || mq == 'desktop' && $('.active_right_nav,.active_left_nav').length > 0 )) {
console.log("tablet");
		 		$("div#docs").removeClass('active_left_nav');

  $(".docs-navigation").removeClass("active");
		 		$("body").removeClass('active_right_nav');

 		navBar.removeClass('active');

		}
		resizing = false;
	}
	
	
	   // Scroll to Top

		$(window).scroll(function() {
			if($(this).scrollTop() > 450) {
                $('#gotoTop').fadeIn();
			} else {
				$('#gotoTop').fadeOut();
			}
		});

		$('#gotoTop').click(function() {
			$('body,html').animate({scrollTop:0},400);
            return false;
		});
		
		 $('._intro.bgzoom').doZoom({
 		autoCover:false,
 		restPosition:false,
 		debug:true,
		additionWidth:263,
 		restSize:false,
		 		});   
				$('#gotoTop').doZoom({
 		autoCover:true,
 		restPosition:false,
 		restSize:false,
  		noChild:true
		 		});  
				$('#docs-start-Welcome blockquote').doZoom({
 		autoCover:true,
 		restPosition:false,
 		restSize:false,
   		noChild:true,
		 		}); 
				$('.docnav-DoZoom').doZoom({
 		autoCover:false,
 		restPosition:false, 		
  		noChild:false,

 		restSize:false,
		additionWidth:40,
  		 		});
				


});
 