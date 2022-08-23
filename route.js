const express = require("express")
const router = express.Router()
const {
    CreateItem,
    GetAllItems,
    GetItem,
    UpdateItemQuantity,
    DeleteItem,
    CreateUser,
    LoginUser,
    GetUser,
    CreateCategory,
    GetCategories,
    CreateNormalTabs,
    CreateSplitProductTab,
    CreateSplitCategoryTab,
    ChangeUsername,
    ChangePassword,
    DeleteUser,
    MarkFavorite,
    UnmarkFavorite,
    GetAllFavorites,
    GetNormalProductTab,
    GetSplitProductTab,
    CreateNormalCategoryTabs,
    GetNormalCategoryTab,
    GetSplitCategoryTab
} = require('./controller')
const VerifyToken = require('./verify-token')
const VerifyRole = require('./verify-role')
const UploadMiddleware = require('./file-upload-middleware')



router.route('/loginUser').post(LoginUser)

router.route('/user').post(CreateUser).delete(VerifyToken, DeleteUser)

router.route('/getUser').get(VerifyToken, GetUser)

router.route('/update/username').post(VerifyToken, ChangeUsername)

router.route('/update/password').post(VerifyToken, ChangePassword)

router.route('/item')
.post(VerifyToken, VerifyRole('admin'), UploadMiddleware, CreateItem)
.get(GetAllItems)

router.route('/item/delete').post(VerifyToken, VerifyRole('admin'), DeleteItem)

router.route('/item/get').post(GetItem)

router.route('/update/quantity').post(VerifyToken, VerifyRole('admin'), UpdateItemQuantity)

router.route('/markFavorite').post(VerifyToken, VerifyRole('user'), MarkFavorite)

router.route('/unmarkFavorite').post(VerifyToken, VerifyRole('user'), UnmarkFavorite)

router.route('/allFavorites').get(VerifyToken, VerifyRole('user'), GetAllFavorites)

router.route('/category')
.post(VerifyToken, VerifyRole('admin'), CreateCategory)
.get(GetCategories)

router.route('/normal-product-tab').post(VerifyToken, VerifyRole('admin'), CreateNormalTabs).get(GetNormalProductTab)

router.route('/split-product-tab').post(VerifyToken, VerifyRole('admin'), CreateSplitProductTab).get(GetSplitProductTab)

router.route('/normal-category-tab').post(VerifyToken, VerifyRole('admin'), CreateNormalCategoryTabs).get(GetNormalCategoryTab)

router.route('/split-category-tab').post(VerifyToken, VerifyRole('admin'), UploadMiddleware, CreateSplitCategoryTab).get(GetSplitCategoryTab)

module.exports = router