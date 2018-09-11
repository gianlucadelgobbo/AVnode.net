const router = require('../router')();
const mongoose = require('mongoose');

const User = mongoose.model('User');

const Event = mongoose.model('Event');
const Footage = mongoose.model('Footage');
const Performance = mongoose.model('Performance');
const Playlist = mongoose.model('Playlist');
const Video = mongoose.model('Video');
const News = mongoose.model('News');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
    let res_send = "P";
    if (!req.user) {
        res.send({err:true,msg:__("Please login to like"), status:""});
    } else {
        let model;
        let inc;
        if (req.query.section ==='performances') model = Performance;
        if (req.query.section ==='events') model = Event;
        if (req.query.section ==='videos') model = Video;
        if (req.query.section ==='footage') model = Footage;
        if (req.query.section ==='playlists') model = Playlist;
        if (req.query.section ==='news') model = News;
        if (!req.user.likes || !req.user.likes[req.query.section] || req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }).indexOf(req.query.id.toString())===-1) {
            if (!req.user.likes) req.user.likes = {};
            if (!req.user.likes[req.query.section]) req.user.likes[req.query.section] = [];
            req.user.likes[req.query.section].push({date:new Date(),id:req.query.id});
            res_send = "Liked";
            inc = 1;
        } else {
            req.user.likes[req.query.section].splice(req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }).indexOf(req.query.id.toString()),1);
            res_send = "Unliked";
            inc = -1;
        }
        User.update({_id:req.user._id},{likes:req.user.likes}, (err, raw) => {
            model.update({_id:req.query.id},{ $inc: { "stats.likes": inc }}, (err, raw) => {
                if (err) logger.debug(err);
                res.send({err:false,msg:"", status:res_send});
            });
        });
    }
});

module.exports = router;
