$("#buttonPlayOrPause").on("click", function() {
    if ($(this).attr("alt") === "play") {
        $(this).attr("alt", "pause");
        $(this).attr("src", "/images/buttonPause.png");
        $(this).fadeOut(0, function() {
            $(this).fadeIn(200);
        });
    } else {
        $(this).attr("alt", "play");
        $(this).attr("src", "/images/buttonPlay.png");
        $(this).fadeOut(0, function() {
            $(this).fadeIn(200);
        });
    }
});

$("#buttonBackwards").on("click", function() {
    if ($("#buttonPlayOrPause").attr("alt") === "pause") {
        $("#buttonPlayOrPause").attr("alt", "play");
        $("#buttonPlayOrPause").attr("src", "/images/buttonPlay.png");
    }

    $(this).fadeOut(0, function() {
        $(this).fadeIn(200);
    });
});

$("#buttonForwards").on("click", function() {
    if ($("#buttonPlayOrPause").attr("alt") === "pause") {
        $("#buttonPlayOrPause").attr("alt", "play");
        $("#buttonPlayOrPause").attr("src", "/images/buttonPlay.png");
    }

    $(this).fadeOut(0, function() {
        $(this).fadeIn(200);
    });
});

$("#buttonReturn").on("click", function() {
    if ($("#buttonPlayOrPause").attr("alt") === "pause") {
        $("#buttonPlayOrPause").attr("alt", "play");
        $("#buttonPlayOrPause").attr("src", "/images/buttonPlay.png");
    }

    $(this).fadeOut(0, function() {
        $(this).fadeIn(200);
    });
});

$(".button")
    .mouseenter(function() {
        $(this).fadeTo(300, 0.75)
    })
    .mouseleave(function() {
        $(this).fadeTo(300, 1)
    });
