
/*
 * GET home page
 */
var auction = require('./auction');
var first = 0;

exports.index = function(req, res){
    res.render('homepage', { title: 'Express' });
    if(!first)
    {
        auction.onStartUp();
        first = 1;
    }
};

exports.map = function (req, res) {
    res.render('gmap_search', {title: 'MAP SEARCH'});
};
