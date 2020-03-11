const fs = require("fs");


const jsonData = fs.readFileSync('data/input-1.json', (err, data) => {
  if(err) {
    console.log(err.message)
  } else {
    return(data);
  }
});

const data = JSON.parse(jsonData);
console.log('data.length is', data.length)
const bestOrders = bestOrder(data)
console.log('bestOrders.length is', bestOrders.length)

//write bestOrders to file as JSON
fs.writeFile('data/output-1.json', JSON.stringify(bestOrders), function (err){
  if(err) throw err;
  console.log('data is written to file')
})

function bestOrder(input){
  //function returns an array
  let result = [];
  //incoming data will be an array of objects
  //iterate through objects and destructure
  for(let e of input){
    //destructure sides, mains, money from each object
    let { sides, mains, money } = e;
    //pull values from each object, discard keys, filter out mains and sides that cost more than money
    sides = Object.values(sides).filter(side => side <= money);
    mains = Object.values(mains).filter(main => main <= money);
    //if both arrays turn up empty, push 0 to result and continue
    if(!sides.length && !mains.length){
      result.push(0);
      continue;
    } 
    //if mains has length after filter, first element in totals is mains[0], or if mains filtered is empy, just an array with a single value of 0
    mains = mains.length ? mains : [0];
    //totals will be an array we check our totals per main dish against the first index of
    let totals = [mains[0]];
    // iterate through mains with i
    for(let i = 0; i < mains.length; i++){
      let difference = money - mains[i];
      //filter sides into new array to only includes values that are less than current difference
      let curSides = sides.filter(side => side <= difference);
      //we need array to store the maxSideTotal/s, instantiated with sides[0] or [0] if filtered sides is empty
      let maxSideTotals = curSides.length ? [curSides[0]] : [0];
      //iterate through curSides with j
      for(let j = 0; j < curSides.length - 1; j++){
        //instantiate curSideTotal with the current j index of curSides
        let curSideTotal = curSides[j];
        //inner loop checks if summing two of the sides together stays under the cash limit difference,
        for(let k = j+1; k < curSides.length; k++){
          curSideTotal = curSides[j] + curSides[k];
          //if current Side Total is greater than the first index of maxSideTotals && is less than difference, 
          if(curSideTotal > maxSideTotals[0] && curSideTotal < difference){
            //we can reassign current side total to the first index of maxSideTotals
            maxSideTotals = [curSideTotal]
            //else if the values are equal, we have a duplicate, so we can have equivalent best order cost
          } else if (curSideTotal === maxSideTotals[0]){
            maxSideTotals.unshift(curSideTotal)
            //else if two sides cost the same and combining them is greater than difference, we have duplicates we can print
          } else if (curSides[k] === maxSideTotals[0] && curSideTotal > difference){
            maxSideTotals.unshift(curSides[k])
          }
        }
      } 
      //if our maxSideTotals has length, 
      if(maxSideTotals.length >= 1){
        maxSideTotals.forEach((e) => {
          let curTotal = mains[i] + e;
          // check against the sum of each and index of main, if greater than current total for e, reassign
          if(curTotal > totals[0]){
            totals = [curTotal]
          //else if current best price is the same as curTotal, we have duplicates
          } else if(curTotal === totals[0]){
            totals.unshift(curTotal)
          }
        })
      } 
    }
    //if totals has multiple values, we have duplicate bestPrices and will push them to our result as a nested array
    result.push(totals.length > 1 ? [...totals] : totals[0] )
  }
  return result;
}



