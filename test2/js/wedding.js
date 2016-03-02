var Wedding = {};

Wedding.Initialize = function(){

    $('.materialboxed').materialbox();
      // Initialize collapse button
	$(".button-collapse").sideNav({
      menuWidth: 300, // Default is 240
    });



    $("#next,#prev").click(function() {        
        return Wedding.Scroll($(this).attr('id'));        
    });

    $(".scrolltoanchor").click(function() {
        $.scrollTo($($(this).attr("href")), {
            duration: 750
        });
        return false;
    });

    $("ul#Navigation li, ul#NavigationSmall li").on("click", function(e){
    	var $target = $(e.target);
    	if (!$target.is("li")) $target = $target.closest("li");
    	var id = $target.attr("class").split(" ")[0];

    	var gotoId = id.replace("-nav", "");
    	Wedding.ScrollNav(gotoId);
    });
	
    $("#home .rsvpText").on("click", function(e){
    	Wedding.ScrollNav("rsvp");
    });
	

	$( ".navBarRight" ).click(function(e) {
		var $target = $(e.target);
		var $leftContent = $target.parent().find(".boxLeft");
		var $rightContent = $target.parent().find(".boxRight");
		var $navBarLeft = $target.parent().find(".navBarLeft");

		$leftContent.removeClass("moveRight");
		$rightContent.removeClass("moveRight");

		$leftContent.addClass("moveLeft");
		$rightContent.addClass("moveLeft");
		$target.removeClass("visible").addClass("hidden");
		$navBarLeft.removeClass("hidden").addClass("visible");
	});

	$( ".navBarLeft" ).click(function(e) {
		var $target = $(e.target);
		var $leftContent = $target.parent().find(".boxLeft");
		var $rightContent = $target.parent().find(".boxRight");
		var $navBarRight = $target.parent().find(".navBarRight");

		$leftContent.removeClass("moveLeft");
		$rightContent.removeClass("moveLeft");

		$leftContent.addClass("moveRight");
		$rightContent.addClass("moveRight");
		$target.removeClass("visible").addClass("hidden");
		$navBarRight.removeClass("hidden").addClass("visible");
	});

	$(".hearts .highlight, .boats .highlight").on("hover click", function(e){
		var $target = $(e.target);
		$target.parent().find(".selected").removeClass("selected");
		$target.addClass("selected");
		var heartNum = $(e.target).attr("data-heart-num");
		var $stories = $(e.target).closest(".content-box").find(".storyInfo");
		$stories.find(".selected").removeClass("selected");
		$stories.find(".story" + heartNum).addClass("selected");
	});

};


Wedding.AnimateRight = function(){};


Wedding.ScrollNav = function(id){
	$('html,body').animate({scrollTop: $("."+id).offset().top},'slow');
}


Wedding.Scroll = function(direction) {

    var scroll, i,
            positions = [],
            here = $(window).scrollTop(),
            collection = $('.slide');

    collection.each(function() {
        positions.push(parseInt($(this).offset()['top'],10));
    });

    for(i = 0; i < positions.length; i++) {
        if (direction == 'next' && positions[i] > here) { scroll = collection.get(i); break; }
        if (direction == 'prev' && i > 0 && positions[i] >= here) { scroll = collection.get(i-1); break; }
    }

    if (scroll) {
        $.scrollTo(scroll, {
            duration: 750       
        });
    }

    return false;
};

$(function() {	
	Wedding.Initialize();

});