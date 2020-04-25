import MapObjectComponent from "./MapObjectComponent";
import { ImageID } from "../../assets/ImageResources";

export default class VisualComponent extends MapObjectComponent {
    public image: ImageID = ImageID.OTHER__ERROR;
    public icon: ImageID = ImageID.OTHER__ERROR;

    public constructor() {
        super();
    }

}