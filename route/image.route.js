const {PERMISSION, DESCRIPTION} = require("../utils/description.utils");
const {VALIDATION, VALIDATOR} = require("../utils/validation.utils");
const {verifyToken} = require("../middleware/auth.middleware");
const {checkAvailableCompany} = require("../middleware/company.middleware");
const {Logger} = require("../middleware/log.middleware");
const {dbRequest} = require("../utils/connection.utils");
const QUERY = require("../utils/query.utils");
const {sendHandler, catchHandler} = require("../utils/handler.utils");
const {resolveError} = require("../utils/translations.utils");

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

const routes =  {
    "name": "Image",
    description: "For work with image external server.",
    "routes": [
        {
            method: "post",
            url: "/images",
            url_example: "/images",
            details: {
                ...PERMISSION(['4. Check permission to create more companies.']),
                // bodyValidation: true,
                requestBody: {
                    // id: VALIDATION.COMPANY.id.type,
                    file: 'any image type',
                },
            },
            description: DESCRIPTION.IMAGE.CREATE,
            callbacks: [
                verifyToken,
                function (req, res) {
                    const logger = new Logger(req);
                    logger.addLog(DESCRIPTION.IMAGE.CREATE)

                    try {
                        cloudinary.uploader
                            .upload("my_image.jpg")
                            .then(result => {
                                console.log(result)
                                sendHandler(res, logger)
                            });
                    } catch (err) {
                        console.log(12111, err);

                        return catchHandler(
                            {res, logger}
                        )(resolveError("IMAGE.CREATE.ERROR", req))
                    }

                }]
        }
]
};

module.exports = routes;