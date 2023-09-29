const Note = require('../models/Notes');
const mongoose = require('mongoose');

/**
 * GET /
 * Dashboard
 */

// exports.dashboard = async (req, res) => {
//     const locals = {
//         title: 'Dashboard',
//         description: 'Free Notes App'
//     }

//     res.render('dashboard/index.ejs', {
//         userName: req.user.firstName,
//         locals,
//         layout: '../views/layouts/dashboard'
//     })
// }
exports.dashboard = async (req, res) => {

  let perPage = 12;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };

  try {
    // Mongoose "^7.0.0 Update
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Note.count();

    res.render('dashboard/index', {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage)
    });
   } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * View Specific Note
 */

exports.dashboardViewNote= async(req, res) => {
  const note = await Note.findById({ _id: req.params.id }).where({ user: req.user.id }).lean();

  if (note) {
    res.render('dashboard/view-note', {
      noteID: req.params.id,
      note,
      layout: '../views/layout/dashboard'
    });
  } else {
    res.send('Something went wrong');
  }
}

/**
 * PUT /
 * Update Specific Note
 */

exports.dashboardUpdateNote= async(req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body }
    ).where( { user: req.user.id } );
    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
  }
}

/**
 * DELETE /
 * Delete Note
 */

exports.dashboardDeleteNote = async(req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id});
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
}
