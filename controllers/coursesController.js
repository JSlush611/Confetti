const mongoose = require("mongoose"),
    Course = require("../models/course");

module.exports = {
    show: (req, res, next) => {
        let CourseId = req.params.id;
        Course.findById(CourseId).then(course => {
            res.locals.courses = course;
            next();
        }).catch(error => {
            console.log(`Error fetching course by ID ${error.message}`);
            next(error);
        })
    },

    showView: (req, res) => {
        res.render("courses/show");
    },

    new: (req, res, next) => {
        res.render("courses/new");
    },

    create: (req, res, next) => {
        itemsArray = req.body.items.split(',').map(item => item.trim());

        let courseParams = {
            title: req.body.title,
            description: req.body.description,
            items: itemsArray,
            zipCode: req.body.zipCode
        }

        Course.create(courseParams).then(course => {
            console.log(course);
            res.locals.redirect = (`/courses`);
            res.locals.courses = course;
            next();
        }).catch(error => {
            console.log(`Error Creating Course: ${error.message}`);
            next(error);
        });
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
      },

      index: (req, res, next) => {
        Course.find({}).then(courses => {
            res.locals.courses = courses;
            next();
        }).catch(error =>{
            console.log(`Error showing courses: ${error}`);
            next(error);
        })
      },

      indexView: (req, res, next) => {
        res.render("courses/index")
      },

      delete: (req, res, next) => {
        let CourseId = req.params.id;
        Course.findByIdAndRemove(CourseId).then(() => {
            res.locals.redirect = "/courses";
            next();
        }).catch(error => {
            console.log(`Error deleting subscriber: ${error.message}`);
            next(error);
        });
      },

      edit: (req, res, next) => {
        let CourseId = req.params.id;
        Course.findById(CourseId).then(course => {
            res.render("courses/edit", {
                courses: course
            });
        }).catch(error => {
            console.log(`Error fetching course by ID: ${error.message}`);
        });
      },

      update: (req, res, next) => {
        let CourseId = req.params.id;

        courseParams = {
            title: req.body.title,
            description: req.body.description,
            items: req.body.items,
            zipCode: req.body.zipCode
        };

        Course.findByIdAndUpdate(CourseId, {
            $set: courseParams
        }).then(course => {
            res.locals.redirect = `/courses/${CourseId}`;
            res.locals.courses = course;
            next();
        }).catch(error => {
            console.log(`Error updating course by ID: ${error.message}`);
            next(error);
        });
      },

}