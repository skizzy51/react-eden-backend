const { Schema, model } = require('mongoose')

const NormalCategoryTab = new Schema({
    tabName : { type : String, required : true },
    category : { type : Schema.Types.ObjectId, ref : 'Category' }
},
{ collection : 'normal category tab' }
)

const NormalCategoryModel = model('NormalCategory', NormalCategoryTab)

module.exports = NormalCategoryModel