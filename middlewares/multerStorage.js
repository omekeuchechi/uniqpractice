const multer = require('multer');  
const fs = require('fs');  
const path = require('path');  

const uploadDir = 'uploads/';
// const appDir = 'appUpload/';  

// Function to delete existing avatar if necessary  
const deleteExistingAvatar = (userId) => {  
    const userAvatarDir = path.join(uploadDir, userId.toString(), 'avatar');  
    if (fs.existsSync(userAvatarDir)) {  
        const files = fs.readdirSync(userAvatarDir);  
        files.forEach(file => {  
            fs.unlinkSync(path.join(userAvatarDir, file));  
        });  
    }  
};


// const deleteExistingLogo = (settingId) => {  
//     const settingLogoDir = path.join(appDir, settingId.toString(), 'logo');  
//     if (fs.existsSync(settingLogoDir)) {  
//         const files = fs.readdirSync(settingLogoDir);  
//         files.forEach(file => {  
//             fs.unlinkSync(path.join(settingLogoDir, file));  
//         });  
//     }  
// };

exports.storage = multer.diskStorage({  
    destination: (req, file, cb) => {  
        const userId = req.decoded.userId;  
        const avatarDir = path.join(uploadDir, userId.toString(), 'avatar');  

        // Ensure top-level upload directory exists  
        if (!fs.existsSync(uploadDir)) {  
            fs.mkdirSync(uploadDir);  
        }  

        // Ensure user-specific directory exists  
        if (!fs.existsSync(path.join(uploadDir, userId.toString()))) {  
            fs.mkdirSync(path.join(uploadDir, userId.toString()));  
        }  

        // Delete existing avatar if it exists  
        if (file.fieldname === 'avatar') {  
            deleteExistingAvatar(userId);  
        }  

        // Ensure avatar directory exists  
        if (!fs.existsSync(avatarDir)) {  
            fs.mkdirSync(avatarDir);  
        }  

        cb(null, avatarDir);
        
        
    },  

    filename: (req, file, cb) => {  
        const fileExt = path.extname(file.originalname);  
        const baseFileName = path.basename(file.originalname, fileExt);  
        const fileName = `${baseFileName}${fileExt}`;  

        cb(null, fileName);  
    }  
});


exports.fileFilter = (req, file, cb) => {  
    let allowedTypes;  

    // Validate avatar field type and allowed file types

    if (file.fieldname === 'avatar') {  
        allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];  

        if (allowedTypes.includes(file.mimetype)) {  
            cb(null, true);  
        } else {  
            cb(new Error('Invalid file type. Only PNG, JPEG, and JPG are allowed.'), false);  
        }  
    } else {  
        cb(new Error('Invalid field name. Use "avatar" field for uploading an avatar.'), false);  
    }  

};