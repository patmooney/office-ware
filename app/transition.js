import $ from 'jquery';

export default class {
    constructor( transitionTime ){
        this.transitionTime = ( transitionTime === undefined ) ?
            1000 :
            transitionTime;
        this._pageLoad = true;
    }
    /*
        all ".view-container" are assigned a data-view attribute, then transitions
        are based on their current location.
        when the page first loads, the order is arranged so the first screen
    */
    transition ( view ) {
        var slideTime = this._pageLoad ? 0 : this.transitionTime;
        var fadeTime = this.transitionTime + 200;
        var currentScreen = window._view_current;
        var $current = $(`.view-container[data-view-n="${currentScreen}"]`);
        var $to = $(`.view-container[data-view="${view}"]`);
        var to = $to.attr('data-view-n');

        // where the 'current' view should end up
        var curAnim = to > currentScreen ? { top: "-150%" } : { top: '150%' };
        // where the 'to' view should being
        var toAnim = to > currentScreen ? { top: "150%" } : { top: '-150%' };

        if ( this._pageLoad ) {
            this._pageLoad = false;
            slideTime = 0;
        }
        else if ( to == currentScreen ) {
            return false;
        }

        $('body').css({overflow: 'hidden'});
        setTimeout(function() {
            $('body').css({overflow: 'auto'});
        }, fadeTime);

        if ( $current ) {
            $current.animate(curAnim, { duration: slideTime, queue: false });
            $current.fadeOut( { duration: fadeTime, queue: false } );
        }

        if ( $to ) {
            $to.css(toAnim);
            $to.animate({ top: "0%" }, { duration: slideTime, queue: false } );
            $to.fadeIn( { duration: fadeTime, queue: false } );
        }

        window._view_current = to;
    }

    // set up view ordering
    setup () {
        var count = 1;
        $('.view-container').each( function ( _, el ) {
            $(el).attr('data-view-n',count);
            $(el).css({ top: '150%', display: "none" });
            count++;
        });
    }
};
