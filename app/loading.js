import BouncingBall from 'bouncing-ball';

export default class {

    constructor ( opts = {} ) {
        opts.ballColour = opts.ballColour || [ 'red','green','#ff00ee' ];

        /* darkness */
        this.darkness = $('<div />');
        this.darkness.css({
            position: "absolute",
            top: "50px",
            left: "0px",
            width: "100%",
            height: "400px",
            "background-color": "black",
            opacity: "0.8"
        });

        /* white center */
        this.container = $('<div />');
        this.container.css({
            position: "absolute",
            height: "100px",
            width: "100px",
            top: "200px",
            left: "50%",
            "margin-left": "-50px",
            "background-color": "white",
            "border-radius": "15px"
        });

        $('body').append(this.darkness);
        $('body').append(this.container);
        this.darkness.hide();
        this.container.hide();

        this.ball = new BouncingBall( this.containerEl(), opts );
    }

    show () {
        this.darkness.fadeIn(500);
        this.container.fadeIn(500);
        this.ball.bounce();
    }

    hide () {
        this.darkness.hide();
        this.container.hide();
        this.ball.unbounce();
    }

    containerEl () {
        return this.container[0];
    }

}
