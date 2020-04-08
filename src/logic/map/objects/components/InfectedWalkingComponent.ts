import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../abstract/MapObject";
import WorldMap from "../../WorldMap";
import { TerrainTypeID } from "../../../../assets/TerrainResources";
import { Direction } from "../../../../ts_library/space/Direction";
import { Point } from "../../../../ts_library/space/SimpleShapes";
import { direction_to_point } from "../../../../ts_library/conversion/fromDirection";
import { DamageType } from "../../../fight/DamageType";
import { get_random_of_array } from "../../../../ts_library/utility/RandomObjects";
import Game from "../../../../Game";
import Agent from "../Agent";
import Wall from "../Wall";
import Virus from "../Virus";

export default class InfectedWalkingComponent extends MapObjectComponent {
    public static game: Game;
    public static NAME = "infected_walking";
    private map: WorldMap<TerrainTypeID>;
    private object: MapObject;

    public steps_interval_in_seconds = 1
    public time_to_next_step = 0;
    public chance_to_move = 0.5;

    public constructor(map: WorldMap<TerrainTypeID>, object: MapObject) {
        super(InfectedWalkingComponent.NAME);
        this.map = map;
        this.object = object;
    }

    public update(delta_seconds: number) {
        this.time_to_next_step -= delta_seconds;
        if (this.time_to_next_step <= 0) {
            this.time_to_next_step += this.steps_interval_in_seconds;

            const daytime_p = (InfectedWalkingComponent.game.time_of_day / 24 - 0.25);
            const night_strength = (-Math.sin(daytime_p * Math.PI * 2) * 0.5 + 0.5);
            const current_chance_to_move = night_strength * night_strength * this.chance_to_move;
            if (Math.random() < current_chance_to_move) {
                const directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN].reduce(
                    (list: Direction[], direction: Direction): Direction[] => {
                        const target = this.object.get_position().add(direction_to_point(direction, 1));
                        const field = this.map.at(target);
                        if (!field) return list;
                        if (field.terrain.variation_key === 'with_paper') return list;
                        if (field.object) {
                            if (field.object instanceof Wall) return list;
                        }
                        list.push(direction);
                        return list;
                    }, []);
                const direction = get_random_of_array<Direction>(directions);
                if (direction !== null) {
                    const target = this.object.get_position().add(direction_to_point(direction, 1));
                    const field = this.map.at(target);
                    if (field && field.object) {
                        if (field.object instanceof Agent) {
                            field.object.damage({
                                amount: 1,
                                source: this.object,
                                type: DamageType.INFECT
                            })
                            //this.object.attack(field, DamageType.INFECT);
                            //this.object.destroy();
                            return [];
                        } else if (field.object instanceof Virus === false) {
                            field.object.destroy();
                        }
                    }
                    this.object.move_to(this.map, target);
                }
            }
        }
    }
}