class CanvasHelper {

    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D; //this was a bit tricky to find

    /**
     * Constructor of the class
     * @param aCanvas The canvas to help with
     */
    public constructor(aCanvas: HTMLCanvasElement, aWidth: number = -1, aHeight: number = -1) {
        this.canvas = aCanvas;
        this.ctx = aCanvas.getContext('2d');
        this.canvas.width = (aWidth<0 ? window.innerWidth : aWidth);
        this.canvas.height = (aHeight<0 ? window.innerHeight : aHeight);
    }

    /**
     * A Callback
     * @param aCallBack Callback function
     */
    public RegisterOnClick(aCallBack: (x_axis: number, y_axis: number) => void) {
        // register an event listener to handle click events
        this.canvas.addEventListener('click', (aEvent: MouseEvent) => {
            // when this event is handles call the local OnClick method.
            aCallBack(aEvent.x, aEvent.y);
        });
    }

    /**
     * Clears screen
     */
    public Clear() {
        // clear the screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Get the center of the canvas
     */
    public GetCenter(): {X: number, Y: number} {
        // return the center as a valid return
        return {X: this.GetWidth(), Y: this.GetHeight()};
    }

    /**
     * Get the height of the canvas
     */
    public GetHeight(): number {
        // return the height of te canvas
        return this.canvas.height;
    }

    /**
     * Get the width of the canvas
     */
    public GetWidth(): number {
        // return the height of the canvas
        return this.canvas.width;
    }

    /**
     * Get the canvas the helper uses
     */
    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Writes text to canvas
     * @param text Text to write
     * @param fontSize font size to use
     * @param aXpos x-position of text
     * @param aYpos y-position of text
     * @param color color to use
     * @param fontFamily font family to use
     * @param alignment Textalignment to use
     */
    public writeTextToCanvas(
        text: string,
        fontSize: number,
        aXpos: number,
        aYpos: number,
        color: string = "white",
        fontFamily: string = "Minecraft",
        alignment: CanvasTextAlign = "center"
    ) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = alignment;
        this.ctx.fillText(text, aXpos, aYpos);
    }

    /**
     * Puts an image on a point, centered around x and y
     * @param aSrc Source of image to use
     * @param aXpos x-position center image
     * @param aYpos y-position center image
     * @param rot rotation of image
     */
    public writeImageToCanvas(
        aSrc: string,
        aXpos: number,
        aYpos: number,
        rot: number = 0,
    ) {
        //TODO: uncomment and fix spriteMapData
        /*let image = this.spriteMapData.filter(obj => {
            return obj.name === aSrc
        })[0];
        if (!image) return null;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rot*Math.PI/180);
        if (shouldCenter)
            this.ctx.translate(-image.width/2, -image.height/2);
        this.ctx.drawImage(this.spriteMapImage, image.x, image.y, image.width, image.height, 0, 0, image.width, image.height);
        this.ctx.restore(); 
        return image;*/
        let element = new Image();
        element.addEventListener("load", () => {
            this.ctx.drawImage(element, aXpos-element.width, aYpos-element.height);
        });
        element.src = aSrc;
    }

    /**
     * Adds a button to the canvas
     * @param aCaption Caption to put on button
     * @param aXpos x-position of center button
     * @param aYpos y-position of center button
     * @param aSrc Source location of button image
     * @param callback Callback to fire when button is clicked
     */
    public writeButtonToCanvas(
        aCaption: string, 
        aXpos: number, 
        aYpos: number, 
        aSrc: string = "./assets/images/SpaceShooterRedux/PNG/UI/buttonBlue.png",
        callback: Function,
    ) {
        let buttonElement = new Image();

        buttonElement.addEventListener("load", () => {
            this.ctx.drawImage(buttonElement, aXpos - buttonElement.width/2, aYpos + buttonElement.height/2);
            this.writeTextToCanvas(aCaption, 20, aXpos, aYpos, "black");
        });

        buttonElement.src = aSrc;

        if (!callback) return;

        this.canvas.addEventListener("click", (event: MouseEvent) => {
            if (event.x > aXpos - buttonElement.width/2 && event.x < aXpos + buttonElement.width/2 + 111) {
                if (event.y > aYpos - buttonElement.height/2 && event.y < aYpos + buttonElement.height/2) {
                    callback();
                }
            }
        });
    }


}