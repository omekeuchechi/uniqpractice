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
            uploadPath = 
        }

    }
})