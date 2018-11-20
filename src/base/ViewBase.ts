/// <reference path="..\helpers\CanvasHelper.ts"/>

/**
 * Base Class that is generic for all screen classes
 */
abstract class ViewBase {

    protected readonly d_canvasHelper: CanvasHelper;
    protected readonly d_changeViewCallback: (aNewView: ViewBase) => void;

    private d_alive: boolean = true;

    /**
     * Constructor
     * Creates the object and initializes the members
     * @param {HTMLCanvasElement} aCanvas - the canvas where to render to
     * @param aChangeViewCallback -
     */
    protected constructor(aCanvas: HTMLCanvasElement, aChangeViewCallback: (aNewView: ViewBase) => void ) {

        // construct our helper class
        this.d_canvasHelper = new CanvasHelper(aCanvas);

        // store the callback for viewchanges
        console.log(aChangeViewCallback);
        this.d_changeViewCallback = aChangeViewCallback;

        // let our helper class handle the click handling
        // and let him pass the result to our method
        this.d_canvasHelper.RegisterOnClick(this.OnClick);
    }

    /**
     * OnClick
     * @AccessModifier {Private}
     * Handles the internal redirection of the click event.
     * @param {MouseEvent} Event - the class containing information for the event
     */
    private OnClick = (aXaxis: number, aYaxis: number): void => {
        // handle some flow control based upon the X and Y if necessary
        // but only if this is the same for any screen (e.g. space = pause)

        if (!this.d_alive) return; // workaround to solve lingering onClick events
        // call a method that is implemented in the derived class
        this.HandleClick(aXaxis, aYaxis);

    }

    /**
     * Render
     * @AccessModifier {Public}
     * Handles the drawing of screens in general
     */
    public Render(): void {
        // let the helper clear the screen
        this.d_canvasHelper.Clear();
        // call the derived RenderScreen method
        this.RenderScreen();
    }

    /**
     * BeforeExit
     * @access public
     * Handles the cleanup
     */
    public BeforeExit(): void {
        // Clear any lingering events.
        this.d_alive = false; // workaround for now
    }


    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------
    // -------- Method declarations to be implemented in the derived class ----------------
    // ------------------------------------------------------------------------------------
    /**
     * OnClick
     * @access protected
     * Handles the internal redirection of the click event.
     * @param {number} X - the x position of the mouseclick
     * @param {number} Y - the class containing information for the event
     */
    protected abstract HandleClick(X: number, Y: number): void;

    /**
     * RenderScreen
     * @AccessModifier {Protected}
     * Handles the internal redirection of the click event.
     * @param {MouseEvent} Event - the class containing information for the event
     */
    protected abstract RenderScreen(): void;
}