const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { uploadSingle, uploadMultiple } = require("../middleware/multer");

router.get("/dashboard", adminController.viewDashboard);
// endpoint category
router.get("/category", adminController.viewCategory); // get data from mongodb collections category
router.post("/category", adminController.addCategory); // add data to db_mern20 collections category from  mongodb
router.put("/category", adminController.editCategory); // edit data db_mern20 collections category from mongodb
router.delete("/category/:id", adminController.deleteCategory); // delete data db_mern20 collections from mongodb
// endpoint bank
router.get("/bank", adminController.viewBank);
router.post("/bank", uploadSingle, adminController.addBank); // add data to db_mern20 collections bank from  mongodb
router.put("/bank", uploadSingle, adminController.editBank); // edit data db_mern20 collections bank from mongodb
router.delete("/bank/:id", adminController.deleteBank); // delete data db_mern20 collections from mongodb
// endpoint item
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id/delete", adminController.deleteItem);
// endpoint booking
router.get("/booking", adminController.viewBooking);

module.exports = router;