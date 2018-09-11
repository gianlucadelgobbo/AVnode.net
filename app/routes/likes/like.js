const router = require('../router')();
const User = require('../../models/User');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
    let res_send = "P";
    if (!req.user) {
        res.send({err:true,msg:__("Please login to like"), status:""});
    } else {
        if (!req.user.likes || !req.user.likes[req.query.section] || req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }).indexOf(req.query.id.toString())===-1) {
            if (!req.user.likes) req.user.likes = {};
            if (!req.user.likes[req.query.section]) req.user.likes[req.query.section] = [];
            req.user.likes[req.query.section].push({date:new Date(),id:req.query.id});
            res_send = "Liked";
        } else {
            req.user.likes[req.query.section].splice(req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }).indexOf(req.query.id.toString()),1);
            res_send = "Unliked";
        }
        User.update({_id:req.user._id},{likes:req.user.likes}, (err, raw) => {
            if (err) logger.debug(err);
            res.send({err:false,msg:"", status:res_send});
        });
    }
});

module.exports = router;
