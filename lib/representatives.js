var minihash = require('../lib/minihash');

module.exports.getProcessed = function getProcessed (reps) {
  var output = [];
  for (var index = 0; index < reps.objects.length; index++) {
    var rep = reps.objects[index];
    var phone = '';
    // Only use the Constituency phone number.
    for (var office_index = 0; office_index < rep.offices.length; office_index++) {
      if (rep.offices[office_index].tel && rep.offices[office_index].type.match(/Constituency/i)) {
        phone = rep.offices[office_index].tel;
        // Only include representatives with phone numbers.
        output.push(
          {
            id: index,
            name: rep.name,
            title: rep.district_name + ' ' + rep.elected_office + ' at ' + rep.representative_set_name,
            phone: phone,
            phoneHash: minihash.hash(phone, process.env.SALT),
            email: rep.email,
            photo: rep.photo_url
          }
        );
        break;
      }
    }
  }
  return output;
};
