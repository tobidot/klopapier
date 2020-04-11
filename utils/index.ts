import fs, { Dirent } from "fs";
import jimp from "jimp";

const file_name = process.argv[2];
if (!file_name) throw new Error('Invalid File path');
const file_match = file_name.match(/^.*(\/|\\)$/);
if (!file_match) throw new Error('Invalid File path');
const is_folder = (file_match.length !== 0);
if (is_folder) {
    const dir = fs.opendirSync(file_name);
    let entry: Dirent | null = null;
    while (entry = dir.readSync()) {
        if (entry.isFile() && entry.name.includes('.png')) {
            create_map_file_for_image_file(file_name + entry.name);
            console.log('Converted ' + entry.name + ' successfully');
        }
    }
    dir.closeSync();
} else {
    create_map_file_for_image_file(file_name);
}


function create_map_file_for_image_file(file_name: string) {

    jimp.read(file_name).then((image) => {

        const width = image.getWidth();
        const height = image.getHeight();
        let image_array: number[] = [];

        image.scan(0, 0, image.getWidth(), image.getHeight(), (x, y, idx) => {
            const pixel = image.bitmap.data.slice(idx, idx + 4);
            const modified_pixel_int = pixel.reverse().reduce((result, value) => result * 0x100 + value);
            image_array.push(modified_pixel_int);
        });
        print_data(file_name, width, height, image_array);
    }).catch((err) => {
        console.error('failed to read file ' + file_name);
        console.error(err);
    });

}
// png.decode(file_name, (pixels: Array<number>) => {
//     for (let i = 0; i < pixels.length; i += 4) {
//         const x = Math.floor(i / 4) % width;
//         const y = Math.floor(Math.floor(i / 4) / width);
//         const pixel = pixels.slice(i, i + 4).reverse().reduce((result, value) => result * 0x100 + value);
//         image_array.push(pixel);
//         console.log(pixels.slice(i, i + 4));
//     }
// });

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