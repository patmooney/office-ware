import BouncingBall from 'bouncing-ball';

export default class {

    constructor ( opts = {} ) {
        opts.ballColour = opts.ballColour || [ 'red','green','#ff00ee' ];

        /* darkness */
        this.darkness = $('<div />',{ 'class':'darkness' });

        /* white center */
        this.container = $('<div />',{ 'class':'loading-container'});

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
