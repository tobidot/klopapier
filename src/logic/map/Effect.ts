
// class Effect {
//     private position: Point;
//     private time_to_live: number;
//     private age: number;
//     private blink_interval: number;
//     private image_id: ImageID;

//     constructor(position: Point, image_id: ImageID, time_to_live: number = 2, blink_interval: number = 0.25) {
//         this.position = position;
//         this.image_id = image_id;
//         this.time_to_live = time_to_live;
//         this.blink_interval = blink_interval;
//         this.age = 0;
//     }

//     public update(dt: number) {
//         this.age += dt;
//     }

//     public is_allive() {
//         return this.age < this.time_to_live;
//     }

//     public get_image_to_display(position: Point): ImageID | null {
//         if (!position.equals(this.position)) return null;
//         if (Math.trunc(this.age / this.blink_interval) % 2 === 1) return null;
//         return this.image_id;
//     }
// }