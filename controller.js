const {
    createItem,
    getAllItems,
    getItem,
    updateItemQuantity,
    deleteItem,
    createUser,
    loginUser,
    changeUsername,
    changePassword,
    createCategory,
    getCategories,
    createNormalTabs,
    createSplitProductTab,
    createSplitCategoryTab,
    getUserById,
    deleteUser,
    markFavorite,
    unmarkFavorite,
    getAllFavorites,
    getNormalProductTab,
    getSplitProductTab,
    createNormalCategoryTabs,
    getNormalCategoryTabs,
    getSplitCategoryTab
} = require('./repository')

const fs = require('fs')
const HTTPStatus = require("http-status");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const { Cipher } = require("./constants");


function Success(res, message, data = {}) {
  res.status(HTTPStatus.OK).json({ message, data });
}
function Failure(res, code, message, data = {}) {
  res.status(code).json({ message, data });
}
function Created(res, data = {}) {
  res.status(HTTPStatus.CREATED).json({ message: "Successfully Created", data });
}

async function CreateItem (req, res, next) {
    try {
        const { name, price, tags, description } = req.body
        let images = []
        req.files.forEach(file => {
            let image = {
                fileName : file.filename,
                filePath : `https://eden-react-backend.herokuapp.com/shop/${file.filename}`,
                fileType : file.mimetype
            }
            images.push(image)
        })
        const item = await createItem(name, price, images, tags, description)
        item
        ? Created(res, item)
        : Failure(res, HTTPStatus.INTERNAL_SERVER_ERROR, 'Error creating item', item)
    } catch (error) {
        next(error)
    }
}

async function GetAllItems (req, res, next) {
    try {
        const items = await getAllItems()
        items.length > 0
        ? Success(res, 'Items', items)
        : Failure(res, HTTPStatus.NOT_FOUND, 'Items not found', items)
    } catch (error) {
        next(error)
    }
}

async function GetItem (req, res, next) {
    try {
        const {id} = req.body
        const item  = await getItem(id)
        item
        ? Success(res, 'Item', item)
        : Failure(res, HTTPStatus.NOT_FOUND, 'Item not found', item)
    } catch (error) {
        next(error)
    }
}

async function UpdateItemQuantity (req, res, next) {
    try {
        const { id, quantity } = req.body
        const update = await updateItemQuantity(id, quantity)
        update
        ? Success(res, 'Item updated')
        : Failure(res, HTTPStatus.NOT_MODIFIED, 'Update failed')
    } catch (error) {
        next(error)
    }
}

async function DeleteItem (req, res, next) {
    try {
        const {id} = req.body
        const item = await deleteItem(id)
        if (item) {
            item.images.forEach(image => {
                fs.unlink(`images/${image.fileName}`, (err)=>{
                    if (err) throw err
                })
            })
            Success(res, 'Item deleted', item)
        }else{
            Failure(res, HTTPStatus.NOT_IMPLEMENTED, 'Item not deleted', item)
        }
    } catch (error) {
        next(error)
    }
}

async function CreateUser (req, res, next) {
    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await createUser(username, hashedPassword)
        if (!user) {
            Failure(res, HTTPStatus.FAILED_DEPENDENCY, 'User not created')
            return
        }
        const token = jwt.sign({ id : user._id }, Cipher, { expiresIn : '1h' })
        res.status(HTTPStatus.CREATED).json({ message : 'User Created and signed in', token : token })
    } catch (error) {
        next(error)
    }
}

async function LoginUser (req, res, next) {
    try {
        const { username, password } = req.body
        const user = await loginUser(username)
        if (!user) {
            Failure(res, HTTPStatus.BAD_REQUEST, 'Invalid username')
            return
        }
        if (await bcrypt.compare(password, user.password)){
            const token = jwt.sign({ id : user._id }, Cipher, { expiresIn : '1h' })
            res.json({ message : 'logged in', token : token })
        }else{
            Failure(res, HTTPStatus.BAD_REQUEST, 'Invalid password')
            return
        }
    } catch (error) {
        next(error)
    }
}

async function ChangeUsername (req, res, next) {
    try {
        const user = req.user
        const newUsername = req.body.username
        const update = await changeUsername(user._id, newUsername)
        if (update == 'Username already exists') {
            return Failure(res, HTTPStatus.BAD_REQUEST, 'Username already exists')
        }
        else if (!update) {
            return Failure(res, HTTPStatus.NOT_MODIFIED, 'Error updating username')
        }
        Success(res, 'Username updated')
    } catch (error) {
        next(error)
    }
}

