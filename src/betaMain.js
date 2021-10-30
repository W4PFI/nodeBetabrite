import BetaMessage, { COLOR, MODE } from "./BetaMessage"
import BetaSpecialFunction from "./BetaSpecialFunction";
import ys from "./yahooService";

console.log("This should write to the BetaBrite sign attached to /dev/tty.usbserial");
var serialPort = require('serialport');// include the library
const port = new serialPort('/dev/tty.usbserial', {
  baudRate: 9600,
  parity: 'even',
  dataBits: 7
})

port.on('open', portOpen)
port.on('error', showError)

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function initSign() {
  console.log('In initSign')
  var betaSpecialFunction = new BetaSpecialFunction()
  //betaSpecialFunction.ringBell()
  betaSpecialFunction.setDate()
  betaSpecialFunction.setDay()
  betaSpecialFunction.setTime()
  port.write(betaSpecialFunction.getCommand())
  port.drain()
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + 5000) {
    ;
  }
  return
}

function displayDateTime() {
  console.log('In Dispaly Date Time')
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
  console.log('In display news')
  var betaMessage = new BetaMessage(MODE.HOLD)
  betaMessage.addMode(MODE.ROTATE)
  betaMessage.addColor(COLOR.GREEN)
  betaMessage.addDate()
  betaMessage.addText(" ")
  betaMessage.addColor(COLOR.RED)
  var headlines;
  const NewsAPI = require('newsapi')
  if (process.env.NEWS_API_KEY===undefined) {
    throw new Error('Specify NEWS_API_KEY in environment')
  }
  let newsapi = new NewsAPI(process.env.NEWS_API_KEY);
  newsapi.v2.topHeadlines({
    sources: 'cnbc,cbs-news',
    language: 'en',
    page: 1,
    pageSize: 12
  }).then(response => {
    var stories = response.articles;
    stories.forEach((i, idx, array) => {
      betaMessage.addColor(COLOR.RED)
      betaMessage.addText(i.title + " ")
      betaMessage.addColor(COLOR.BROWN)
      if (idx != array.length - 1) {
        betaMessage.addText(" -- ")
      }
      headlines += i.title
    })

    port.write(betaMessage.getMessage())
    port.drain()
  });
  return

}

function displayStonks() {
    console.log('In Display Stonks')
    ys.getCurrentPrice(process.env.STONKS.split(","))
      .then((response) => {
      var betaMessage = new BetaMessage(MODE.STARS)
      betaMessage.addMode(MODE.ROTATE)
      betaMessage.addText ('Stonks! -- ')
      response.forEach((i, idx, array) => {
        console.log(i.ticker + ' ' + i.longName + ' ' + i.price)
        betaMessage.addColor(COLOR.YELLOW)

        betaMessage.addText(i.ticker)
        betaMessage.addText(' ')
        if (parseFloat(i.change) > 0) {
          betaMessage.addColor(COLOR.GREEN)
        } else {
          betaMessage.addColor(COLOR.RED)
        }
        betaMessage.addText(i.price)
        betaMessage.addText(' ')
        if (parseFloat(i.change) > 0) betaMessage.addText('+')
        betaMessage.addText(i.change)
        betaMessage.addText(' ')
        betaMessage.addText('(' + i.changePercent + '%)')
        betaMessage.addText(' ')
        if (!i.ticker.includes('^')) {
          var lowDayPrice = parseFloat(i.dayRange.split(' ')[0].replace(/,/g, ''));
          var highDayPrice = parseFloat(i.dayRange.split(' ')[2].replace(/,/g, ''));
          var low52DayPrice = parseFloat(i.fiftyTwoWeekRange.split(' ')[0].replace(/,/g, ''));
          var high52DayPrice = parseFloat(i.fiftyTwoWeekRange.split(' ')[2].replace(/,/g, ''));
        
          if (parseFloat(i.price)>=highDayPrice) betaMessage (' [DAILY HIGH] ')
          if (parseFloat(i.price)<=lowDayPrice) betaMessage (' [DAILY LOW] ')
          if (parseFloat(i.price)>=high52DayPrice) betaMessage (' [52 WEEK HIGH] ')
          if (parseFloat(i.price)<=low52DayPrice) betaMessage (' [52 WEEK LOW] ')
        }
      })

      port.write(betaMessage.getMessage())
      port.drain()
      }).catch ((error) => {
        console.log(error);
      });
  
}

function portOpen() {
  console.log('In port Open')
  initSign()
  var myArgs = process.argv.slice(2);
  
  if (myArgs.length<1) throw new Error('Specify datetime, news, or stonks in commandline')
  console.log ('Command line arguments: ' + myArgs)
  if (myArgs.includes ('datetime')) displayDateTime()
  if (myArgs.includes ('news')) displayNews()
  if (myArgs.includes ('stonks')) displayStonks()
}


function showError(error) {
  console.log('Serial port error: ' + error)
}


