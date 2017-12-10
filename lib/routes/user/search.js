const router = require('../router')();
const User = require('../../models/User');
const Crew = require('../../models/Crew');
const _ = require('lodash');

router.get('/member/:crew/:q', (req, res) => {
  const term = new RegExp(req.params.q, 'i');

  Crew.findById(req.params.crew, (err, crew) => {
    if (err || crew === null) {
      return res.json([]);
    }
    User
    .find({ username: term, crews: { $nin: [crew._id] }})
    .limit(5)
    .exec(function(err, users) {
      if (users) {
        let data = [];
        data = users.map(function(user) {
          return _.pick(user, ['id', 'name', 'username']);
        });
        res.json(data);
      } else {
        res.json([]);
      }
    });
  });
});

module.exports = router;