async function ChangePassword (req, res, next) {
    try {
        const { oldPassword, newPassword } = req.body
        const user = req.user
        if (await bcrypt.compare(oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            const update = await changePassword(user._id, hashedPassword)
            update
            ? Success(res, 'Password updated')
            : Failure(res, HTTPStatus.NOT_MODIFIED, 'Error updating password')
        }
        else{
            res.json({ message : 'Invalid Password' })
        }
    } catch (error) {
        next(error)
    }
}

async function GetUser (req, res, next) {
    try {
        const user = req.user
        const getUser = await getUserById(user._id)
        getUser
        ? res.json({ user : user })
        : res.json(null)
    } catch (error) {
        next(error)
    }
}

async function DeleteUser (req, res, next) {
    try {
        const user = req.user
        const deletedUser = await deleteUser(user._id)
        deletedUser
        ? Success(res, 'User deleted', deletedUser)
        : Failure(res, HTTPStatus.NOT_IMPLEMENTED, 'Error deleting user')
    } catch (error) {
        next(error)
    }
}

async function MarkFavorite (req, res, next) {
    try {
        const user = req.user
        const { id } = req.body
        const fav = await markFavorite(user._id, id)
        fav != 'Already marked'
        ? Success(res, 'Marked as favorite')
        : Failure(res, HTTPStatus.METHOD_NOT_ALLOWED)
    } catch (error) {
        next(error)
    }
}

async function UnmarkFavorite (req, res, next) {
    try {
        const user = req.user
        const { id } = req.body
        const fav = await unmarkFavorite(user._id, id)
        fav != 'Already unmarked'
        ? Success(res, 'Unmarked as favorite')
        : Failure(res, HTTPStatus.METHOD_NOT_ALLOWED)
    } catch (error) {
        next(error)
    }
}

async function GetAllFavorites (req, res, next) {
    try {
        const user = req.user
        const getUser = await getAllFavorites(user._id)
        getUser
        ? Success(res, 'User', getUser)
        : Failure(res, 'No user found')
    } catch (error) {
        next(error)
    }
}

async function CreateCategory (req, res, next) {
    try {
        const { name, items } = req.body
        const category = await createCategory(name, items)
        category
        ? Created(res, category)
        : Failure(res, HTTPStatus.FAILED_DEPENDENCY, 'Category not created')
    } catch (error) {
        next(error)
    }
}

async function GetCategories (req, res, next) {
    try {
        const categories = await getCategories()
        categories.length > 0
        ? Success(res, 'Categories', categories)
        : Failure(res, HTTPStatus.NOT_FOUND, 'Categories not found', categories)
    } catch (error) {
        next(error)
    }
}

async function CreateNormalTabs (req, res, next) {
    try {
        const { tabName, items } = req.body
        const tab = await createNormalTabs(tabName, items)
        tab
        ? Created(res, tab)
        : Failure(res, HTTPStatus.FAILED_DEPENDENCY, 'Tab not created')
    } catch (error) {
        next(error)
    }
}

async function GetNormalProductTab (req, res, next) {
    try {
        const tabs = await getNormalProductTab()
        tabs.length > 0
        ? Success(res, 'Tabs', tabs)
        : Failure(res, HTTPStatus.NOT_FOUND, 'Tabs not found')
    } catch (error) {
        next(error)
    }
}

async function CreateSplitProductTab (req, res, next) {
    try {
        const { tab1, tab2 } = req.body
        const tab =  await createSplitProductTab(tab1, tab2)
        tab != null
        ? Created(res, tab)
        : res.status(405).json('You cannot add more split product tabs')
    } catch (error) {
        next(error)
    }
}

async function GetSplitProductTab (req, res, next) {
    try {
        const tabs = await getSplitProductTab()
        tabs.length > 0
        ? Success(res, 'Tabs', tabs)
        : Failure(res, HTTPStatus.NOT_FOUND, 'Tabs not found')
    } catch (error) {
        next(error)
    }
}

async function CreateNormalCategoryTabs (req, res, next) {
    try {
        const { category } = req.body
        const tab = await createNormalCategoryTabs(category)
        tab
        ? Created(res, tab)
        : Failure(res, HTTPStatus.FAILED_DEPENDENCY, 'Tab not created')
    } catch (error) {
        next(error)
    }
}

async function GetNormalCategoryTab (req, res, next) {
    try {
        const tabs = await getNormalCategoryTabs()
        tabs.length > 0
        ? Success(res, 'Tabs', tabs)
        : Failure(res, HTTPStatus.NOT_FOUND, 'Tabs not found')
    } catch (error) {
        next(error)
    }
}

async function CreateSplitCategoryTab (req, res, next) {
    try {
        const { categories } = req.body
        let images = []
        req.files.forEach(file => {
            let image = {
                fileName : file.filename,
                filePath : `https://eden-react-backend.herokuapp.com/shop/${file.filename}`,
                fileType : file.mimetype
            }
            images.push(image)
        })
        const tab =  await createSplitCategoryTab(categories, images)
        tab != null
        ? Created(res, tab)
        : res.json('You cannot add more split category tabs')
    } catch (error) {
        next(error)
    }
}

async function GetSplitCategoryTab (req, res, next) {
    try {
        const tabs = await getSplitCategoryTab()
        tabs.length > 0
        ? Success(res, 'Tabs', tabs)
        : Failure(res, HTTPStatus.NOT_FOUND, 'Tabs not found')
    } catch (error) {
        next(error)
    }
}

module.exports = {
    CreateItem,
    GetAllItems,
    GetItem,
    UpdateItemQuantity,
    DeleteItem,
    CreateUser,
    LoginUser,
    ChangeUsername,
    ChangePassword,
    GetUser,
    DeleteUser,
    MarkFavorite,
    UnmarkFavorite,
    GetAllFavorites,
    CreateCategory,
    GetCategories,
    CreateNormalTabs,
    GetNormalProductTab,
    CreateSplitProductTab,
    GetSplitProductTab,
    CreateNormalCategoryTabs,
    GetNormalCategoryTab,
    CreateSplitCategoryTab,
    GetSplitCategoryTab
}