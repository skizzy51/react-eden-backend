const { Schema, model } = require('mongoose')

const NormalProductTab = new Schema({
    tabName : { type : String, required : true },
    items : [
        { type : Schema.Types.ObjectId, ref : 'Item' }
    ]
},
{ collection : 'normal product tab' }
)

const NormalProductModel = model('NormalProduct', NormalProductTab)

module.exports = NormalProductModel