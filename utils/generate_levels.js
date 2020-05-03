"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var jimp_1 = __importDefault(require("jimp"));
(function () {
    if (process.argv.length !== 3) {
        print_usage();
        throw new Error('Invalid Number of arguments');
    }
    var _a = __read(process.argv, 3), target_argument = _a[2];
    if (target_argument.substr(0, 1) === '-') {
        print_usage();
        return;
    }
    var file_match = target_argument.match(/^((.|..|[^./]+)(\/|$))*(([a-zA-Z0-9-_]+)(\.png))?$/m);
    console.log(file_match);
    if (!file_match || file_match.length === 0)
        throw new Error('Invalid path to folder or file : ' + target_argument);
    if (file_match.includes('.png')) {
        if (fs_1.default.existsSync(target_argument)) {
            create_map_file_for_image_file(target_argument);
        }
    }
    else {
        var _b = __read(file_match, 1), target_path = _b[0];
        var dir = fs_1.default.opendirSync(target_path);
        var entry = null;
        while (entry = dir.readSync()) {
            if (entry.isFile() && entry.name.includes('.png')) {
                create_map_file_for_image_file(target_path + entry.name);
            }
        }
        dir.closeSync();
    }
    function create_map_file_for_image_file(file_name) {
        return __awaiter(this, void 0, void 0, function () {
            function get_32int_abgr_color_from_4x8int_array(buffer) {
                return buffer.reverse().reduce(function (result, value) { return result * 0x100 + value; });
            }
            return __generator(this, function (_a) {
                return [2 /*return*/, jimp_1.default.read(file_name).then(function (image) {
                        var width = image.getWidth();
                        var height = image.getHeight();
                        var uint8_image_buffer = new Uint8Array(image.bitmap.data);
                        var image_array = [];
                        image.scan(0, 0, image.getWidth(), image.getHeight(), function (x, y, idx) {
                            var pixel = uint8_image_buffer.slice(idx, idx + 4);
                            image_array.push(get_32int_abgr_color_from_4x8int_array(pixel));
                        });
                        print_data(file_name, width, height, image_array);
                        console.log('Successfully created ' + file_name);
                    }).catch(function (err) {
                        console.error('failed to read file ' + file_name);
                        console.error(err);
                    })];
            });
        });
    }
    function print_data(file_name, width, height, data) {
        var image_name_parts = (file_name.split(/(\/|\\\\|\\)/));
        var image_name = image_name_parts.pop();
        if (!image_name)
            throw new Error('Invalid File path');
        image_name = image_name.replace('.png', '');
        var object_data = "data: [" + data.map(function (v) { return "0x" + v.toString(16); }).join(',') + "]";
        var object_width = "width: " + width.toString();
        var object_height = "height: " + height.toString();
        var file_data = "export var " + image_name + "={" + [object_width, object_height, object_data].join(',') + "};";
        var target_filename = file_name.replace('.png', '.ts');
        fs_1.default.writeFileSync(target_filename, file_data);
    }
    function print_usage() {
        console.log('generate_levels will take *.png files in a location and transpile them to level data arrays.');
        console.log('USAGE: ');
        console.log('generate_levels [target]');
        console.log('');
        console.log('target - can either be a specific PNG-File or a folder where every *.png file will be transpiled.');
    }
})();
//# sourceMappingURL=generate_levels.js.map