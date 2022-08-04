const { Schema, model } = require('mongoose')

const Item = new Schema({
    name : { type : String, required : true },
    price : { type : Number, required : true },
    images : { type : Array },
    tags : { type : Array },
    description : { type : String },
    quantity : { type : Number, default : 0 },
    isFavorite : { type : Boolean }
},
{ collection : 'item' }
)

const ItemModel = model('Item', Item)

module.exports = ItemModel