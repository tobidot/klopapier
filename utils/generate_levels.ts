import fs, { Dirent } from "fs";
import jimp from "jimp";
import { match } from "assert";

(function () {
    if (process.argv.length !== 3) {
        print_usage();
        throw new Error('Invalid Number of arguments');
    }
    const [, , target_argument] = process.argv;
    if (target_argument.substr(0, 1) === '-') {
        print_usage();
        return;
    }
    const file_match = target_argument.match(/^((.|..|[^./]+)(\/|$))*(([a-zA-Z0-9-_]+)(\.png))?$/m);
    console.log(file_match);
    if (!file_match || file_match.length === 0) throw new Error('Invalid path to folder or file : ' + target_argument);
    if (file_match.includes('.png')) {
        if (fs.existsSync(target_argument)) {
            create_map_file_for_image_file(target_argument);
        }
    } else {
        const [target_path] = file_match;
        const dir = fs.opendirSync(target_path);
        let entry: Dirent | null = null;
        while (entry = dir.readSync()) {
            if (entry.isFile() && entry.name.includes('.png')) {
                create_map_file_for_image_file(target_path + entry.name);
            }
        }
        dir.closeSync();
    }


    async function create_map_file_for_image_file(file_name: string) {
        return jimp.read(file_name).then((image) => {
            const width = image.getWidth();
            const height = image.getHeight();
            const uint8_image_buffer = new Uint8Array(image.bitmap.data);
            let image_array: number[] = [];

            image.scan(0, 0, image.getWidth(), image.getHeight(), (x, y, idx) => {
                const pixel = uint8_image_buffer.slice(idx, idx + 4);
                image_array.push(get_32int_abgr_color_from_4x8int_array(pixel));
            });
            print_data(file_name, width, height, image_array);
            console.log('Successfully created ' + file_name);
        }).catch((err) => {
            console.error('failed to read file ' + file_name);
            console.error(err);
        });
        function get_32int_abgr_color_from_4x8int_array(buffer: Uint8Array): number {
            return buffer.reverse().reduce((result, value) => result * 0x100 + value);
        }
    }

    function print_data(file_name: string, width: number, height: number, data: number[]) {

        const image_name_parts: string[] = (file_name.split(/(\/|\\\\|\\)/));
        let image_name = image_name_parts.pop();
        if (!image_name) throw new Error('Invalid File path');
        image_name = image_name.replace('.png', '');

        const object_data = "data: [" + data.map(v => "0x" + v.toString(16)).join(',') + "]";
        const object_width = "width: " + width.toString();
        const object_height = "height: " + height.toString();
        const file_data = "export var " + image_name + "={" + [object_width, object_height, object_data].join(',') + "};";
        const target_filename = file_name.replace('.png', '.ts');
        fs.writeFileSync(target_filename, file_data);
    }

    function print_usage() {
        console.log('generate_levels will take *.png files in a location and transpile them to level data arrays.');
        console.log('USAGE: ');
        console.log('generate_levels [target]');
        console.log('');
        console.log('target - can either be a specific PNG-File or a folder where every *.png file will be transpiled.');
    }
})();