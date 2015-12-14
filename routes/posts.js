var express = require('express'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Post = require('../models/Post'),
    Comment = require('../models/comment'),
    User = require('../models/User');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}
router.get('/', needAuth ,function(req, res, next) {
  Post.find({}, function(err, docs) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    res.render('posts/index', {posts: docs});
  });
});

router.get('/new', needAuth ,function(req, res, next) {
  res.render('posts/edit', {post: {}});
});

router.post('/', needAuth ,function(req, res, next) {
  var post = new Post({
    title: req.body.title,
    category: req.body.category,
    gender: req.body.gender,
    age: req.body.age,
    content: req.body.content
  });
  post.save(function(err, doc) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    res.redirect('/posts/' + doc.id);
  });
});

router.get('/:id', needAuth , function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    Comment.find({post: post.id}, function(err, comments) {
      if (err) {
        return res.status(500).json({message: 'internal error', desc: err});
      }else if (post) {
        post.read = post.read + 1;
        post.save(function(err) { });
        res.render('posts/show', {post: post, comments: comments});
      }
    });
  });
});

router.post('/:id/comments', function(req, res, next) {
  var comment = new Comment({
    post: req.params.id,
    email: req.body.email,
    content: req.body.content
  });

  comment.save(function(err) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    Post.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return res.status(500).json({message: 'internal error', desc: err});
      }
      res.redirect('/posts/' + req.params.id);
    });
  });
});

router.get('/:id/edit', needAuth , function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    res.render('posts/edit', {post: post});
  });
});

router.put('/:id',  needAuth ,function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    if (req.body.title) {
      post.title = req.body.title;
    }
    if (req.body.category) {
      post.category = req.body.category;
    }
    if(req.body.content){
      post.content = req.body.content;
    }
    post.save(function(err){
      res.redirect('/posts/' + req.params.id);
    });
    res.redirect('back');
  });
});

router.delete('/:id', needAuth , function(req, res, next) {
  Post.findOneAndRemove(req.params.id, function(err) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    res.redirect('/posts/');
  });
});







module.exports = router;
