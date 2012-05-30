var campaigns = {
  '1': {id:'1', title:'Our awesome Campaign', script:'We are so awesome! Go and make this a law!'},
  '2': {id:'2', title:'Our other awesome Campaign', script:'We are still so awesome! Go already and make this a law! GO! GO! GO!'}
}

module.exports.findAll = function (callback) {
  callback(campaigns);
}

module.exports.find = function (id, callback) {
  if (campaigns[id]) {
    callback(campaigns[id]);
  }
  else {
    callback(null);
  }
}

