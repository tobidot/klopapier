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

    public last_day = 0;

    public constructor(map: WorldMap<TerrainTypeID>, object: MapObject) {
        super(InfectedSpreadComponent.NAME);
        this.map = map;
        this.object = object;
        this.last_day = InfectedSpreadComponent.game.day;
    }

    public update(delta_seconds: number) {
        if (this.last_day < InfectedSpreadComponent.game.day) {
            this.last_day = InfectedSpreadComponent.game.day;
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