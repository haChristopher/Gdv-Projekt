$( ".buttons #buttonPlayOrPause" ).on( "click", function() {
    if ($(this).attr("alt") === "play") {
        $(this).attr("alt", "stop");
        $(this).attr("src", "/images/buttonPause.png");
    } else {
        $(this).attr("alt", "play");
        $(this).attr("src", "/images/buttonPlay.png");
    }
});
