const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        const userId = req.decoded.userId;
        let uploadPath;
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // upload

        if (fs.existsSync(uploadDir)){
            uploadPath = `${uploadDir}${userId}`;
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
        }

        if (fs.existsSync(uploadPath) && file.fieldname == 'avater') {
            uploadPath = `${uploadPath}/avater`;
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            } else if (fs.existsSync(uploadPath) && file.fieldname == 'files') {
                uploadPath = `${uploadPath}/files`;
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath);
                }
            }


            cb(null, uploadPath);

        }

    },

    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const spliteFileName = file.originalname.split('.');
        const fileName = spliteFileName.split(' ')[0] + fileExt;

        cb(null, fileName);
    }
 });

 exports.fileFilter = (req, file, cb) => {
    let allowedTypes;

    if (file.fieldname == 'avater') {
        allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else{
            cb(new Error('Invalid file type. Only PNG, JPEG, and JPG are allowed.'), false);
        }
    }
 }