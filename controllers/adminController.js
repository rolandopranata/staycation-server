const Category = require('../model/Category');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard.ejs');
    },


    viewCategory: async(req, res) => {
        const category = await Category.find(); // get data user from database
        // render data user
        res.render('admin/category/view_category.ejs', {
            category
        });
    },

    addCategory: async(req, res) => {
        try {
            const {
                name
            } = req.body; // Get data from user
            await Category.create({
                name
            }); // create data dari user
            res.redirect('/admin/category'); // redirect ke category page
        } catch (error) {
            res.redirect('/admin/category')
        }
    },

    editCategory: async(req, res) => {
        // Get data id dan name from user
        const {
            id,
            name
        } = req.body;
        // search id berdasarkan input data dari user
        const category = await Category.findOne({
            _id: id
        });
        category.name = name; // get data from user
        await category.save(); // save data yang sudah diupdate user
        res.redirect('/admin/category'); // redirect kecategory page
    },

    deleteCategory: async(req, res) => {
        // Get id from params
        const {
            id
        } = req.params;
        // Cari id data collections category db_mern20 from mongodb
        const category = await Category.findOne({
            _id: id
        });
        await category.remove(); // remove collections berdasarkan id dari params 
        res.redirect('/admin/category'); // redirect ke category page
    },

    viewBank: (req, res) => {
        res.render('admin/bank/view_bank.ejs');
    },
    viewItem: (req, res) => {
        res.render('admin/item/view_item.ejs');
    },
    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking.ejs');
    }
}