// import MapObject from "./MapObject";
// import { MapObjectTypeID } from "../../../../assets/MapObjectResources";
// import { Point } from "../../../../ts_library/space/SimpleShapes";
// import InventarComponent from "../components/InventarComponent";

// export default class CollectableMapObject extends MapObject {
//     public readonly collectable: string | number;

//     constructor(type: MapObjectTypeID, position: Point, collectable: string | number) {
//         super(type, position);
//         this.collectable = collectable;
//     }

//     public is_money(): boolean {
//         return typeof (this.collectable) === 'number';
//     }

//     public touched_by(other: MapObject): this {
//         const inventar = other.components.get(InventarComponent);
//         if (inventar && inventar.items.length < inventar.size) {
//             if (typeof this.collectable === 'number') {
//                 inventar.money += this.collectable;
//                 this.destroy();
//             } else {
//                 if (inventar.items.length < inventar.size) {
//                     inventar.items.push(this.collectable);
//                     this.destroy();
//                 }
//             }
//         }
//         return this;
//     }
// }