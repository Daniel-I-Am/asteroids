/// <reference path="../base/ViewBase.ts"/>

class ScoreView extends ViewBase
{
    private score: number;
    private player: string;
    private highscores: Array<Score>

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
                this.d_changeViewCallback(new MenuView(this.d_canvasHelper.getCanvas(), this.d_changeViewCallback));
            }
        }
    }

    public setScore(aScore: number) {
        this.score = aScore;
    }

    public setPlayer(aName: string) {
        this.player = aName;
    }

    public setHighscores(aScores: Array<Score>) {
        this.highscores = aScores;
    }

    protected RenderScreen(): void {
        const center = this.d_canvasHelper.GetCenter();

        //1. draw your score
        this.d_canvasHelper.writeTextToCanvas(`${this.player} score is ${this.score}`, 80, center.X, center.Y - 100);

        //2. draw all highscores
        this.d_canvasHelper.writeTextToCanvas("HIGHSCORES", 40, center.X, center.Y);

        this.highscores.forEach((element, index) => {
            center.Y += 40;

            this.d_canvasHelper.writeTextToCanvas(
                `${index + 1}: ${element.playerName} - ${element.score}`,
                20,
                center.X,
                center.Y
            );
        });
    }

}