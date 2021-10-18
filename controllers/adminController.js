const Category = require('../models/Category');
const Bank = require('../models/Bank');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard.ejs', {
            title: "Staycation | Dashboard"
        });
    },


    viewCategory: async(req, res) => {
        try {
            const category = await Category.find(); // get data user from database
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                    alertMessage,
                    alertStatus
                }
                // render data user
            res.render('admin/category/view_category.ejs', {
                category,
                alert,
                title: "Staycation | Category"
            });
        } catch (error) {
            res.redirect('/admin/category');
        }
    },

    addCategory: async(req, res) => {
        try {
            // create data dari user
            const {
                name
            } = req.body; // Get data from user
            await Category.create({
                name
            });
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category'); // redirect ke category page
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },

    editCategory: async(req, res) => {
        try {
            // search id berdasarkan input data dari user
            const {
                id,
                name
            } = req.body;
            const category = await Category.findOne({
                _id: id
            });
            category.name = name; // get data from user
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            await category.save(); // save data yang sudah diupdate user
            res.redirect('/admin/category'); // redirect kecategory page
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category'); // redirect kecategory page
        }
        // Get data id dan name from user
    },

    deleteCategory: async(req, res) => {
        try {
            // Get id from params
            const {
                id
            } = req.params;
            // Cari id data collections category db_mern20 from mongodb
            const category = await Category.findOne({
                _id: id
            });
            await category.remove(); // remove collections berdasarkan id dari params 
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category'); // redirect ke category page
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category'); // redirect ke category page
        }
    },

    viewBank: async(req, res) => {
        try {
            const bank = await Bank.find(); // get data user from database
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                alertMessage,
                alertStatus
            }
            res.render('admin/bank/view_bank.ejs', {
                bank,
                title: "Staycation | Bank",
                alert
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    addBank: async(req, res) => {
        try {
            // Get data input from user
            const {
                name,
                nameBank,
                nomorRekening,
            } = req.body;
            // passing data from user into mongodb
            await Bank.create({
                name,
                nameBank,
                nomorRekening,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    editBank: async(req, res) => {
        try {
            const {
                id,
                name,
                nameBank,
                nomorRekening
            } = req.body;
            const bank = await Bank.findOne({
                _id: id
            });
            if (req.file === undefined) {
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.imageUrl = `images/${req.file.filename}`
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    deleteBank: async(req, res) => {
        try {
            const {
                id
            } = req.params;
            const bank = await Bank.findOne({
                _id: id
            });
            await bank.remove();
            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    viewItem: (req, res) => {
        res.render('admin/item/view_item.ejs', {
            title: "Staycation | Item"
        });
    },
    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking.ejs', {
            title: "Staycation | Booking"
        });
    }
}