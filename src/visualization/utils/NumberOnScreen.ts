export default function display_number_on_screen(context: CanvasRenderingContext2D) {
    return (x: number, y: number) => (printing_number: number) => {
        context.font = "32px monospace";
        context.fillStyle = "red";
        context.fillText(printing_number.toFixed(2), 20, 20);
    };
}
