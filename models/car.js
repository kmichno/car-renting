const db = require('../db');

exports.bookCar = function (car_price, car_id, userId, date_from, date_to, done) {
    let numberOfDays = (new Date(date_to) - new Date(date_from))/(24*60*60*1000) + 1;
    let values = [date_from, date_to, numberOfDays*car_price, userId, car_id];
    db.get().query('INSERT INTO reservations (date_from, date_to, reservation_price, user_id, car_id) VALUES (?, ?, ?, ?, ?)', values, function (err, result) {
        if (err) return done(err);
        done(null, result.insertId);
    })
};

exports.getAll = function (date_from, date_to, done) {
    let values = [date_from, date_to, date_from, date_to];
    db.get().query('SELECT * FROM cars c WHERE NOT EXISTS (SELECT * FROM reservations r WHERE r.car_id=c.car_id and ((r.date_from >= ? and r.date_from <= ?) or (r.date_to >= ? and r.date_to <= ?)))', values, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getCar = function (car_id, done) {
    db.get().query('SELECT * FROM cars WHERE car_id= ?', car_id, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getReservations = function (user_id, done) {
    db.get().query('SELECT c.name, c.price, r.reservation_id, r.date_from, r.date_to, r.reservation_price, r.car_id FROM cars c, reservations r WHERE r.user_id = ? and c.car_id=r.car_id', user_id, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getReservation = function (user_id, reservation_id, done) {
    let values = [user_id, reservation_id];
    db.get().query('SELECT c.name, c.price, r.reservation_id, r.date_from, r.date_to, r.reservation_price, r.car_id FROM cars c, reservations r WHERE r.user_id = ? and c.car_id=r.car_id and r.reservation_id = ?', values, function (err, reservation) {
        if (err) return done(err);
        done(null, reservation['0']);
    })
};

exports.updateReservation = function (price, reservation_id, date_from, date_to, done) {
    let numberOfDays = (new Date(date_to) - new Date(date_from))/(24*60*60*1000) + 1;
    let values = [date_from, date_to, price*numberOfDays, reservation_id];
    db.get().query('UPDATE reservations SET date_from=?, date_to=?, reservation_price=? WHERE reservation_id=?', values, function (err, list) {
        if (err) return done(err);
        done(null, list['0']);
    })
};
exports.deleteReservation = function (reservation_id, done) {
    db.get().query('DELETE FROM reservations WHERE reservation_id=?', reservation_id, function (err, list) {
        if (err) return done(err);
        done(null, list['0']);
    })
};