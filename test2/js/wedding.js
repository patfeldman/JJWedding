var Wedding = {};
Wedding.photos = {};
Wedding.currentAlbumIndex = 0;

Wedding.Initialize = function(){
    Wedding.$albumModal = $("#mask");
    Wedding.$tooltip = $("#DynamicTooltip");


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

    //ToolTips
    $('.tooltip').on("hover", function(){


    });

    $(".tooltip").on("mouseover", Wedding.Hover_OpenTooltip);
    $(".tooltip").on("mouseout", function(e){Wedding.$tooltip.addClass("none");});
    // set up all albums on page
    Wedding.Album_LoadAlbums();
    Wedding.$albumModal.find(".imgNavigatorLeft").on("click", Wedding.Album_OnPrevClick);
    Wedding.$albumModal.find(".imgNavigatorRight").on("click", Wedding.Album_OnNextClick);
    $('.photo-album .photo').on("click", Wedding.Album_OnImageClick);
    //$('#story .photo-album').on("click", function);
    Wedding.$albumModal.click(function () {$(this).hide();}); 

    $("#rsvp").find("form").on( "submit", Wedding.Submit_weddingRsvp);
};

Wedding.Submit_weddingRsvp = function(e) {
    e.preventDefault();
    data = '{}';
    var $fName = $( "#first_name" ),
    $lName = $( "#last_name" ),
    $email=$("#email"),
    $numGuests=$("#numguests"),
    $campFri=$("#campFri"),
    $campSat=$("#campSat"),
    $building = $("#buildingBox"),
    $teamName = $("#team_name"),
    allFields = $( [] ).add($fName).add($lName).add($email).add($numGuests).add($campFri).add($campSat).add($building).add($teamName);

    $.ajax({
        type: "POST",
        url: 'api/weddingRsvp.php',
        data: allFields.serialize(),
        success: function(data){
            $("#rsvp form").addClass("none");
            $("#ThankYouNote").removeClass("none");
        },
        error:function(data){
            alert("Error on the page, try again later please!");
        },
        dataType: 'json'
    });
}


Wedding.Hover_OpenTooltip = function (e){
    $target = $(e.target);
    if ($target.hasClass("noHover")) return;
    var tooltip = $target.attr("title");
    var $tooltipTextBox = $("<span />").addClass("tooltip").html(tooltip);
    Wedding.$tooltip.html("").append($tooltipTextBox).removeClass("none");
    var halfWidth = Wedding.$tooltip.width()/2;
    var targetHalfWidth = $target.width()/2;
    var offset = $target.offset();
    var top = offset.top + 68;
    var left = offset.left + targetHalfWidth - halfWidth;
    Wedding.$tooltip.offset({top:top, left:left});
};

Wedding.Album_LoadAlbums = function(){
    $('.photo-album').each(function(){
        var $albumIndex = parseInt($(this).attr('data-album-index'));
        var $allPeoplePhotos = $(this).find(".photo");
        Wedding.photos[$albumIndex] = {};
        Wedding.photos[$albumIndex].photoList = $allPeoplePhotos.map(function() {return $(this).attr("data-image");}).get();
        Wedding.photos[$albumIndex].storyList = $allPeoplePhotos.map(function() {return $(this).attr("data-story");}).get();
        Wedding.photos[$albumIndex].titleList = $allPeoplePhotos.map(function() {return $(this).attr("data-title");}).get();
        Wedding.photos[$albumIndex].photoIndex = 0;
    });
};
Wedding.Album_OnImageClick = function(e){
    //Cancel the link behavior
    e.preventDefault();
    //transition effect     
    Wedding.$albumModal.fadeIn(300);   
    Wedding.$albumModal.find('#maskBg').fadeTo("fast",0.8);  
    var dataImage = $(this).attr('data-image');
    Wedding.currentAlbumIndex = parseInt($(this).closest('.photo-album').attr('data-album-index'));
    Wedding.Album_SetPhotoIndex(Wedding.currentAlbumIndex, Wedding.photos[Wedding.currentAlbumIndex].photoList.indexOf(dataImage));
    Wedding.Album_LoadPhoto(Wedding.currentAlbumIndex);
};

Wedding.Album_OnNextClick = function(e){
    e.preventDefault();
    e.stopPropagation();
    Wedding.Album_NextPhoto(Wedding.currentAlbumIndex);

};
Wedding.Album_OnPrevClick = function(e){
    e.preventDefault();
    e.stopPropagation();
    Wedding.Album_PreviousPhoto(Wedding.currentAlbumIndex);
};
Wedding.Album_UpdateArrows = function(albumIndex){
    var photoIndex = Wedding.photos[albumIndex].photoIndex;
    var albumLength = Wedding.photos[albumIndex].photoList.length;
    if (photoIndex === 0){
        Wedding.$albumModal.find(".imgNavigatorLeft").addClass("none");
    } else {
        Wedding.$albumModal.find(".imgNavigatorLeft").removeClass("none");
    }
    if (photoIndex >= (albumLength - 1)){
        Wedding.$albumModal.find(".imgNavigatorRight").addClass("none");
    } else {
        Wedding.$albumModal.find(".imgNavigatorRight").removeClass("none");            
    }
};

Wedding.Album_NextPhoto = function(albumIndex){
    Wedding.Album_SetPhotoIndex (albumIndex, Wedding.photos[albumIndex].photoIndex+1);
    Wedding.Album_LoadPhoto(albumIndex);
};
Wedding.Album_PreviousPhoto = function(albumIndex){
    Wedding.Album_SetPhotoIndex (albumIndex, Wedding.photos[albumIndex].photoIndex-1);
    Wedding.Album_LoadPhoto(albumIndex);
};
Wedding.Album_SetPhotoIndex = function(albumIndex, photoIndex){
    if (photoIndex < 0) photoIndex = 0;
    if (photoIndex >= Wedding.photos[albumIndex].photoList.length) photoIndex = Wedding.photos[albumIndex].photoList.length;
    Wedding.photos[albumIndex].photoIndex = photoIndex;
};

Wedding.Album_LoadPhoto = function(albumIndex){
        //Get the A tag
        var $imageWrapper = Wedding.$albumModal.find(".image-wrapper");
        var $captionWrapper = Wedding.$albumModal.find(".caption-bottom-wrapper");
        var $captionTopWrapper = Wedding.$albumModal.find(".caption-top-wrapper");
        $imageWrapper.html("");
        $captionWrapper.html("");
        $captionTopWrapper.removeClass("none").html("");

        var photoIndex = Wedding.photos[albumIndex].photoIndex;
        if (Wedding.photos[albumIndex].titleList.length > 0){
            var title = Wedding.photos[albumIndex].titleList[photoIndex];
            var $title  = $('<div/>').addClass("caption").addClass("valign").html(title);
            $captionTopWrapper.append($title);
        } else {
            $captionTopWrapper.addClass("none");
        }
        // create <img>-element on the fly, as you might not need it beforehand
        var image_url = "img/" + Wedding.photos[albumIndex].photoList[photoIndex];
        var $image = $('<img/>', { src: image_url });
        $image.addClass('personImage').addClass('valign');
        $image.fadeIn(500);
        // append it as a child to another element
        $imageWrapper.append($image);

        var story = Wedding.photos[albumIndex].storyList[photoIndex];
        var $caption  = $('<div/>').addClass("caption").addClass("valign").html(story);
        $captionWrapper.append($caption);

        Wedding.Album_UpdateArrows(albumIndex);
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