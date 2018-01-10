const router = require('../router')();

const User = require('../../models/User');
//const Crew = require('../../models/Crew');

router.get('/', (req, res) => {
  //Crew
  User.find({})
  .limit(90)  
  .populate([{
    path: 'image',
    model: 'Asset'
  }])
  .exec((err, data) => {
    res.render('crews/list', {
      title: __('Crews'),
      data: data
    });
  });
});

module.exports = router;
