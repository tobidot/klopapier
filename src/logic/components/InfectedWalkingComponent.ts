import MapObjectComponent from "./MapObjectComponent"; import Game from "../../Game"; import WorldMap from "../map/WorldMap"; import { TerrainTypeID } from "../../assets/TerrainResources"; import MapObject from "../objects/MapObject"; import { Task } from "../tasks/Task";


export default class InfectedWalkingComponent extends MapObjectComponent {
    public static game: Game;
    public static NAME = "infected_walking";
    private map: WorldMap<TerrainTypeID>;
    private object: MapObject;

    public steps_interval_in_seconds = 1
    public time_to_next_step = 0;
    public chance_to_move = 0.5;

    public constructor(map: WorldMap<TerrainTypeID>, object: MapObject) {
        super();
        this.map = map;
        this.object = object;
    }

    public update(delta_seconds: number): Task[] {
        return [];
        // this.time_to_next_step -= delta_seconds;
        // if (this.time_to_next_step <= 0) {
        //     this.time_to_next_step += this.steps_interval_in_seconds;

        //     const daytime_p = (InfectedWalkingComponent.game.time_of_day / 24 - 0.25);
        //     const night_strength = (-Math.sin(daytime_p * Math.PI * 2) * 0.5 + 0.5);
        //     const current_chance_to_move = night_strength * night_strength * this.chance_to_move;
        //     if (Math.random() < current_chance_to_move) {
        //         const directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN].reduce(
        //             (list: Direction[], direction: Direction): Direction[] => {
        //                 const target = this.object.get_position().add(direction_to_point(direction, 1));
        //                 const field = this.map.at(target);
        //                 if (!field) return list;
        //                 if (field.terrain.variation_key === 'with_paper') return list;
        //                 if (field.objects) {
        //                     if (field.objects instanceof Wall) return list;
        //                 }
        //                 list.push(direction);
        //                 return list;
        //             }, []);
        //         const direction = get_random_of_array<Direction>(directions);
        //         if (direction !== null) {
        //             const target = this.object.get_position().add(direction_to_point(direction, 1));
        //             const field = this.map.at(target);
        //             if (field && field.objects) {
        //                 if (field.objects instanceof Agent) {
        //                     field.objects.damage({
        //                         amount: 1,
        //                         source: this.object,
        //                         type: DamageType.INFECT
        //                     })
        //                     //this.object.attack(field, DamageType.INFECT);
        //                     //this.object.destroy();
        //                     return [];
        //                 } else if (field.objects instanceof Virus === false) {
        //                     field.objects.forEach((object) => object.destroy());
        //                 }
        //             }
        //             this.object.move_to(this.map, target);
        //         }
        //     }
        // }
    }
}