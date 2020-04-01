import { Direction } from "../../ts_library/space/Direction";

export class InputDelegator {
    private element: HTMLElement;
    public on_direction_input?: (direction: Direction) => void;
    public on_attack_input?: () => void;
    public on_use_paper?: () => void;
    public on_use_spray?: () => void;
    public on_eat?: () => void;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.onkeydown = ((event: KeyboardEvent) => {
            switch (event.code) {
                case "ArrowLeft": this.on_direction_input && this.on_direction_input(Direction.LEFT); break;
                case "ArrowUp": this.on_direction_input && this.on_direction_input(Direction.UP); break;
                case "ArrowRight": this.on_direction_input && this.on_direction_input(Direction.RIGHT); break;
                case "ArrowDown": this.on_direction_input && this.on_direction_input(Direction.DOWN); break;
                case "KeyQ": this.on_use_spray && this.on_use_spray(); break;
                case "KeyW": this.on_use_paper && this.on_use_paper(); break;
                case "KeyE": this.on_eat && this.on_eat(); break;
            }
        });

        if (element === document.activeElement) this.on_focus();
        element.addEventListener('focus', this.on_focus);
        element.addEventListener('blur', this.on_blur);
    }

    private on_focus = (event?: FocusEvent) => {
        document.body.style.overflow = 'hidden';
    }

    private on_blur = (event?: FocusEvent) => {
        document.body.style.overflow = 'auto';
    }

}