const express = require("express");
const router = express.Router();
const jwt = require( 'jsonwebtoken' );
const { ensureAuth } = require("../middleware/auth");

const accessKey = process.env.CKEDITOR_ACCESS_KEY;
const environmentId = process.env.CKEDITOR_ENV_ID;



router.get( '/ckeditor', ensureAuth, ( req, res ) => {
    const payload = {
        aud: environmentId,
        sub: '#79796',
        user: {
            email: 'ogorktabi@gmail.com',
            name: 'Tabi'
        },
        "auth": {
            "ckbox": {
                "role": "admin"
            }
        }
        
    };

    const result = jwt.sign( payload, accessKey, { algorithm: 'HS256', expiresIn: '24h' } );

    res.send( result );
} );

module.exports = router;
