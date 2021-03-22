const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { DisLike } = require("../models/Dislike");


//=================================
//             Like
//=================================

router.post('/getLikes', (req, res) => {

  let variable = {}

  if(req.body.videoId) {
    variable = {
      videoId: req.body.videoId
    }
  } else {
    variable = {
      commentId: req.body.commentId
    }
  }

  Like.find(variable)
    .exec((err, likes) => {
      if(err) return res.status(400).send(err)

      return res.status(200).json({
        success: true,
        likes
      })
    })

})

router.post('/getDisLikes', (req, res) => {

  let variable = {}

  if(req.body.videoId) {
    variable = {
      videoId: req.body.videoId
    }
  } else {
    variable = {
      commentId: req.body.commentId
    }
  }

  DisLike.find(variable)
    .exec((err, dislikes) => {
      if(err) return res.status(400).send(err)

      return res.status(200).json({
        success: true,
        dislikes
      })
    })

})

router.post('/upLike', (req, res) => {
  let variable = {}

  if(req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
      userId: req.body.userId
    }
  } else {
    variable = {
      commentId: req.body.commentId,
      userId: req.body.userId
    }
  }

  // Like collection에다가 클릭 정보를 넣어 준다.
  const like = new Like(variable)

  like.save((err, likeRes) => {
    if(err) return res.status(400).json({
      success: false,
      err
    })

    // 만약 Dislike이 이미 클릭 되어 있다면, Dislike를 1 줄여준다.
    DisLike.findOneAndDelete(variable)
      .exec((err, disLikeRes) => {
        if(err) return res.status(400).json({
          succes: false,
          err
        })

        return res.status(200).json({
          success: true
        })
      })
  })
})

router.post('/unLike', (req, res) => {

  let variable = {}

  if(req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
      userId: req.body.userId
    }
  } else {
    variable = {
      commentId: req.body.commentId,
      userId: req.body.userId
    }
  }

  Like.findOneAndDelete(variable)
    .exec((err, result) => {
      if(err) return res.status(400).json({
        success: false,
        err
      })

      return res.status(200).json({
        success: true
      })
    })

})

router.post('/upDisLike', (req, res) => {
  let variable = {}

  if(req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
      userId: req.body.userId
    }
  } else {
    variable = {
      commentId: req.body.commentId,
      userId: req.body.userId
    }
  }

  // DisLike collection에다가 클릭 정보를 넣어 준다.
  const dislike = new DisLike(variable)

  dislike.save((err, dislikeRes) => {
    if(err) return res.status(400).json({
      success: false,
      err
    })

    // 만약 like이 이미 클릭 되어 있다면, Dislike를 1 줄여준다.
    Like.findOneAndDelete(variable)
      .exec((err, LikeRes) => {
        if(err) return res.status(400).json({
          succes: false,
          err
        })

        return res.status(200).json({
          success: true
        })
      })
  })
})

router.post('/unDisLike', (req, res) => {

  let variable = {}

  if(req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
      userId: req.body.userId
    }
  } else {
    variable = {
      commentId: req.body.commentId,
      userId: req.body.userId
    }
  }

  DisLike.findOneAndDelete(variable)
    .exec((err, result) => {
      if(err) return res.status(400).json({
        success: false,
        err
      })

      return res.status(200).json({
        success: true
      })
    })

})
module.exports = router;
