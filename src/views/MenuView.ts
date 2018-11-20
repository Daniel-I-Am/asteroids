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
        super(aCanvas,aChangeViewCallback);
    }

    protected HandleClick = (aXpos: number, aYpos: number): void => {
        // get the center
        const center = this.d_canvasHelper.GetCenter();
        if (aXpos > center.X - 111 && aXpos < center.X + 111) {
            if (aYpos > center.Y + 219 && aYpos < center.Y + 259) {
                // clear the canvas

                // change the View << is explained tomorrow
                this.d_changeViewCallback(new GameView(this.d_canvasHelper.getCanvas(),this.d_changeViewCallback));
            }
        }
    }

    protected RenderScreen(): void {
        // copy and modify the code from start_screen from the game.ts
    }

}