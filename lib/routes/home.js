const router = require('./router')();

const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const Performance = mongoose.model('Performance');
const i18n = require('../plugins/i18n');


router.get('/', (req, res) => {
    console.log('home');

    Event.findOne({})
    .populate([{
        path: 'teaserImage',
        model: 'Asset'
    }])
    .exec((err, event) => {
        User.find({})
        .populate([{
        path: 'image',
        model: 'Asset'
        }])
        .limit(40)
        .exec((err, performers) => {
            Performance.find({})
            .populate([{
                path: 'image',
                model: 'Asset'
            }])
            .limit(40)
            .exec((err, performances) => {
                res.render('home', {
                    title: i18n.__('Welcome to AVnode network'),
                    subtitle: i18n.__('AVnode is an international network of artists and professionals organising activities in the field of audio visual performing arts.'),
                    performances: performances,
                    performers: performers,
                    event: event
                });
            });
        });
    });
});
  
module.exports = router;
