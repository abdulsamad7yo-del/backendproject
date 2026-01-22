import multer from 'multer';

const storage = multer.diskStorage({

    // file use given by multer
    // we define where is stored temproary
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // specify the destination directory
    },

    filename: function (req, file, cb) {
        
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // unique file name
        // console.log(file);
        
        cb(null,file.originalname); // set the file name original name as userd file name;
        
    }

});

const upload = multer({ storage: storage });

export { upload };

//--NOTE: Multer work is to just to save image on server temporary and  provide filePath, We give this path --- 