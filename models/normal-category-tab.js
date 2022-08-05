const { Schema, model } = require('mongoose')

const NormalCategoryTab = new Schema({
    category : { type : Schema.Types.ObjectId, ref : 'Category' }
},
{ collection : 'normal category tab' }
)

const NormalCategoryModel = model('NormalCategory', NormalCategoryTab)

module.exports = NormalCategoryModel