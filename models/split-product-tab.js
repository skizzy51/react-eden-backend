const { Schema, model } = require('mongoose')

const SplitProductTab = new Schema({
    tab1 : {
        tabName : { type : String, required : true },
        items : [
            { type : Schema.Types.ObjectId, ref : 'Item' }
        ]
    },
    tab2 : {
        tabName : { type : String, required : true },
        items : [
            { type : Schema.Types.ObjectId, ref : 'Item' }
        ]
    }
    
},
{ collection : 'split product tab' }
)

const SplitProductModel = model('SplitProduct', SplitProductTab)

module.exports = SplitProductModel