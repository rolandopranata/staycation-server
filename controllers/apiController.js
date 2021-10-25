const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');

module.exports = {
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
            console.log(e);
            res.status(500).json({
                message: "Internal sever error!"
            });
        }
    }
}