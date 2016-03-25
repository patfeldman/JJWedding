var Wedding = {};
Wedding.peoplePhotoIndex = 0;
Wedding.peoplePhotoList = {};
Wedding.peopleTitleList = {};

Wedding.Initialize = function(){

    $allPeoplePhotos = $("#party").find(".weddingPartyGroup .imgWrapper a");
    Wedding.peoplePhotoList = $allPeoplePhotos
        .map(function() {
            return $(this).attr("data-image");
          }).get();
    Wedding.peopleTitleList = $allPeoplePhotos
        .map(function() {
            return $(this).attr("data-tooltip");
          }).get();

	$(".button-collapse").sideNav({
      menuWidth: 300, // Default is 240
    });

	$('.tooltipped').tooltip({delay: 70});

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


    $(".imgNavigatorLeft").on("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        Wedding.LoadPhoto(Wedding.peoplePhotoIndex-1);
    });
    $(".imgNavigatorRight").on("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        Wedding.LoadPhoto(Wedding.peoplePhotoIndex+1);
    });

    //select all the a tag with name equal to modal
    $('a[name=modal]').click(function(e) {
        //Cancel the link behavior
        e.preventDefault();
        //transition effect     
        $('#mask').fadeIn(300);   
        $('#mask #maskBg').fadeTo("fast",0.8);  
        var dataImage = $(this).attr('data-image');
        var index = Wedding.peoplePhotoList.indexOf(dataImage);
        Wedding.LoadPhoto(index);
    });
        
    //if mask is clicked
    $('#mask').click(function () {
        $(this).hide();
        $('.window').hide();
    }); 

    Wedding.$mask = $("#mask");

};


Wedding.LoadPhoto = function(index){
        //Get the A tag
        var $imageWrapper = Wedding.$mask.find(".image-wrapper");
        var $captionWrapper = Wedding.$mask.find(".caption-wrapper");
        $imageWrapper.html("");
        $captionWrapper.html("");

        Wedding.peoplePhotoIndex = index;
        var image_url = "img/profile/" + Wedding.peoplePhotoList[index];
        var name = Wedding.peopleTitleList[index];
        
        // create <img>-element on the fly, as you might not need it beforehand
        var $image = $('<img/>', { src: image_url });
        $image.addClass('personImage').addClass('valign');
        // append it as a child to another element
        $imageWrapper.append($image);

        var $caption  = $('<div/>').addClass("caption").addClass("valign").html(name);
        $captionWrapper.append($caption);
        //transition effect
        $image.fadeIn(1000); 

        if (index === 0){
            $("#mask .imgNavigatorLeft").addClass("none");
        } else {
            $("#mask .imgNavigatorLeft").removeClass("none");
        }
        if (index === (Wedding.peoplePhotoList.length - 1)){
            $("#mask .imgNavigatorRight").addClass("none");
        } else {
            $("#mask .imgNavigatorRight").removeClass("none");            
        }
};

Wedding.AnimateRight = function(){};


Wedding.ScrollNav = function(id){
	$('html,body').animate({scrollTop: $("."+id).offset().top},'slow');
};


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