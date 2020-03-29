import DisplayTarget from "../graphic/DisplayTarget";
import { Point2 } from "../space/Coordinate";
import { DisplayPrimitive } from "../graphic/DisplayPrimitve";

/**
 * This Class provides a screen target,
 * which will be displayed to a series of 'span' elements, 
 * one for each pixel, this can work for few or little changes of the screen
 * for frequent visual changes this class will drop to a framerat of about 20fps
 * but it can colorize single pixels  
 */
export abstract class HtmlConsoleScreen extends DisplayTarget<Point2, string> {
    public readonly html_console_screen_element: HtmlConsoleScreenElement;

    public constructor(html_console_screen_element: HtmlConsoleScreenElement, cols: number, rows: number) {
        super({ x: cols, y: rows });
        this.html_console_screen_element = html_console_screen_element;
    }

    public attach_to_element(element: HTMLElement) {
        element.appendChild(this.html_console_screen_element.screen_element);
        element.appendChild(this.html_console_screen_element.style_element);
    }

    public abstract update(force_update?: true): void;

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

};

export interface HtmlConsoleScreenElement {
    readonly screen_element: HTMLElement;
    readonly style_element: HTMLElement;
}