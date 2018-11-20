/// <reference path="../base/ViewBase.ts"/>

class MenuView extends ViewBase
{
    /**
     * Constructor
     * Creates the object and initializes the members
     * @param {HTMLCanvasElement} aCanvas - the canvas where to render to
     * @param aChangeViewCallback -
     */
    public constructor(aCanvas: HTMLCanvasElement, aChangeViewCallback: (aNewView: ViewBase) => void ) {
        super(aCanvas, aChangeViewCallback);
    }

    protected HandleClick = (aXpos: number, aYpos: number): void => {
        console.log("MenuView.HandleClick", this);
        // get the center
        const center = this.d_canvasHelper.GetCenter();
        if (aXpos > center.X - 111 && aXpos < center.X + 111) {
            if (aYpos > center.Y + 219 && aYpos < center.Y + 259) {
                // clear the canvas
                this.d_canvasHelper.Clear();
                // change the View << is explained tomorrow
                this.d_changeViewCallback(new GameView(this.d_canvasHelper.getCanvas(), this.d_changeViewCallback));
            }
        }
    }

    protected RenderScreen(): void {
        // copy and modify the code from start_screen from the game.ts
        const center = this.d_canvasHelper.GetCenter();

        //1. add 'Asteroids' text
        this.d_canvasHelper.writeTextToCanvas("Asteroids", 140, center.X, 150);

        //2. add 'Press to play' text
        this.d_canvasHelper.writeTextToCanvas("PRESS PLAY TO START", 40, center.X, center.Y - 100);

        //3. add button with 'start' text
        console.log("MenuView.RenderScreen", this);
        this.d_canvasHelper.writeButtonToCanvas("Play!", center.X, center.Y+200, "./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png", 20, this.HandleClick);

        //4. add Asteroid image
        this.d_canvasHelper.writeImageToCanvas("./assets/images/SpaceShooterRedux/PNG/Meteors/meteorBrown_big1.png", center.X, center.Y);
    }

}