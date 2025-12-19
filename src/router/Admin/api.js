import express from 'express';
import { getUser, updateUser, upload } from '../../controllers/Admin/userController.js';
import { createCountry, deleteCountry, updateCountry } from '../../controllers/Admin/countryController.js';
import {
    getProduct,
    createProduct,
    upload as uploadProduct,
    deleteProduct,
    updateProduct,
    deleteMany,
    trash,
    countTrashProduct,
    restore,
    forceDelete,
    getDashboardOverview,
    revenueChart,
    getTopProducts,
} from '../../controllers/Admin/productController.js';
import { confirmOrder, getAllOrders } from '../../controllers/Member/historyController.js';
import { createBrand, deleteBrand, getBrand, updateBrand } from '../../controllers/Admin/brandController.js';
import {
    createCategory,
    deleteCategory,
    getCategory,
    updateCategory,
} from '../../controllers/Admin/categoryController.js';
import { requireAuth, authorize } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth, authorize(1));

router.get('/dashboard/overview', getDashboardOverview);
router.get('/dashboard/chart', revenueChart);
router.get('/dashboard/top-product', getTopProducts);

router.get('/brand', getBrand);
router.post('/brand', createBrand);
router.delete('/brand/delete/:id', deleteBrand);
router.put('/brand/update/:id', updateBrand);
router.get('/category', getCategory);
router.post('/category', createCategory);
router.delete('/category/delete/:id', deleteCategory);
router.put('/category/update/:id', updateCategory);

router.get('/product', getProduct);
router.post('/product', uploadProduct, createProduct);
router.delete('/product/delete/:id', deleteProduct);
router.delete('/product/delete-many', deleteMany);
router.put('/product/update/:id', uploadProduct, updateProduct);

router.get('/trash-product', trash);
router.get('/trash-product/count', countTrashProduct);
router.patch('/trash-product/restore/:id', restore);
router.delete('/trash-product/force-delete/:id', forceDelete);

router.put('/order/:id/confirm', confirmOrder);
router.get('/orders', getAllOrders);

router.put('/user/:id', upload, updateUser);
router.get('/user/:id', getUser);

router.post('/country', createCountry);
router.delete('/country/:id', deleteCountry);
router.put('/country/:id', updateCountry);

export default router;
