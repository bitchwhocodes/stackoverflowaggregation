




module.exports = {
  formatData: function (results) {
     var len = results.length;
     console.log(results);
     var obj = {};
    for (var i = 0; i < len; i++) {
        var item = results[i];
        var name = item.MSFTProduct;
        
        if (!obj[name]) {
                obj[name] = [];
        }
            obj[name].push(item); 
    }
    return obj;
  }
};
