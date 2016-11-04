$( function() {

    var transitionTime = 1500;
    $( "#datepicker-from, #datepicker-to" ).datepicker();
//    $( "#datepicker-to" ).datepicker();
    $( "#send-request" ).click( function () {
        $('#container-1').toggle('slide', { direction: "up", duration: transitionTime });
        $('#container-2').toggle('slide', { direction: "down", duration: transitionTime });
    });
    $( "#view-holiday" ).click( function () {
        $('body').css({overflow: 'hidden'});
        $('#big-container-1').toggle('slide', { direction: "up", duration: transitionTime });
        $('#big-container-2').toggle('slide', { direction: "down", duration: transitionTime });
        setTimeout(function() {$('body').css({overflow: 'auto'});}, transitionTime);
    });


});

var refreshHoliday = function () {
    jQuery.ajax(
        '/api/holiday',
        {
            success: function ( data ){
                $('#holiday-list-container').html(
                    Handlebars.template(
                        Handlebars.templates['holiday-list']
                    )({ fixtures: data.data, hello: "sausage" })
                );
            }
        }
    );
};
