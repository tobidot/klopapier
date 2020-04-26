import MapObjectComponent from "./MapObjectComponent"; import Game from "../../Game"; import WorldMap from "../map/WorldMap"; import { TerrainTypeID } from "../../assets/TerrainResources"; import MapObject from "../objects/MapObject"; import { Task } from "../tasks/Task";
import CreateObjectTask from "../tasks/CreateObjectTask";
import { GameState } from "../../main/GameState";
import { Direction } from "../../ts_library/space/Direction";
import { PositionComponent } from "./PositionComponent";
import { direction_to_point } from "../../ts_library/conversion/fromDirection";
import { get_random_of_array } from "../../ts_library/utility/RandomObjects";
import Virus from "../objects/Virus";


export default class InfectedSpreadComponent extends MapObjectComponent {
    public last_day = 0;

    public constructor() {
        super();
    }

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        if (this.last_day >= game_state.day) return [];
        this.last_day = game_state.day;
        const directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN].reduce(
            (list: Direction[], direction: Direction): Direction[] => {
                const target = position.position.add(direction_to_point(direction, 1));
                const field = game_state.world_map.at(target);
                if (!field) return list;
                if (field.objects.length > 0) return list;
                list.push(direction);
                return list;
            }, []);
        const direction = get_random_of_array<Direction>(directions);
        if (direction === null) return [];
        const target = position.position.add(direction_to_point(direction, 1));
        return [new CreateObjectTask((game_state) => new Virus(game_state), target)];
    }
}