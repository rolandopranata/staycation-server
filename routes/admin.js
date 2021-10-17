const router = require('express').Router();
const adminController = require('../controllers/adminController')

router.get('/dashboard', adminController.viewDashboard);
router.get('/category', adminController.viewCategory); // get data from mongodb collections category
router.post('/category', adminController.addCategory); // add data to db_mern20 collections category from  mongodb
router.put('/category', adminController.editCategory); // edit data db_mern20 collections category from mongodb 
router.delete('/category/:id', adminController.deleteCategory); // delete data db_mern20 collections from mongodb 
router.get('/bank', adminController.viewBank);
router.get('/item', adminController.viewItem);
router.get('/booking', adminController.viewBooking);

module.exports = router;