var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const B2 = require('backblaze-b2');
const os = require('os')
var multer = require('multer');
const {updateUserProfile2,updateUserProfile1,get_profile,supplierProfileUpdate,blackblaze} = require("../controllers/profile");
const {verifyToken,isAccountCheck,roleCheck,supplierRoleCheck} = require("../../middleware/auth");


// const storage = multer.diskStorage({
//   destination: function(req,file,cb){
//     cb(null,"./uploads/avatar")
//   },
//   filename : function(req,file,cb){
//     cb(null,Date.now()+file.originalname)
//   }
// })
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const blackupload = async (req, res, err) => {
  const b2 = new B2({
    applicationKeyId: '000f4e6746905c10000000002', 
    applicationKey: 'K000GYdZmBRz3CpqN1LRN50XAsfzPkw', 
});

await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
console.log("I am here");
// r = b2.getUploadPartUrl({
//   fileId: '4_zffa48e26a7c456b970550c11_f11798cb0889ac202_d20221002_m142438_c000_v0001401_t0036_u01664720678392'
//   // ...common arguments (optional)
// });
// b2.deleteFileVersion({
//   fileId: '4_zffa48e26a7c456b970550c11_f11798cb0889ac202_d20221002_m142438_c000_v0001401_t0036_u01664720678392',
//   fileName: 'fileName'
//   // ...common arguments (optional)
// });

let response = await b2.getBucket({
    bucketName: "udify-backend-key",
});

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {

//       cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//       cb(null, file.originalname);
//   },
// });

//const multerUploader = multer({});
//upload(req, res, (err) => {
  // if (err instanceof multer.MulterError) {
  //     return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
  //     // A Multer error occurred when uploading.
  // } else if (err) {
  //     // An unknown error occurred when uploading.
  //     return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
  // }

  b2.getUploadUrl({
      bucketId: 'ffa48e26a7c456b970550c11',
      // ...common arguments (optional)
  }).then((response) => {
      console.log(
          "getUploadUrl",
          response.data.uploadUrl,
          response.data.authorizationToken
      );

      b2.uploadFile({
          uploadUrl: response.data.uploadUrl,
          uploadAuthToken: response.data.authorizationToken,
          fileName: "fileName",
          //     key1: "value",
          // contentLength: 0, // optional data length, will default to data.byteLength or data.length if not provided
          //mime: "", // optional mime type, will default to 'b2/x-auto' if not provided
          data: req.file.buffer, // this is expecting a Buffer, not an encoded string
          //hash: "sha1-hash", // optional data hash, will use sha1(data) if not provided
          // info: {
          //     // optional info headers, prepended with X-Bz-Info- when sent, throws error if more than 10 keys set
          //     // valid characters should be a-z, A-Z and '-', all other characters will cause an error to be thrown
          //     key2: "value",
          // },
          onUploadProgress: (event) => {},
          //onUploadProgress: (event) => {} || null // progress monitoring
          // ...common arguments (optional)
      }).then((response) => {
          console.log("uploadFIle", response);
          return res.json({
              path: req.file.originalname,
          });
      });

      // Everything went fine and save document in DB here.
  });
//});
}
router.post("/update-user-profile1",verifyToken,updateUserProfile1);

router.post("/update-user-profile2",verifyToken,[

  check("first_name").isLength({max : 255}).notEmpty(),
  check("last_name").isLength({max : 255}).notEmpty(),
  check("company").isLength({max : 255}).notEmpty(),
  check("name").isLength({max : 255}).notEmpty(),
  check("address_street").isLength({max : 255}).notEmpty(),
  check("address_city").isLength({max : 255}).notEmpty(),
  check("address_state").isLength({max : 2}).notEmpty(),
  check("address_zip").isLength({max : 255}).notEmpty(),
  check("address_country").isLength({max : 2}).notEmpty(),
],updateUserProfile2);


router.get("/get-profile",verifyToken,get_profile);

router.post("/supplier-profile-update",verifyToken,supplierRoleCheck,supplierProfileUpdate);

router.post("/blackblaze",upload.single('file'),blackupload,blackblaze);

module.exports = router;
