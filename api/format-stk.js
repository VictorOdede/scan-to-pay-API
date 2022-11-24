
const formatMpesaStkObject = ({ data }) => {
    // Define local vars
    let itemArr = data.Body.stkCallback.CallbackMetadata.Item;
    let newObj = {};
    let mpesaObj;
  
    // Iterate through each array item
    itemArr.map(x => {
      // Exclude items with missing values
      if (x.Value) {
        // Create new object with 'Item name' as key and 'Item value' as value
        const element = { [x.Name]: x.Value };
  
        // Merge each new element into one object
        mpesaObj = Object.assign(newObj, element);
      }
    });
  
    return mpesaObj;
  };
  
  module.exports = {
    formatMpesaStkObject
  };