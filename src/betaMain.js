import BetaMessage, { COLOR, MODE } from "./BetaMessage"
import BetaSpecialFunction from "./BetaSpecialFunction";

console.log("This should write to the BetaBrite sign attached to /dev/tty.usbserial");
var serialPort = require('serialport');// include the library
const port = new serialPort('/dev/tty.usbserial', {
  baudRate: 9600,
  parity: 'even',
  dataBits: 7
})

port.on('open', portOpen)
port.on('error', showError)

function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

function initSign() {
  console.log ("In initSign")
  var betaSpecialFunction = new BetaSpecialFunction()
  //betaSpecialFunction.ringBell()
  betaSpecialFunction.setDate()
  betaSpecialFunction.setDay()
  betaSpecialFunction.setTime()
  port.write(betaSpecialFunction.getCommand())
  port.drain()
  var stop = new Date().getTime();
  while(new Date().getTime() < stop + 5000) {
      ;
  }
  return
}

function displayDateTime() {
  console.log ("In Dispaly Date Time")
  var betaMessage = new BetaMessage(MODE.HOLD)
  betaMessage.addColor(COLOR.GREEN)
  betaMessage.addText("Today is ")
  betaMessage.addDay()
  betaMessage.addText(" ")
  betaMessage.addDate() 
  betaMessage.addText(" ")
  betaMessage.addTime() 
  port.write(betaMessage.getMessage())
  port.drain()
  
  return
}

function displayNews() { 
  var betaMessage = new BetaMessage(MODE.HOLD)
  betaMessage.addMode(MODE.ROTATE)
  betaMessage.addColor(COLOR.GREEN)
  betaMessage.addDate()
  betaMessage.addText(" ")
  betaMessage.addColor(COLOR.RED)
  var headlines;
  const NewsAPI = require('newsapi')
  let newsapi = new NewsAPI(process.env.NEWS_API_KEY);
   newsapi.v2.topHeadlines({
    sources: 'cnbc,cbs-news',
    language: 'en',
    page: 1,
    pageSize : 12
  }).then(response => {
    var stories = response.articles;
    stories.forEach((i, idx, array) => {
      betaMessage.addColor(COLOR.RED)
      betaMessage.addText(i.title)
      betaMessage.addColor(COLOR.BROWN)
      if (idx != array.length-1) {
        betaMessage.addText(" -- ")
      }
      headlines += i.title
    })
    
    port.write(betaMessage.getMessage())
    port.drain()
  });
  return

}



function portOpen() { 
  console.log("In port Open")
  initSign()
  //displayDateTime();
  displayNews()
  




  console.log("Ok well I called init sign")
  
  /*
  */
}


function showError(error) {
  console.log ("Serial port error " + error)
}


