function create_timed_function(interval_in_seconds: number, callback: () => void) {
    let seconds_until_trigger = interval_in_seconds;
    return (delta_seconds: number) => {
        seconds_until_trigger -= delta_seconds;
        while (seconds_until_trigger < 0) {
            seconds_until_trigger += interval_in_seconds;
            callback();
        }
    };
}

function create_timed_boolean(interval_in_seconds: number) {
    let seconds_until_trigger = interval_in_seconds;
    return (delta_seconds: number) => {
        seconds_until_trigger -= delta_seconds;
        if (seconds_until_trigger < 0) {
            (seconds_until_trigger += interval_in_seconds);
            return true;
        }
        return false;
    };
}

function create_timed_array(interval_in_seconds: number) {
    let counter: number = 0;
    let seconds_until_trigger = interval_in_seconds;
    let array = new Array<number>();
    return (delta_seconds: number) => {
        seconds_until_trigger -= delta_seconds;
        while (seconds_until_trigger < 0) {
            seconds_until_trigger += interval_in_seconds;
            array.push(counter++);
        }
        return array;
    };
}

function create_timed_array_elements(interval_in_seconds: number) {
    let seconds_until_trigger = interval_in_seconds;
    return (delta_seconds: number) => {
        let array = new Array<number>();
        let counter: number = 0;
        seconds_until_trigger -= delta_seconds;
        while (seconds_until_trigger < 0) {
            seconds_until_trigger += interval_in_seconds;
            array.push(counter++);
        }
        return array;
    };
}