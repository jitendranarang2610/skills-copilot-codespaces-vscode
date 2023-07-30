// Create web server
// Start web server
// Create router
// Create routes
// Start router
// Start web server

// Import modules
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');

// Connect to database
mongoose.connect('mongodb://localhost/comments');

// Create web server
var app = express();

// Start web server
var server = http.createServer(app);

// Create router
var router = express.Router();

// Create routes
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the comments api!' });
});

router.route('/comments')
    .post(function(req, res) {
        var comment = new Comment();
        comment.name = req.body.name;
        comment.text = req.body.text;
        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment created!' });
        });
    })
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });

router.route('/comments/:comment_id')
    .get(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json(comment);
        });
    })
    .put(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            comment.name = req.body.name;
            comment.text = req.body.text;
            comment.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Comment updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Comment.remove({
            _id: req.params.comment_id
        }, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    });

// Start router
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

// Start web server
server.listen(3000, function() {
    console.log('Listening on port 3000');