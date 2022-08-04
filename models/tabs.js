const { Schema, model } = require('mongoose')

const Tab = new Schema({
    tabType : { type : String, required : true },
    tabItem : { type : Object, required : true }
},
{ collection : 'tab' }
)

const TabModel = model('Tab', Tab)

module.exports = TabModel