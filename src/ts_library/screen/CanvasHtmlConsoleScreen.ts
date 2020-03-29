import DisplayTarget from "../graphic/DisplayTarget";
import { Point2, Size2 } from "../space/Coordinate";
import { DisplayPrimitive } from "../graphic/DisplayPrimitve";
import { HtmlConsoleScreen, HtmlConsoleScreenElement } from "./HtmlConsoleScreen";

/**
 */
export class CanvasHtmlConsoleScreen extends HtmlConsoleScreen {
    private screen_mode: ScreenMode;
    private previous_display_data: string[];
    private context: CanvasRenderingContext2D;

    public constructor(unique_screen_id: string, screen_mode: ScreenMode) {
        const screen_element = new CanvasHtmlConsoleScreenElement(unique_screen_id, screen_mode);
        super(screen_element, screen_mode.size.x, screen_mode.size.y);
        this.screen_mode = screen_mode;
        this.previous_display_data = Array.from(this.display_data);

        const canvas = this.html_console_screen_element.screen_element as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get Cnavas Context');
        this.context = context;
        this.context.font = screen_mode.font_size.toString() + 'px monospace';
        this.update(true);
    }

    public attach_to_element(element: HTMLElement) {
        element.appendChild(this.html_console_screen_element.screen_element);
        element.appendChild(this.html_console_screen_element.style_element);
    }

    public update(force_update?: true) {
        const charWidth = this.screen_mode.resolution.x / this.display_size.x;
        const charHeight = this.screen_mode.resolution.y / this.display_size.y;
        this.context.fillStyle = ('#000000');
        this.context.strokeStyle = ('#ffffff');
        this.display_data.forEach((pixel, index) => {
            // not changed -> no need to draw
            if (!force_update && pixel === this.previous_display_data[index]) return;
            this.previous_display_data[index] = pixel;

            // sanitize data
            let escaped = pixel
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

            // move to drawing position
            const row = Math.floor(index / this.display_size.x);
            const col = index % this.display_size.x;
            this.context.translate(charWidth * col, charHeight * row);
            this.context.fillRect(0, 0, charWidth + 1, charHeight + 1);
            this.context.translate(charWidth / 4, charHeight * 3 / 4);
            const codepoint = escaped.codePointAt(0);
            if (codepoint !== undefined && codepoint > 0xffff) {
                // draw emojis and other 'wide' characters ... hopefully
                this.context.translate(-charWidth / 4, 0);
                this.context.scale(0.75, 0.75);
                this.context.fillText(escaped, 0, 0);
            } else {
                // draw normal characters
                this.context.strokeText(escaped, 0, 0);
            }
            this.context.resetTransform();
        });
    }

    public put(x: number, y: number, source: string) {
        if (source === '') return;
        for (const char of source) {
            x++;
            if (x >= this.display_size.x) return;
            this.set_atom({ x, y }, char);
        }
    }

    public draw(primitive: DisplayPrimitive<Point2>, custom_value: number = 0): void {
        throw new Error("Method not implemented.");
    }

    public fill(primitive: DisplayPrimitive<Point2>, custom_value: number = 0): void {
        throw new Error("Method not implemented.");
    }

    public clear(value: string = ' ') {
        for (let i = 0; i < this.display_data.length; ++i) {
            this.display_data[i] = value;
        }
    }

    public static SCREEN_MODES: Array<ScreenMode> = [
        {
            resolution: { x: 800, y: 600 }
            , size: { x: 80, y: 25 }
            , font: 'monospace'
            , font_size: 10
        },
        {
            resolution: { x: 800, y: 600 }
            , size: { x: 40, y: 20 }
            , font: 'Arial, sans-serif'
            , font_size: 20
        },

    ];
};

class CanvasHtmlConsoleScreenElement implements HtmlConsoleScreenElement {
    public readonly screen_element: HTMLElement;
    public readonly style_element: HTMLElement;
    public readonly unique_screen_id: string;

    constructor(unique_screen_id: string, screen_mode: ScreenMode) {
        this.unique_screen_id = unique_screen_id;
        this.screen_element = this.create_screen_element(screen_mode);
        this.style_element = this.create_style_element(screen_mode);
    }

    private create_screen_element(screen_mode: ScreenMode): HTMLElement {
        let canvas = document.createElement('canvas');
        canvas.id = this.unique_screen_id;
        canvas.width = screen_mode.resolution.x;
        canvas.height = screen_mode.resolution.y;
        return canvas;
    }

    private create_style_element(screen_mode: ScreenMode): HTMLStyleElement {
        let style_element = document.createElement('style');
        style_element.innerHTML = `
        #${this.unique_screen_id} {
            width: 100%;
            height: 100%;
        }
        `;
        return style_element;
    }
}

interface ScreenMode {
    resolution: Size2;
    size: Size2;
    font: string;
    font_size: number;
}
