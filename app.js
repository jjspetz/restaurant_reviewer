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
  let query = "SELECT * FROM restaurant WHERE name ILIKE '%$1#%'";
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
  let query = "SELECT restaurant.id as id, restaurant.name AS restaurant, \
    reviewer.name AS reviewer, address, category, stars, title, review \
    FROM restaurant LEFT JOIN review ON restaurant.id=restaurant_id \
    LEFT JOIN reviewer ON reviewer.id=review.reviewer_id \
    WHERE restaurant.id=$1";
  db.any(query, id)
    .then(function(results) {
      resp.render('restaurant.hbs', {
        title: results[0].restaurant,
        results: results,
        address: results[0].address || 'none',
        category: results[0].category || 'none',
        id: results[0].id
      });
    })
    .catch(next);
});

// route for writing new reviews
app.post('/restaurant/:id', function(req, resp, next) {
  let id = req.params.id;
  db.query("INSERT INTO review VALUES(default, 5, $1, $2, $3, $4)", [req.body.stars, req.body.title, req.body.review, id])
    .then(function() {
      console.log('success');
    })
    .catch(next);
});

// server listen
app.listen(8000, function() {
  console.log('listening on port 8000');
});
