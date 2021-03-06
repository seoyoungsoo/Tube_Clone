const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if(ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true)
  }
});

const upload = multer({storage: storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
  // 비디오를 서버에 저장
  upload(req, res, err => {
    if(err) return res.json({success: false, err})

    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename
    })
  })
})

router.post('/thumbnail', (req, res) => {
  // 썸네일을 생성하고 비디오의 정보(러닝 타임) 가져오기

  let filePath = ""
  let fileDuration = ""

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function(err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  })

  // 썸네일 생성
  ffmpeg(req.body.url)
  .on('filenames', function (filenames) {
    console.log('Will generate ' + filenames.join(', '))
    console.log(filenames)

    filePath = "uploads/thumbnails/" + filenames[0]
  })
  .on('end', function() {
    console.log('Screenshots taken');
    return res.json({
      success: true,
      url: filePath,
      fileDuration: fileDuration
    })
  })
  .on('error', function(err) {
    console.error(err);
    return res.json({
      success: false, err
    })
  })
  .screenshots({
    count: 1,
    folder: 'uploads/thumbnails',
    size: '320x240',
    //'%b': input basename (filename w/o extension)
    filename: 'thumbnail-%b.png'
  })
})

router.post('/uploadVideo', (req, res) => {
  // 비디오 정보들을 DB에 저장한다
  const video = new Video(req.body)

  video.save((err, doc) => {
    if(err) return res.json({success: false, err})

    res.status(200).json({success: true})
  })
})

router.post('/getVideoDetail', (req, res) => {
  // 랜딩 페이지의 비디오를 클릭하면
  // 비디오 디테일 페이지에서 해당 비디오의 정보를 가져온다.
  Video.findOne({"_id": req.body.videoId})
    .populate('writer')
    .exec((err, videoDetail) => {
      if(err) return res.status(400).send(err)

      return res.status(200).json({
        success: true,
        videoDetail
      })
    })
})

// get

router.get('/getVideos', (req, res) => {
  // 비디오 정보들을 DB에서 가져와 클라이언트에 보낸다
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if(err) return res.status(400).send(err)

      res.status(200).json({
        success: true,
        videos
      })
    })
})

module.exports = router;
