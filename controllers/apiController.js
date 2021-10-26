const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Member = require('../models/Member');
const Booking = require('../models/Booking');

module.exports = {
    // API For Landing Page (GET Handle)
    landingPage: async(req, res) => {
        try {
            const mostPick = await Item.find() // get all data from item collections
                .select('_id title country city price unit imageId') // select data yang ingin diambil
                .limit(5) // limit data yang diambil hanya 5
                .populate({
                    path: 'imageId',
                    select: '_id imageUrl'
                }); // populate image url

            const traveler = await Traveler.find();
            const treasure = await Treasure.find();
            const city = await Item.find();
            const category = await Category.find()
                .select('_id name')
                .limit(3)
                .populate({
                    path: 'itemId',
                    select: '_id title country city isPopular imageId',
                    perDocumentLimit: 4,
                    option: {
                        sort: {
                            sumBooking: -1
                        } // sort/descending data dari besar ke kecil
                    },
                    populate: {
                        path: 'imageId',
                        select: '_id imageUrl',
                        perDocumentLimit: 1,
                    }
                });

            // Create condition for set isPopular true into itemId terbesat yaitu karena data sudah disort dari 0
            for (let i = 0; i < category.length; i++) {
                for (let x = 0; x < category[i].itemId.length; x++) {
                    const item = await Item.findOne({
                        _id: category[i].itemId[x]._id
                    });
                    item.isPopular = false;
                    await item.save();
                    if (category[i].itemId[0] === category[i].itemId[x]) {
                        item.isPopular = true;
                        await item.save();
                    }
                }
            }

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial2.jpg",
                name: "Happy Family",
                rate: 4.45,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Syafira",
                familyOccupation: "Software Engineer"
            }

            res.status(200).json({
                hero: {
                    travelers: traveler.length,
                    treasures: treasure.length,
                    cities: city.length
                },
                category,
                mostPick,
                testimonial
            }); // check status 200, data akan dikirim
        } catch (e) {
            res.status(500).json({
                message: "Internal sever error!"
            });
        }
    },

    // API For Detail Page (GET Handle)
    detailPage: async(req, res) => {
        try {
            const {
                id
            } = req.params;
            // Get data populate : feature, activity and image
            const item = await Item.findOne({
                    _id: id
                })
                .populate({
                    path: 'featureId',
                    select: '_id name qty imageUrl'
                })
                .populate({
                    path: 'activityId',
                    select: '_id name type imageUrl'
                })
                .populate({
                    path: 'imageId',
                    select: '_id imageUrl'
                });

            const bank = await Bank.find(); // get all data bank

            // Create data testimonial
            const testimonial = {
                    _id: "asd1293uasdads1",
                    imageUrl: "images/testimonial1.jpg",
                    name: "Happy Family",
                    rate: 4.45,
                    content: "What a great trip with my family and I should try again next time soon ...",
                    familyName: "Syafira",
                    familyOccupation: "Software Engineer"
                }
                // Handle if success 
            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            });
        } catch (e) {
            res.status(500).json({
                message: "Internal sever error!"
            });
        }
    },

    // API For Booking Page (POST Handle)
    bookingPage: async(req, res) => {

        // Get data from user
        const {
            idItem,
            duration,
            bookingStartDate,
            bookingEndDate,
            firstName,
            lastName,
            email,
            phoneNumber,
            accountHolder,
            bankFrom,
        } = req.body;

        // Check image when null
        if (!req.file === null) {
            return res.status(404).json({
                message: "Image Not Found"
            });
        }


        // Check all item must be filled
        if (idItem === undefined ||
            duration === undefined ||
            bookingStartDate === undefined ||
            bookingEndDate === undefined ||
            firstName === undefined ||
            lastName === undefined ||
            email === undefined ||
            phoneNumber === undefined ||
            accountHolder === undefined ||
            bankFrom === undefined) {
            res.status(404).json({
                message: "All field must be filled"
            });
        }

        // Check id item
        const item = await Item.findOne({
            _id: idItem
        });

        // Check if item undefined
        if (!item) {
            return res.status(404).json({
                message: "Item Not Found"
            });
        }

        // If item not undefined, item will be increase
        item.sumBooking += 1;

        await item.save(); // save item into the database

        let total = item.price * duration; // total 
        let tax = total * 0.10; // tax

        // handle invoice
        const invoice = Math.floor(1000000 + Math.random() * 9000000);

        // create member data
        const member = await Member.create({
            firstName,
            lastName,
            email,
            phoneNumber
        });

        // create new data when user booking
        const newBooking = {
            invoice,
            bookingStartDate,
            bookingEndDate,
            total: total += tax,
            itemId: {
                _id: item.id,
                title: item.title,
                price: item.price,
                duration: duration
            },
            memberId: member.id,
            payments: {
                proofPayment: `images/${req.file.filename}`,
                bankFrom: bankFrom,
                accountHolder: accountHolder
            }
        }

        // Handle create booking
        const booking = await Booking.create(newBooking);

        // send status when success
        res.status(201).json({
            message: "Success Booking",
            booking
        });

    }
}