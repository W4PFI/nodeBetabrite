export const COLOR = {
    OFF: 0,
    RED: 1,
    GREEN: 2,
    AMBER: 3,
    DIM_RED: 4,
    DIM_GREEN: 5,
    BROWN: 6,
    ORANGE: 7,
    YELLOW: 8
};


export var MODE = {
    ROTATE: "a",
    HOLD: "b",
    FLASH: "c",
    DK : "nZ",
    BALLOONS : "nY",
    FIREWORKS : "nX",
    FISH : "nW",
    DONT_DRINK_DRIVE : "nV",
    NO_SMOKING : "nU",
    THANK_YOU : "nS", 
    STARS : "n7",
    WELCOME: "n8",
    SLOT: "n9"
};

export default class BetaMessage {

    constructor(mode) { 
        console.log ("In constructor ")
        this.message = new String("")
        this.message = this.message.concat (this.getHeader() + mode)
        
    }

    getMessage() {
        console.log ("Called getMessage")
        var out = this.message + String.fromCharCode(0o4)
        console.log ("Message " + out)
        return out
     }

    getHeader() {
        return String.fromCharCode(0o1) + "Z00" + String.fromCharCode(0o2) + "AA" + String.fromCharCode(27) + " " 
    }

    addMode(mode) {
        console.log ("Adding color " + mode)
        this.message = this.message.concat(String.fromCharCode(27) + " " + mode)
    }

    addColor(color) {
        console.log ("Adding color " + color)
        this.message = this.message.concat(String.fromCharCode(28) + color)
    }

    addText(text) {
        console.log ("Adding text " + text)
        this.message = this.message.concat(text)
    }


  }
  