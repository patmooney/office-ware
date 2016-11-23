import BouncingBall from 'bouncing-ball';

export default class {

    constructor ( opts = {} ) {
        opts.ballColour = opts.ballColour || [ 'red','green','#ff00ee' ];

        /* darkness */
        this.darkness = $('<div />');
        this.darkness.css({
            display: "hidden",
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            "background-color": "black",
            opacity: "0.8"
        });

        /* white center */
        this.container = $('<div />');
        this.container.css({
            position: "absolute",
            height: "100px",
            width: "100px",
            top: "25%",
            left: "50%",
            "margin-left": "-50px",
            "background-color": "white",
            "border-radius": "15px",
            "display": "hidden"
        });

        $('body').append(this.darkness);
        $('body').append(this.container);

        this.ball = new BouncingBall( opts );
    }

    start () {
        this.darkness.show();
        this.container.show();
        this.ball.bounce( this.containerEl() );
    }

    stop () {
        this.ball.unbounce();
        this.darkness.hide();
        this.container.hide();
    }

    destroy () {
        this.stop();
        this.darkness.remove();
        this.container.remove();
    }

    containerEl () {
        return this.container[0];
    }

}
