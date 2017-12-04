var mongoose = require('mongoose');

mongoose.Promise = global.Promise;


//mongoose.connect('mongodb://localhost:27017/Synergy');
mongoose.connect("mongodb://first:123456@ds259305.mlab.com:59305/synergy_proposal_submit");

module.exports = {mongoose};