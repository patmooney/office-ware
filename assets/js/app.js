$( function() {
    $( "#datepicker-from" ).datepicker();
    $( "#datepicker-to" ).datepicker();
    $( "#send-request" ).click( function () {
        $('#container-1').toggle('slide', { direction: "up" });
        $('#container-2').toggle('slide', { direction: "down" });
    });
});
