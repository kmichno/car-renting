const express = require('express');

const car = require('../models/car');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('lists');
});

router.get('/cars', ensureAuthenticated, (req, res) => {
    let dateFrom = req.query.dateFrom;
    let dateTo = req.query.dateTo;
    let numberOfDays = (new Date(dateTo) - new Date(dateFrom))/(24*60*60*1000) + 1;
    car.getAll(dateFrom, dateTo, function (err, rows) {
        if (err) {
            res.send("Something went wrong.")
        } else {
            res.render('lists', {rows, numberOfDays, dateFrom, dateTo});
        }
    })
});

router.get('/reservations', ensureAuthenticated, (req, res) => {
    car.getReservations(req.user.user_id, function (err, rows) {
        if (err) {
            res.send("Something went wrong.")
        } else {
            res.render('reservations', {rows});
        }
    })
});

router.get('/reservation/:reservationId', ensureAuthenticated, (req, res) => {
    let reservation_id = req.params.reservationId;
    car.getReservation(req.user.user_id, reservation_id, function (err, reservation) {
        if (err) {
            res.send("Something went wrong.")
        } else {
            res.render('reservation', {reservation});
        }
    })
});

router.get('/reservation/modify/:reservationId/:price', ensureAuthenticated, (req, res) => {
    let reservation_id = req.params.reservationId;
    let price = req.params.price;
    let dateFrom = req.query.dateFrom;
    let dateTo = req.query.dateTo;
    car.updateReservation(price, reservation_id, dateFrom, dateTo, function (err, reservation) {
        if (err) {
            res.send("Something went wrong.")
        } else {
            res.redirect('/lists/reservation/'+reservation_id);
        }
    })
});

router.get('/reservation/delete/:reservationId', ensureAuthenticated, (req, res) => {
    let reservation_id = req.params.reservationId;
    car.deleteReservation(reservation_id, function (err, reservation) {
        if (err) {
            res.send("Something went wrong.")
        } else {
            res.redirect('/lists/reservations');
        }
    })
});

router.post('/bookCar/:carId/:price/:dateFrom/:dateTo', ensureAuthenticated, (req, res) => {
    let carId = req.params.carId;
    let dateFrom= req.params.dateFrom;
    let dateTo = req.params.dateTo;
    let car_price = req.params.price;
    car.bookCar(car_price, carId, 1, dateFrom, dateTo, function (err) {
        if (err) {
            res.send("Something gone wrong");
        } else {
            res.redirect('/lists');
        }
    })
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;