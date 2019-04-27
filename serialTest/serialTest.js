console.log("This should write to the BetaBrite sign attached to /dev/tty.usbserial");
var serialport = require('serialport');// include the library
const port = new serialport('/dev/tty.usbserial', {
  baudRate: 9600,
  parity: 'even',
  dataBits: 7
})

port.on("open", function () {
    console.log('comPort is open')
    port.write(String.fromCharCode(01))
    port.write("Z00")
    port.write(String.fromCharCode(02))
    port.write("AA")
    port.write(String.fromCharCode(27) + " ")
    port.write("PWriting to BETAbrite from Node!" )
    port.write(String.fromCharCode(04))
})