
export default class BetaSpecialFunction {

    constructor() { 
        this.command = new String("")
        this.command = this.command.concat (this.getHeader())
        
    }

    getCommand() {
        console.log ("Called getCommand")
        var out = this.command + String.fromCharCode(0o4)
        console.log ("Command " + out)
        return out
     }

    getHeader() {
        return String.fromCharCode(0o1) + "Z00"
    }

    ringBell() {
        this.command =   this.command + String.fromCharCode(0o2) +  "E(0" + String.fromCharCode(0o3) 
    }

    resetMemory() {
        this.command =   this.command + String.fromCharCode(0o2) + "E$" + String.fromCharCode(0o3)
    }

    setDate() {
        let today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yy = String(today.getFullYear()).substr(-2)
        this.command = this.command + String.fromCharCode(0o2) +  "E;" + mm + dd + yy  + String.fromCharCode(0o3)
    }

    setTime() {
        let today = new Date()
        var hh = String(today.getHours()).padStart(2, '0')
        var mm = String(today.getMinutes).padStart(2, '0')
        var yy = String(today.getFullYear()).substr(-2)
        this.command =   this.command + String.fromCharCode(0o2) + "E " + hh + mm + String.fromCharCode(0o3)
    }

    setDay() {
        let today = new Date()
        // Sign starts Sunday at 1
        var day = String(today.getDay() + 1)
        this.command =  this.command + String.fromCharCode(0o2) + "E&" + day  + String.fromCharCode(0o3)    
    }



  }
  