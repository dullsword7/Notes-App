/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
    const locals = {
        title: 'NodeJs Notes',
        description: 'Free Notes App'
    }

    res.render('index.ejs', {
        locals,
        layout: '../views/layouts/front-page'
    })
}

/**
 * GET /
 * About
 */

exports.about = async (req, res) => {
    const locals = {
        title: 'About - NodeJs Notes',
        description: 'Free Notes App'
    }

    res.render('about.ejs', locals)
}
