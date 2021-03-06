
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

var sequelize = require('./db').sequelize;

//Load models
var models = require('./models')(sequelize);

//Sync the models to the database
sequelize.sync();

//Load routes
var routes = require('./routes')(app, models);

var blog = routes.blog;

var contact = routes.contact;



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// article fixtures
if('development' == app.get('env') || 'production' == app.get('env')) {
    require('./production_fixtures')(models).create();
}

app.get('/', routes.index);
app.get('/blog/', blog.index);
app.get('/blog/:id', blog.article);
app.get('/contact', contact.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
