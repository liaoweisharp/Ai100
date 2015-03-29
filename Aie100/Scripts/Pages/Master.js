
window.onload = function () {
    if (typeof mycoursepageFlag=="undefined" && window.screen.width > 1400) {
        document.body.className = "w1240";
    } else {
        document.body.className = "w1024";
    }
    var $master_divMore = $("div.master_more");
    var $master_liMore = $("#master_limore");

    $master_divMore.css({ width: $master_divMore.parent().width() + "px" })
    $master_liMore.click(function () {
        $master_divMore.slideDown();
    });

    $master_liMore.mouseleave(function () {
        $master_divMore.slideUp();
    })

    $("#master_tlcenter,#master_liefficiency").click(function () {
        var url = $(this).find("span[location]").attr("location");
        location.href = url;
    });


}
