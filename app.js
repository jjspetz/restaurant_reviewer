// restaurant reviewer with express

// imports
var express = require('express');
var bp = require('body-parser');
var promise = require('bluebird');
var pgp = require('pg-promise')({
  promiseLib: promise
});


/************
*   SETUP
*************/
var app = express();

var db = pgp({database: 'restaurant'});

app.set('view engine', 'hbs');

app.use(bp.urlencoded({ extended: false }));
app.use('/static/', express.static('public'));


/************
*   ROUTES
*************/
// homepage route
app.get('/', function(req, resp) {
  resp.render('homepage.hbs', {title: 'homepage'})
})

// search route (displays after user does a search)
app.get('/search', function(req, resp, next) {
  let search = req.query.search
  let query = "SELECT * FROM restaurant WHERE restaurant_name ILIKE '%$1#%'";
  db.any(query, search)
    .then(function(results) {
      resp.render('results.hbs', {
        title: 'Search Results',
        results: results
      });
    })
    .catch(next);
});

// restaurant page route
app.get('/restaurant/:id', function(req, resp, next) {
  let id = req.params.id;
  let query = "SELECT * FROM restaurant \
    JOIN review ON restaurant.id=restaurant_id \
    JOIN reviewer ON reviewer.id=reviewer_id \
    WHERE restaurant.id=$1";
  db.one(query, id)
    .then(function(results) {
      resp.render('restaurant.hbs', {
        title: results.restaurant_name,
        results: results,
        address: results.address || 'none'
      });
    })
    .catch(next);
});

// server listen
app.listen(8000, function() {
  console.log('listening on port 8000');
});
