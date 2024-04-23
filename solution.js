
class RateLimitedCalculator {
  
  constructor(callsPerMin) {
    // Checks if the passed parameter is a number and if it is a positive number.
    if(typeof callsPerMin !== "number" || callsPerMin <= 0) {
      throw new Error('Failed to create an object. Reason: Call limit per minute should be at least 1.');
    }
    this.callsPerMin = callsPerMin;
    this.calledTimes = []; // stores the time of each calls.
  }

  getSum(a, b) {
    const currentTime = Date.now();
    let length = this.calledTimes.length;
    
    /*
      If the last call was more than a minute ago then the calls before that is useless to keep track of. 
      -> so, clear the calledTimes array.
    */
    if (currentTime - this.calledTimes[length - 1] >= 60000) {
      this.calledTimes = [];
      length = 0;
    }

    /*
      Here we reached reached the limit so
      -> check if a minute is over by substracting the x{limit}-th last call time from current time.
    */
    if (length >= this.callsPerMin && (currentTime - this.calledTimes[length - this.callsPerMin] < 60000)) {
      return (`Request limit reached. Please wait for ${(this.calledTimes[length - this.callsPerMin] + 60000 - currentTime) / 1000} sec.`);
    }
    
    // A valid call so we add it to the array.
    this.calledTimes.push(currentTime);

    // Checks if two parameter is number or not.
    if (typeof a !== "number" || typeof b !== "number") {
      return "Invalid input, please enter two numbers.";
    } 

    return a + b;
  }
}

const a = new RateLimitedCalculator(5);

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
  try {
    console.log(a.getSum(5, 10)); // returns 15
    console.log(a.getSum(5, 10)); // returns 15
    console.log(a.getSum(5, 10)); // returns 15
    console.log(a.getSum(5, 10)); // returns 15
    console.log(a.getSum(5, 10)); // returns 15
    console.log(a.getSum(5, 10)); // returns an error message with Time to wait.
    console.log(a.getSum(5, 10)); // returns an error message with Time to wait.
    await delay(60000);           // waits for 60 seconds.
    console.log(a.getSum(5, 10)); // returns 15
  } catch (ex) {
    console.log(ex.message);
  }
}

test(); 
