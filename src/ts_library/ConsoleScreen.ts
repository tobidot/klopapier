import { Rect } from "./space/SimpleShapes";

export enum ScreenMode {
    MODE_80_24_DEFAULT = 0,
    MODE_OTHER
}

export default class ConsoleScreen {
    public readonly ROWS: number;
    public readonly COLS: number;
    public readonly WIDTH: number;
    public readonly HEIGHT: number;
    public readonly MODE: ScreenMode;
    private screen: HTMLElement;
    private buffer: string[];
    private previous_buffer: string[];

    public constructor(screen: HTMLElement, mode: ScreenMode) {
        this.MODE = mode;
        this.ROWS = ConsoleScreen.MODES[mode].rows;
        this.COLS = ConsoleScreen.MODES[mode].cols;
        this.WIDTH = ConsoleScreen.MODES[mode].width;
        this.HEIGHT = ConsoleScreen.MODES[mode].height;

        const SIZE = this.ROWS * this.COLS;
        this.buffer = Array(SIZE).fill(' ', 0, SIZE + 1);
        this.previous_buffer = Array(SIZE).fill(' ', 0, SIZE + 1);

        this.screen = screen;
        this.screen.style.setProperty('font-size', ConsoleScreen.MODES[mode].font_size);
        this.screen.style.setProperty('font-family', ConsoleScreen.MODES[mode].font_family);
        this.screen.style.setProperty('letter-spacing', ConsoleScreen.MODES[mode].letter_spacing);
        this.screen.style.setProperty('height', `${this.HEIGHT}px`);
        this.screen.style.setProperty('width', `${this.WIDTH}px`);

        let style_element = document.createElement('style');
        style_element.innerText = `
        .${this.screen.className.replace(' ', '.')} span {
            display: flex;
            white-space: pre;
            width: ${this.WIDTH}px;
            height: ${ConsoleScreen.MODES[mode].line_height}px;            
        } 
        `;
        document.body.appendChild(style_element);
        this.update(true);
    }


    public update(force_update?: true) {
        if (!force_update && !this.has_buffer_changed()) return;
        const unescaped_lines_COL_chars = this.buffer.join('').match(new RegExp('.{' + this.COLS + '}', 'g'));
        if (!unescaped_lines_COL_chars) throw new Error('Screenbuffer has invalid data');
        let buffer_lines = unescaped_lines_COL_chars.map((line) => {
            let escaped = line.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
            return `<span>${escaped}</span>`;
        });
        this.screen.innerHTML = buffer_lines.join('');
    }

    public put(x: number, y: number, source: string) {
        if (x < 0 || x >= this.COLS || y < 0 || y >= this.ROWS) return;
        let i = Math.trunc(x) + Math.trunc(y) * this.COLS;
        if (typeof source !== 'string' || source === '') debugger;
        let source_array = source.split('');
        source_array.forEach((single_source_char) => {
            if (x >= this.COLS) return;
            if (this.buffer[i] !== single_source_char) {
                this.buffer[i] = single_source_char;
            }
            x++; i++;
        });
    }

    public fill(rect: Rect, char: string) {
        let line = char.repeat(rect.width());
        for (let y = rect.top; y < rect.bottom; ++y) {
            this.put(rect.left, y, line);
        }
    }

    public clear(char: string = ' ') {
        this.fill(Rect.from_boundries(0, 0, this.COLS, this.ROWS), char);
    }

    public border(rect: Rect) {
        for (let x = rect.left; x < rect.right; ++x) {
            this.put(x, rect.top, '-');
            this.put(x, rect.bottom, '-');
        }
        for (let y = rect.top; y < rect.bottom; ++y) {
            this.put(rect.left, y, '|');
            this.put(rect.right, y, '|');
        }
        this.put(rect.right, rect.top, '+');
        this.put(rect.left, rect.top, '+');
        this.put(rect.right, rect.bottom, '+');
        this.put(rect.left, rect.bottom, '+');
    }

    private has_buffer_changed(): boolean {
        let changed = false;
        this.buffer.forEach((char, i) => {
            if (this.previous_buffer[i] !== char) {
                this.previous_buffer[i] = char;
                changed = true;
            }
        });
        return changed;
    }

    private static readonly MODES: {
        [mode: number]: {
            cols: number,
            rows: number,
            width: number,
            height: number,
            line_height: number,
            letter_spacing: string,
            font_size: string,
            font_family: string,
        }
    } = {
            [ScreenMode.MODE_80_24_DEFAULT]: {
                cols: 80,
                rows: 24,
                width: 800,
                height: 600,
                line_height: 20,
                letter_spacing: '-1px',
                font_size: '20px',
                font_family: 'Inconsolata, Roboto, monospace',
            }
        };


};