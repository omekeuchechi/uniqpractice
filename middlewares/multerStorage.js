const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        const userId = req.decoded ? req.decoded.userId : null; // Check if req.decoded exists
        let uploadPath;

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        if (fs.existsSync(uploadDir)) {
            uploadPath = `${uploadDir}${userId}`;
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
        }

        if (fs.existsSync(uploadPath) && file.fieldname === 'avatar') {
            uploadPath = `${uploadPath}/avatar`;
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            } else if (fs.existsSync(uploadPath) && file.fieldname === 'files') {
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
        const splitFileName = file.originalname.split('.');
        const fileName = splitFileName.slice(0, 1).join('') + fileExt; // Use slice(0, 1) instead of split(' ')

        cb(null, fileName);
    }
});

exports.fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPEG, and JPG are allowed.'), false);
    }
};