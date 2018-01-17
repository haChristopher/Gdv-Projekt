$( ".buttons #buttonPlayOrPause" ).on( "click", function() {
    if ($(this).attr("alt") === "play") {
        $(this).attr("alt", "pause");
        $(this).attr("src", "/images/buttonPause.png");
    } else {
        $(this).attr("alt", "play");
        $(this).attr("src", "/images/buttonPlay.png");
    }
});

$( ".buttons #buttonBackwards" ).on( "click", function() {
    if ($(".buttons #buttonPlayOrPause").attr("alt") === "pause") {
        $(".buttons #buttonPlayOrPause").attr("alt", "pause");
        $(".buttons #buttonPlayOrPause").attr("src", "/images/buttonPlay.png");
    }
});

$( ".buttons #buttonForwards" ).on( "click", function() {
    if ($(".buttons #buttonPlayOrPause").attr("alt") === "pause") {
        $(".buttons #buttonPlayOrPause").attr("alt", "pause");
        $(".buttons #buttonPlayOrPause").attr("src", "/images/buttonPlay.png");
    }
});

$( ".buttons #buttonReturn" ).on( "click", function() {
    if ($(".buttons #buttonPlayOrPause").attr("alt") === "pause") {
        $(".buttons #buttonPlayOrPause").attr("alt", "pause");
        $(".buttons #buttonPlayOrPause").attr("src", "/images/buttonPlay.png");
    }
});


// $( ".buttons #buttonBackwards" ).on( "click", function() {
//     $(this).fadeTo()
//         // .animate({color: "red"}, 300);
//         // .animate({width: "10%"}, 300);
// });
//
// $(".buttons #buttonBackwards").hover(function() {
//     $(this).attr("src", "/images/buttonBackwardsPushed.png");
// }, function() {
//     $(this).find("span:last").remove();
// });
//
// $( "li.fade" ).hover(function() {
//   $( this ).fadeOut( 100 );
//   $( this ).fadeIn( 500 );
// });



// $( ".buttons #buttonBackwards" ).on( "click", function() {
//
//
//     $("#buttonBackwards").fadeOut("slow",function(){
//         $("#buttonBackwards").load(function () { //avoiding blinking, wait until loaded
//             $("#buttonBackwards").fadeIn();
//         });
//         $("#buttonBackwards").attr("src","/images/buttonPlay.png");
//     });
// });
