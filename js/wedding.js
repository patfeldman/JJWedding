var Wedding = {};
Wedding.$stickyHeader;
Wedding.$floatingHeader;
Wedding.$mainPictureSection;

Wedding.Initialize = function () {
    Wedding.$stickyHeader = $(".makeStickyHeader");
    Wedding.$mainPictureSection = $("#MainPicture");
    Wedding.InitializeStickyHeader();

    var elements = document.querySelectorAll( '.intense' );
    Intense( elements );


    Wedding.IntializePageAnimations():
};

Wedding.InitialPageAnimations = function(){
    $(".pageAnimation").on("click", Wedding.GoToPage);
};

Wedding.GoToPage = function(e, i){
    var toPage = $(e.target).attr("data-to-page");
    if (toPage.length > 0){
        var $newPage = $(e.target).closest(".animationContainer").parent().find("." + toPage);
        
    }
};

Wedding.InitializeStickyHeader = function () {
    // push this function to the bottom so that sortable can 
    if (Wedding.$stickyHeader.length) {
        var $clone = Wedding.$stickyHeader.clone();
        $clone.addClass("stickyHeader");
        $clone.addClass("invisible");
        $clone.removeClass("makeStickyHeader");
        $clone.css("z-index", 1000);
        Wedding.$stickyHeader.after($clone);
        Wedding.$floatingHeader = $(".stickyHeader");
        $(window).on('scroll', Wedding.CheckStickyHeader);
    }
};

Wedding.CheckStickyHeader = function () {
    if (Wedding.$stickyHeader.length) {
        var offset = Wedding.$stickyHeader.offset();
        var scrollTop = $(window).scrollTop();

        // wont work with scrollable tables
        if ((scrollTop > offset.top)) {
            Wedding.$floatingHeader.removeClass("invisible");
            Wedding.$mainPictureSection.addClass("invisible");
        } else {
            Wedding.$floatingHeader.addClass("invisible");
            Wedding.$mainPictureSection.removeClass("invisible");
        };
    }
};

$(function () {
    "use strict";
    Wedding.Initialize();
});
