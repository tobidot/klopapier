import { default as SelfPlayingRPGGame } from "./Game";

let element = document.getElementsByClassName('screen__app').item(0);
if (!(element instanceof HTMLElement)) throw new Error('No');
(new SelfPlayingRPGGame(element)).start();