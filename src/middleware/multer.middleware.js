const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
   
    cb(null, origin + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })