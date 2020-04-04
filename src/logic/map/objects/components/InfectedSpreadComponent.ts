import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../abstract/MapObject";
import WorldMap from "../../WorldMap";
import { TerrainTypeID } from "../../../../assets/TerrainResources";
import { Direction } from "../../../../ts_library/space/Direction";
import { Point } from "../../../../ts_library/space/SimpleShapes";
import { direction_to_point } from "../../../../ts_library/conversion/fromDirection";
import { Agent } from "http";
import { DamageType } from "../../../fight/DamageType";
import { get_random_of_array } from "../../../../ts_library/utility/RandomObjects";
import Game from "../../../../Game";
import Virus from "../Virus";

export default class InfectedSpreadComponent extends MapObjectComponent {
    public static game: Game;
    public static NAME = "infected_spread";
    private map: WorldMap<TerrainTypeID>;
    private object: MapObject;

    public steps_interval_in_seconds = 1
    public time_to_next_try = 0;
    public chance_to_duplicate = 0.15;

    public constructor(map: WorldMap<TerrainTypeID>, object: MapObject) {
        super(InfectedSpreadComponent.NAME);
        this.map = map;
        this.object = object;
    }

    public update(delta_seconds: number) {
        this.time_to_next_try -= delta_seconds;
        if (this.time_to_next_try <= 0) {
            this.time_to_next_try += this.steps_interval_in_seconds;

            const daytime_p = (InfectedSpreadComponent.game.time_of_day / 24 - 0.25);
            const night_strength = (-Math.sin(daytime_p * Math.PI * 2) * 0.5 + 0.5);
            const current_chance_to_duplicate = night_strength * night_strength * this.chance_to_duplicate;
            if (Math.random() < current_chance_to_duplicate) {
                const directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN].reduce(
                    (list: Direction[], direction: Direction): Direction[] => {
                        const target = this.object.get_position().add(direction_to_point(direction, 1));
                        const field = this.map.at(target);
                        if (!field) return list;
                        if (field.terrain.variation_key === 'with_paper') return list;
                        if (!field.object) {
                            list.push(direction);
                            return list;
                        }
                        if (field.object instanceof Agent) {
                            list.push(direction);
                            return list;
                        };
                        return list;
                    }, []);
                const direction = get_random_of_array<Direction>(directions);
                if (direction !== null) {
                    const target = this.object.get_position().add(direction_to_point(direction, 1));
                    const field = this.map.at(target);
                    if (field) {
                        InfectedSpreadComponent.game.create_object(Virus, target);
                    }
                }
            }
        }
    }
}