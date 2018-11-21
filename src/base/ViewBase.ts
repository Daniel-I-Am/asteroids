/// <reference path="../helpers/CanvasHelper.ts"/>

/**
 * Base Class that is generic for all screen classes
 */
abstract class ViewBase {

    protected readonly d_canvasHelper: CanvasHelper;

    protected readonly d_changeViewCallback: (aNewView: ViewBase) => void;

    /**
     * Creates the object and initializes the members
     * @param {HTMLCanvasElement} aCanvas - the canvas where to render to
     * @param aChangeViewCallback -
     */
    protected constructor(aCanvas: HTMLCanvasElement, aChangeViewCallback: (aNewView: ViewBase) => void) {

        // construct our helper class
        this.d_canvasHelper = CanvasHelper.Instance(aCanvas);

        // store the callback for view changes
        this.d_changeViewCallback = aChangeViewCallback;

        // let our helper class handle the click handling
        // and let him pass the result ro our method
        // NO LONGER REQUIRED.
        // this.d_canvasHelper.RegisterOnClick(this.OnClick);
    }

    /**
     * Handles the internal redirection of the click event.
     * @access private
     * @param {number} aXaxis - the x position of the click event
     * @param {number} aYaxis - the y position of the click event
     */
    // NO LONGER REQUIRED, THERE IS A BETTER SOLLUTION IMPLEMENTED
    //    private OnClick = (aXaxis : number, aYaxis : number) : void => {
    // handle some flow control based upon the X and Y if necessary
    // but only if this is the same for any screen (e.g. space = pause)

    //        if (!this.d_alive) return; // workaround to solve lingering onClick events
    // call a method that is implemented in the derived class
    //        this.HandleClick(aXaxis, aYaxis);
    //    }

    /**
     * Handles the drawing of screens in general
     * @access public
     */
    public Render(): void {
        this.d_canvasHelper.Clear();
        this.RenderScreen();
    }

    /**
     * Handles the cleanup
     * @access public
     */
    public BeforeExit(): void {
        // Clear any lingering events.
        this.Cleanup();
    }

    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------
    // -------- Method declarations to be implemented in the derived class ----------------
    // ------------------------------------------------------------------------------------
    /**
     * Handles the internal redirection of the click event.
     * @access protected
     * @param {MouseEvent} Event - the class containing information for the event
     * @abstract
     */
    protected abstract RenderScreen(): void;

    /**
     * Handles all the actions before the class goes out of scope
     * @access protected
     * @abstract
     */
    protected abstract Cleanup(): void;
}
