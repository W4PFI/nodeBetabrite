import BetaMessage, { COLOR, MODE } from "./BetaMessage"
console.log("This should write to the BetaBrite sign attached to /dev/tty.usbserial");
var serialport = require('serialport');// include the library
const port = new serialport('/dev/tty.usbserial', {
  baudRate: 9600,
  parity: 'even',
  dataBits: 7
})

port.on("open", function () {
    var betaMessage = new BetaMessage(MODE.FIREWORKS)
    betaMessage.addMode(MODE.ROTATE)
    betaMessage.addColor(COLOR.RED)
    betaMessage.addText("A test message!")
    port.write(betaMessage.getMessage())
})


