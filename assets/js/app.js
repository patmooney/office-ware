$( function() {
    var transitionTime = 1500;
    $( "#datepicker-from" ).datepicker();
    $( "#datepicker-to" ).datepicker();
    $( "#send-request" ).click( function () {
        $('#container-1').toggle('slide', { direction: "up" });
        $('#container-2').toggle('slide', { direction: "down" });
    });
    $( "#view-holiday" ).click( function () {
        $('body').css({overflow: 'hidden'});
        $('#big-container-1').toggle('slide', { direction: "up", duration: transitionTime });
        $('#big-container-2').toggle('slide', { direction: "down", duration: transitionTime });
        setTimeout(function() {$('body').css({overflow: 'auto'});}, transitionTime);
    });
});
