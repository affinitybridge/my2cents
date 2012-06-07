var campaigns = {
  '1': {id:'1', title:'A worthy campaign.', script:'I am calling in support of a very worthy campaign. I urge you to also put your support behind this endevour.'},
  '2': {id:'2', title:'Another worthy campaign.', script:'I cam calling in support of another worthy campaign. I urge you to also put your support behind this endevour.'}
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
