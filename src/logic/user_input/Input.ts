import { Direction } from "../../ts_library/space/Direction";

export class InputDelegator {
    private element: HTMLElement;
    public on_direction_input?: (direction: Direction) => boolean;
    public on_attack_input?: () => void;
    public on_use_paper?: () => void;
    public on_use_spray?: () => void;
    public on_eat?: () => void;
    public on_interact?: () => void;
    public on_request_menu?: () => void;
    public game_over: boolean = false;
    public buffer_action: string = "";

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.onkeydown = ((event: KeyboardEvent) => {
            if (this.on_interact) this.on_interact();
            //if (event.repeat) return;
            if (this.game_over) return;
            if (this.try_action(event.code) === false) {
                this.buffer_action = event.code;
            } else {
                this.buffer_action = "";
            }
        });
        this.element.onclick = () => {
            if (this.on_interact) this.on_interact();
        };
        setInterval(() => {
            if (this.buffer_action !== '') {
                if (this.try_action(this.buffer_action)) this.buffer_action = "";
            }
        }, 0.1);

        if (element === document.activeElement) this.on_focus();
        element.addEventListener('focus', this.on_focus);
        element.addEventListener('blur', this.on_blur);
    }

    private try_action(action: string): boolean {
        switch (action) {
            case "ArrowLeft":
                if (this.on_direction_input) return this.on_direction_input(Direction.LEFT);
                break;
            case "ArrowUp":
                if (this.on_direction_input) return this.on_direction_input(Direction.UP);
                break;
            case "ArrowRight":
                if (this.on_direction_input) return this.on_direction_input(Direction.RIGHT);
                break;
            case "ArrowDown":
                if (this.on_direction_input) return this.on_direction_input(Direction.DOWN);
                break;
            case "KeyQ": this.on_use_spray && this.on_use_spray(); break;
            case "KeyW": this.on_use_paper && this.on_use_paper(); break;
            case "KeyE": this.on_eat && this.on_eat(); break;
            case "Escape": this.on_request_menu && this.on_request_menu(); break;
        }
        return true;
    }

    private on_focus = (event?: FocusEvent) => {
        document.body.style.overflow = 'hidden';
    }

    private on_blur = (event?: FocusEvent) => {
        document.body.style.overflow = 'auto';
    }

}