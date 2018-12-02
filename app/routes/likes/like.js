const router = require('../router')();
const mongoose = require('mongoose');

const User = mongoose.model('User');

const Event = mongoose.model('Event');
const Footage = mongoose.model('Footage');
const Performance = mongoose.model('Performance');
const Playlist = mongoose.model('Playlist');
const Video = mongoose.model('Video');
const News = mongoose.model('News');
const Gallery = mongoose.model('Gallery');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
    let res_send = "P";
    if (!req.user) {
        res.send({err:true,msg:__("Please login to like"), status:""});
    } else {
        let model;
        let inc;
        let likeid = req.query.img_index ? req.query.id+"#IMG:"+req.query.img_slug : req.query.id;
        if (req.query.section ==='performances') model = Performance;
        if (req.query.section ==='events') model = Event;
        if (req.query.section ==='videos') model = Video;
        if (req.query.section ==='footage') model = Footage;
        if (req.query.section ==='playlists') model = Playlist;
        if (req.query.section ==='news') model = News;
        if (req.query.section ==='galleries') model = Gallery;
        if (!req.user.likes || !req.user.likes[req.query.section] || req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }).indexOf(likeid.toString())===-1) {
            if (!req.user.likes) req.user.likes = {};
            if (!req.user.likes[req.query.section]) req.user.likes[req.query.section] = [];
            req.user.likes[req.query.section].push({date:new Date(),id:likeid});
            res_send = "Liked";
            inc = 1;
        } else {
            req.user.likes[req.query.section].splice(req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }).indexOf(likeid.toString()),1);
            res_send = "Unliked";
            inc = -1;
        }
        User.updateOne({_id:req.user._id},{likes:req.user.likes}, (err, raw) => {
            if (req.query.img_slug) {
                model.updateOne({_id:req.query.id,"medias.slug": req.query.img_slug},{ $inc: { "medias.$.stats.likes": inc }}, (err, raw) => {
                    if (err) logger.debug(err);
                    res.send({err:false,msg:"", status:res_send});
                });
            } else {
                model.updateOne({_id:req.query.id},{ $inc: { "stats.likes": inc }}, (err, raw) => {
                    if (err) logger.debug(err);
                    res.send({err:false,msg:"", status:res_send});
                });
            }
        });
    }
});

module.exports = router;
