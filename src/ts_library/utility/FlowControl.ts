
export async function wait_for_press_enter() {
    return new Promise((resolve, reject) => {
        let listen_for_key = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                resolve();
                document.removeEventListener('keydown', listen_for_key);
            }
        }
        document.addEventListener('keydown', listen_for_key);
    });
}
