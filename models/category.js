const { Schema, model } = require('mongoose')

const Category = new Schema({
    name : { type : String, required : true },
    items : [
        { type : Schema.Types.ObjectId, ref : 'Item' }
    ]
},
{ collection : 'category' }
)

const CategoryModel = model('Category', Category)

module.exports = CategoryModel