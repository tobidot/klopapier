import MapObjectComponent from "./MapObjectComponent"; import Game from "../../Game"; import WorldMap from "../map/WorldMap"; import { TerrainTypeID } from "../../assets/TerrainResources"; import MapObject from "../objects/MapObject"; import { Task } from "../tasks/Task";
import { GameState } from "../../main/GameState";
import { direction_to_point } from "../../ts_library/conversion/fromDirection";
import Wall from "../objects/Wall";
import { get_random_of_array } from "../../ts_library/utility/RandomObjects";
import { Agent } from "http";
import Virus from "../objects/Virus";
import { PositionComponent } from "./PositionComponent";
import { MoveObjectTask } from "../tasks/MoveObjectTask";
import { Direction } from "../../ts_library/space/Direction";


export default class InfectedWalkingComponent extends MapObjectComponent {
    public static game: Game;
    public static NAME = "infected_walking";

    public steps_interval_in_seconds = 1
    public time_to_next_step = 0;
    public chance_to_move = 0.5;

    public constructor() {
        super();
    }

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        // Check only in certain intervalls
        this.time_to_next_step -= delta_seconds;
        if (this.time_to_next_step > 0) return [];
        this.time_to_next_step += this.steps_interval_in_seconds;
        // With a random chance
        const daytime_p = (game_state.time_of_day / 24 - 0.25);
        const night_strength = (-Math.sin(daytime_p * Math.PI * 2) * 0.5 + 0.5);
        const current_chance_to_move = night_strength * night_strength * this.chance_to_move;
        if (Math.random() >= current_chance_to_move) return [];
        // determin valid neighbour fields
        const position = self.get(PositionComponent);
        if (!position) return [];
        const directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN].reduce(
            (list: Direction[], direction: Direction): Direction[] => {
                const target = position.position.add(direction_to_point(direction, 1));
                const field = game_state.world_map.at(target);
                if (!field) return list;
                const is_colliding = (field.objects.reduce((is_colliding, other): boolean => {
                    const other_position = other.get(PositionComponent);
                    if (!other_position) return true;
                    return is_colliding && 0 === (position.collision_mask & other_position.collision_group);
                }, false));
                if (is_colliding) return list;
                list.push(direction);
                return list;
            }, []);
        // pick a random direction
        const direction = get_random_of_array<Direction>(directions);
        if (direction === null) return [];
        const target = position.position.add(direction_to_point(direction, 1));
        const field = game_state.world_map.at(target);
        if (!field) return [];
        return [new MoveObjectTask(position.position, target, self.instance_ID)];
    }
}