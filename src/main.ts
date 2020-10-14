import * as Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";

export default new Phaser.Game({
    title: "Mummy escape",
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scene: [Preloader, Game],
	scale: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    parent: 'game',
    backgroundColor: '#000000'
});