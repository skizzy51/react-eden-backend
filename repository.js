const User = require('./models/user')
const Item = require('./models/item')
const Category = require('./models/category')
const NormalProductTab = require('./models/normal-product-tab')
const SplitProductTab = require('./models/split-product-tab')
const NormalCategoryTab = require('./models/normal-category-tab')
const SplitCategoryTab = require('./models/split-category-tab')


async function createItem (name, price, images = [], tags = [], description) {
    try {
        const item = new Item({name, price, images, tags, description})
        await item.save()
        return item
    } catch (error) {
        throw error
    }
}

async function getAllItems () {
    try {
        const allItems = await Item.find({})
        return allItems
    } catch (error) {
        throw error
    }
}

async function getItem (id) {
    try{
        const item = await Item.findById(id)
        return item
    } catch (error) {
        throw error
    }
}

async function updateItemQuantity (id, quantity) {
    try {
        const update = await Item.updateOne({ _id : id }, { quantity : quantity })
        return update.modifiedCount > 0
    } catch (error) {
        throw error
    }
}

async function deleteItem (id) {
    try {
        const item = await Item.findOneAndDelete({_id : id})
        return item
    } catch (error) {
        throw error
    }
}

async function createUser (username, password) {
    try {
        const user = new User({ username, password })
        const allUsers = await User.where('username').equals(username)
        if (allUsers.length > 0) {
            return null
        }
        await user.save()
        return user
    } catch (error) {
        throw error
    }
}

async function loginUser (username) {
    try {
        const user = await User.findOne({ username })
        return user
    } catch (error) {
        throw error
    }
}

async function changeUsername (id, newUsername) {
    try {
        const allUsers = await User.where('username').equals(newUsername)
        if (allUsers.length > 0) {
            return 'Username already exists'
        }
        const update = await User.updateOne({ _id : id }, { username : newUsername })
        return update.modifiedCount > 0
    } catch (error) {
        throw error
    }
}

async function changePassword (id, password) {
    try {
        const update = await User.updateOne({ _id : id }, { password : password })
        return update.modifiedCount > 0
    } catch (error) {
        throw error
    }
}

async function getUserById (id) {
    try {
        const user = await User.findById(id)
        return user
    } catch (error) {
        throw error
    }
}

async function deleteUser (id) {
    try {
        const user = await User.findOneAndDelete({_id : id})
        return user
    } catch (error) {
        throw error
    }
}

async function markFavorite (userId, itemId) {
    try {
        const check = await User.find({
            _id : userId,
            favorites : { $all : itemId }
        })
        if (check.length > 0) {
            return 'Already marked'
        }
        const userUpdate = await User.updateOne(
            { _id : userId }, 
            { $push : { favorites : itemId } }
        )

        return userUpdate
    } catch (error) {
        throw error
    }
}

async function unmarkFavorite (userId, itemId) {
    try {
        const check = await User.find({
            _id : userId,
            favorites : { $all : itemId }
        })
        if (check.length < 0) {
            return 'Already unmarked'
        }
        const userUpdate = await User.updateOne(
            {_id : userId},
            { $pull : { favorites : itemId } }
        )
        return userUpdate
    } catch (error) {
        throw error
    }
}

async function getAllFavorites (id) {
    try {
        const allFavs = await User.findById(id).populate('favorites')
        return allFavs
    } catch (error) {
        throw error
    }
}

async function createCategory (name, items = []) {
    try {
        const category = new Category({name, items})
        await category.save()
        return category
    } catch (error) {
        throw error
    }
}

async function getCategories () {
    try {
        const categories = await Category.find({}).populate('items')
        return categories
    } catch (error) {
        throw error
    }
}

async function createNormalTabs (tabName, items = []) {
    try {
        const tab = new NormalProductTab({ tabName, items })
        await tab.save()
        return tab
    } catch (error) {
        throw error
    }
}

async function getNormalProductTab () {
    try {
        const tabs = await NormalProductTab.find({}).populate('items')
        return tabs
    } catch (error) {
        throw error
    }
}

async function createSplitProductTab (tab1, tab2) {
    try {
        const tab = new SplitProductTab({ tab1, tab2 })
        const allSplitProd  = await SplitProductTab.find({})
        if (allSplitProd.length >= 2) {
            return null
        }
        await tab.save()
        return tab
    } catch (error) {
        throw error
    }
}

async function getSplitProductTab () {
    try {
        const tabs = await SplitProductTab.find({}).populate('tab1.items').populate('tab2.items')
        return tabs
    } catch (error) {
        throw error
    }
}

async function createNormalCategoryTabs (category) {
    try {
        const tab = new NormalCategoryTab({ category })
        await tab.save()
        return tab
    } catch (error) {
        throw error
    }
}

async function getNormalCategoryTabs () {
    try {
        const tabs = await NormalCategoryTab.find({}).populate('category')
        return tabs
    } catch (error) {
        throw error
    }
}

async function createSplitCategoryTab (categories, images) {
    try {
        const tab = new SplitCategoryTab({ categories, images })
        const allSplitProd  = await SplitCategoryTab.find({})
        if (allSplitProd.length >= 1) {
            return null
        }
        await tab.save()
        return tab
    } catch (error) {
        throw error
    }
}

async function getSplitCategoryTab () {
    try {
        const tabs = await SplitCategoryTab.find({}).populate('categories').populate('categories.items')
        return tabs
    } catch (error) {
        throw error
    }
}

module.exports = {
    createItem,
    getAllItems,
    getItem,
    updateItemQuantity,
    deleteItem,
    createUser,
    loginUser,
    changeUsername,
    changePassword,
    getUserById,
    deleteUser,
    markFavorite,
    unmarkFavorite,
    getAllFavorites,
    createCategory,
    getCategories,
    createNormalTabs,
    getNormalProductTab,
    createSplitProductTab,
    getSplitProductTab,
    createNormalCategoryTabs,
    getNormalCategoryTabs,
    getSplitCategoryTab,
    createSplitCategoryTab
}