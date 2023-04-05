const mongoose = require("mongoose"),
    Subscriber = require("../models/subscriber");

module.exports = {
    new: (req, res) => {
        res.render("subscriber/new");
      },

    create: (req, res, next) => {
        let subParams = {
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        }

        Subscriber.create(subParams).then(sub => {
            res.locals.redirect = (`/subscribers`);
            res.locals.subscribers = sub;
            next();
        }).catch(error => {
            console.log(`Error Creating Sub ${error.message}`);
            next(error);
        })
    },

    index: (req, res, next) => {
        Subscriber.find({})
          .then(subscriber => {
            res.locals.subscribers = subscriber;
              next();
          })
          .catch(error => {
            console.log(`Error fetching subscriber: ${error.message}`);
            next(error);
          });
      },

    indexView: (req, res) => {
        res.render("subscriber/index");
      },

    show: (req, res, next) => {
        let subId = req.params.id;
        Subscriber.findById(subId).then(sub => {
            res.locals.subscribers = sub;
            next();
        }).catch(error =>{
            console.log(`Error fetching sub by ID: ${error.message}`);
            next(error);
        });
      },

    showView: (req, res) => {
        res.render("subscriber/show")
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
      },

    edit: (req, res, next) => {
        let SubId = req.params.id;
        Subscriber.findById(SubId).then(sub => {
            res.render("subscriber/edit", {
                subscribers: sub
            });
        }).catch(error => {
            console.log(`Error fetching sub by ID: ${error.message}`);
        });
      },

      update: (req, res, next) => {
        let SubId = req.params.id;

        subParams = {
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        };

        Subscriber.findByIdAndUpdate(SubId, {
            $set: subParams
        }).then(subscriber => {
            res.locals.redirect = `/subscribers/${SubId}`;
            res.locals.subscriber = subscriber;
            next();
        }).catch(error => {
            console.log(`Error updating subscriber by ID: ${error.message}`);
            next(error);
        });
      },

      delete: (req, res, next) => {
        let SubId = req.params.id;
        Subscriber.findByIdAndRemove(SubId).then(() => {
            res.locals.redirect = "/subscribers";
            next();
        }).catch(error => {
            console.log(`Error deleting subscriber: ${error.message}`);
            next(error);
        });
      }


};
