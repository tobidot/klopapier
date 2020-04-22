import MapObjectComponent from "./MapObjectComponent"; import Game from "../../Game"; import WorldMap from "../map/WorldMap"; import { TerrainTypeID } from "../../assets/TerrainResources"; import MapObject from "../objects/MapObject"; import { Task } from "../tasks/Task";


export default class InfectedSpreadComponent extends MapObjectComponent {
    public static game: Game;
    public static NAME = "infected_spread";
    private map: WorldMap<TerrainTypeID>;
    private object: MapObject;

    public last_day = 0;

    public constructor(map: WorldMap<TerrainTypeID>, object: MapObject) {
        super(InfectedSpreadComponent.NAME);
        this.map = map;
        this.object = object;
        // this.last_day = InfectedSpreadComponent.game.day;
    }

    public update(delta_seconds: number): Task[] {
        return [];
        // if (this.last_day < InfectedSpreadComponent.game.day) {
        //     this.last_day = InfectedSpreadComponent.game.day;
        //     const directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN].reduce(
        //         (list: Direction[], direction: Direction): Direction[] => {
        //             const target = this.object.get_position().add(direction_to_point(direction, 1));
        //             const field = this.map.at(target);
        //             if (!field) return list;
        //             if (field.terrain.variation_key === 'with_paper') return list;
        //             if (!field.objects) {
        //                 list.push(direction);
        //                 return list;
        //             }
        //             if (field.objects instanceof Agent) {
        //                 list.push(direction);
        //                 return list;
        //             };
        //             return list;
        //         }, []);
        //     const direction = get_random_of_array<Direction>(directions);
        //     if (direction !== null) {
        //         const target = this.object.get_position().add(direction_to_point(direction, 1));
        //         const field = this.map.at(target);
        //         if (field) {
        //             InfectedSpreadComponent.game.create_object(Virus, target);
        //         }
        //     }
        // }
    }
}