const { Schema, model } = require('mongoose')

const SplitCategoryTab = new Schema({
    categories : [
        { type : Schema.Types.ObjectId, ref : 'Category' }
    ],
    images : { type : Array }
},
{ collection : 'split category tab' }
)

const SplitCategoryModel = model('SplitCategory', SplitCategoryTab)

module.exports = SplitCategoryModel