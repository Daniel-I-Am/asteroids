abstract class ViewBase {
    private canvas: HTMLCanvasElement;
    private readonly canvasHelper: CanvasHelper;

    protected constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasHelper = new CanvasHelper();
    }

    public render(): void {
        this.canvasHelper.clear();
        this.RenderScreen();
    }

    private OnClick = (xPos: number, yPos: number) => {
        this.HandleOnClick(xPos, yPos);
    }

    protected abstract RenderScreen(): void;
    protected abstract HandleOnClick(xPos: number, yPos: number): void;
}