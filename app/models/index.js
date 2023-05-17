const dbConfig = require("../config/db");
const mongoose = require("mongoose");

// mongoose.Promise = global.Promise

// const db = {}
// db.mongoose = mongoose
// db.url = dbConfig.url
// db.categories = require('./category.model')(mongoose)

// module.exports = db

module.exports = {
    mongoose,
    url: dbConfig.url,
    dpcs: require('./dpc.model')(mongoose),
    dpds: require('./dpd.model')(mongoose),
    members: require('./member.model')(mongoose),
    memberImgs: require('./memberImg.model')(mongoose),
}
