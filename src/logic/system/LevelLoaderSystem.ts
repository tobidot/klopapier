import SystemEvent from "./events/SystemEvent";
import System from "./System";
import { GameState } from "../../main/GameState";
import LoadNextLevelSystemEvent from "./events/LoadNextLevelSystemEvent";
import GameLevels from "../../main/GameLevels";
import FollowWithCameraComponent from "../components/FollowWithCameraComponent";
import CreateMap from "../map/helper/CreateMap";
import RestartLevelSystemEvent from "./events/RestartLevelSystemEvent";
import MapObject from "../objects/MapObject";

export default class LevelLoaderSystem extends System {

    private level_handler: GameLevels = new GameLevels();
    private creator_map: CreateMap = new CreateMap();
    private is_loading_level: boolean = false;

    constructor() {
        super();
    }

    public update(delta_seconds: number, game_state: GameState): GameState {
        if (!this.is_loading_level) return game_state;
        this.is_loading_level = false;
        return this.load_level(game_state);
    }

    private load_level(game_state: GameState): GameState {
        const world_map = this.creator_map.build(this.level_handler.current().map_data);
        const selected_object: MapObject | null = world_map
            .map_fields_in_rect(
                world_map.get_map_boundries(),
                field => field.objects
            )
            .flatMap(objects => objects.filter(object => object.get(FollowWithCameraComponent)))
            .reduce((selected: MapObject | null, next: MapObject) => { return (selected || next); }, null)
        if (selected_object === null) throw new Error();
        const selected = selected_object.instance_ID;

        return Object.assign(game_state, {
            time_of_day: this.level_handler.current().start_day_time,
            world_map,
            selected,
        });
    }

    public handle(event: SystemEvent) {
        if (event instanceof LoadNextLevelSystemEvent) {
            this.level_handler.next();
            this.is_loading_level = true;
        } else if (event instanceof RestartLevelSystemEvent) {
            this.is_loading_level = true;
        }
    }
}