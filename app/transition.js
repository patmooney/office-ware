import $ from 'jquery';
import Navigo from 'navigo';
import Handlebars from 'handlebars';

var _defaults = {
    transitionTime: 1000,
    _pageLoad: true
};

export default class {

    constructor( options = {} ){
        var _this = this;
        Object.keys( _defaults ).forEach( key => {
            _this[key] = options[key] === undefined ?
                _defaults[key] :
                options[key];
        });
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
        var curAnim = to > currentScreen ? { top: "-110%" } : { top: '110%' };
        // where the 'to' view should being
        var toAnim = to > currentScreen ? { top: "110%" } : { top: '-110%' };

        if ( this._pageLoad ) {
            this._pageLoad = false;
            slideTime = 0;
        }
        else if ( to == currentScreen ) {
            return false;
        }

        $('body').css({"overflow-y": 'hidden'});
        setTimeout(function() {
            $('body').css({"overflow-y": 'auto'});
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

    /*
        routeOptions: {
            '$view_name': {
                options: ... options for template ...
                callback: function () { ... i get called when the view is transition to ... }
            }
        }
    */

    // set up view ordering
    init ( routeOptions = {} ) {
        var count = 1;
        var _this = this;
        var routes = {};

        $('.view-container').each( function ( _, el ) {
            $(el).attr('data-view-n',count);
            $(el).css({ top: '110%', display: "none" });

            var view = $(el).attr('data-view');
            var template = $(el).attr('data-template');

            // if the view name begins with an underscore then there is no template
            var opts = routeOptions[view] || {};

            if ( template ) {
                var template = `templates/${template}.hbs`;
                var t = require(template);
                $(el).html(
                    t( opts.options === undefined ? {} : opts.options )
                );
            }

            // if view begins with underscore then no routing
            if ( ! view.match(/^_/) ){
                var routerFunc = function () {
                    _this.transition(view);
                    if ( opts.callback !== undefined ){
                        opts.callback();
                    }
                };

                routes[`/${view}`] = routerFunc;
                if ( count === 1 ){
                    routes['/'] = routerFunc;
                }

                $(`a[data-view="${view}"]`).each( ( _, el ) => {
                    $(el).click( e => {
                        e.preventDefault();
                        _this.router.navigate(`/${view}`);
                    });
                });
            }

            count++;
        });

        this.router = new Navigo( null, true ); // root, useHash
        this.router.on(routes).resolve();
    }

    navigate ( view ) {
        this.router.navigate(`/${view}`);
    }

};
