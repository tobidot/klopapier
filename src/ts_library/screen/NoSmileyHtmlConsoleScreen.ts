import DisplayTarget from "../graphic/DisplayTarget";
import { Point2 } from "../space/Coordinate";
import { DisplayPrimitive } from "../graphic/DisplayPrimitve";
import { HtmlConsoleScreen, HtmlConsoleScreenElement } from "./HtmlConsoleScreen";

/**
 * This Class provides a screen target,
 * which will be displayed to a series of 'span' elements, 
 * one for each pixel, this can work for few or little changes of the screen
 * for frequent visual changes this class will drop to a framerat of about 20fps
 * but it can colorize single pixels  
 */
export default class NoSmileysHtmlConsoleScreen extends HtmlConsoleScreen {
    private previous_display_data: string[];


    public constructor(unique_screen_id: string, cols: number, rows: number) {
        super(new NoSmileyHtmlConsoleScreenElement(unique_screen_id, cols, rows), cols, rows);
        this.previous_display_data = Array.from(this.display_data);
        this.update(true);
    }

    public attach_to_element(element: HTMLElement) {
        element.appendChild(this.html_console_screen_element.screen_element);
        element.appendChild(this.html_console_screen_element.style_element);
    }

    public update(force_update?: true) {
        const parent = this.html_console_screen_element.screen_element.parentElement;
        if (parent) parent.removeChild(this.html_console_screen_element.screen_element);
        let row_string: string[] = [];
        let row_changed = false;
        let screen_element = this.get_html_console_screen_element();
        this.display_data.forEach((pixel, index) => {
            const row = Math.floor(index / this.display_size.x);
            const col = index % this.display_size.x;
            if (col === 0) {
                if (row > 0 && row_changed) screen_element.pixel_elements[row - 1].innerText = row_string.join('');
                row_string = [...screen_element.pixel_elements[row].innerText];
                row_changed = false;
            }
            if (!force_update && pixel === this.previous_display_data[index]) return;
            this.previous_display_data[index] = pixel;
            let escaped = pixel.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
            if (row_string[col] !== escaped) {
                row_string[col] = escaped;
                row_changed = true;
            }
        });
        if (parent) parent.appendChild(this.html_console_screen_element.screen_element);
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

    public get_html_console_screen_element(): NoSmileyHtmlConsoleScreenElement {
        return this.html_console_screen_element as NoSmileyHtmlConsoleScreenElement;
    }

};

class NoSmileyHtmlConsoleScreenElement implements HtmlConsoleScreenElement {
    public readonly screen_element: HTMLElement;
    public readonly pixel_elements: Array<HTMLElement>;
    public readonly style_element: HTMLElement;
    public readonly unique_screen_id: string;

    constructor(unique_screen_id: string, cols: number, rows: number) {
        this.pixel_elements = new Array(rows);
        this.unique_screen_id = unique_screen_id;
        this.screen_element = this.create_screen_element(cols, rows);
        this.style_element = this.create_style_element(cols, rows);
    }

    private create_screen_element(cols: number, rows: number): HTMLElement {
        let screen = document.createElement('div');
        screen.id = this.unique_screen_id;
        for (let y = 0; y < rows; ++y) {
            let pixel_row_element = document.createElement('span');
            pixel_row_element.innerText = '.'.repeat(cols);
            this.pixel_elements[y] = (pixel_row_element);
            screen.appendChild(pixel_row_element);
        }
        return screen;
    }

    private create_style_element(cols: number, rows: number): HTMLStyleElement {
        let style_element = document.createElement('style');
        style_element.innerText = `
        #${this.unique_screen_id} {
            position: relative;
            display: grid;
            width: 100%;
            height: 100%;

            font-family: monospace;
            font-size: 16px;
            background: black;


            /* grid-template-columns: repeat(${cols}, 1fr); */
            grid-template-rows: repeat(${rows}, 1fr);
        }
        #${this.unique_screen_id} > span {
            display: flex;
            width: 100%;
            height: 100%;
            overflow: hidden;

            background: gray;
            
            justify-content: center;
            align-items: center;
        } 
        `;
        return style_element;
    }
}