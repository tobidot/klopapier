import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import InventarComponent from "./components/InventarComponent";
import { Point } from "../../../ts_library/space/SimpleShapes";
import HungerComponent from "./components/HungerComponent";
import { PositionComponent } from "./components/PositionComponent";


// export default class Agent extends LivingMapObject {

//     constructor(pos: Point) {
//         super(MapObjectTypeID.PLAYER, pos, 10);
//         // this.components.add(new InventarComponent(this));
//         // this.components.add(new HungerComponent(this));
//         this.add(new PositionComponent());
//     }
// }