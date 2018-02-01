const dataprovider = {};

const config = require('getconfig');
const helper = require('./helper');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Footage = mongoose.model('Footage');
// const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');

const logger = require('./logger');

dataprovider.fetchUser = (id, cb) => {
  logger.debug('fetchUser');
  logger.debug(id);
  User.
      findById(id).
      //.select({'-galleries': 1})
      /*
      populate([{
        path: 'events',
        model: 'Event',
        populate: [{
          path: 'venues',
          model: 'Venue'
        }]
      }, {
        path: 'performances',
        model: 'Performance',
        populate: [{
          path: 'video',
          model: 'Asset'
        }],
        select: {
          'slug': 1,
          'title': 1,
          'about': 1,
          'aboutlanguage': 1,
          'abouts': 1,
          'image': 1,
          'teaserImage': 1,
          'file': 1,
          'categories': 1,
          'tech_art': 1,
          'tech_req': 1,
          'video': 1
        }
      }, {
        path: 'crews',
        model: 'User',
        populate: [{
          path: 'events',
          model: 'Event'
        }, {
          path: 'members', // virtual relation
          model: 'User',
          select: { '_id': 1, 'slug': 1, 'stagename': 1, 'username': 1 }
        }, {
          path: 'performances',
          model: 'Performance',
          populate: [{
            path: 'video',
            model: 'Asset'
          }],
          select: {
            'slug': 1,
            'title': 1,
            'about': 1,
            'aboutlanguage': 1,
            'abouts': 1,
            'image': 1,
            'teaserImage': 1,
            'file': 1,
            'categories': 1,
            'tech_art': 1,
            'tech_req': 1,
            'video': 1
          }
        }],
        select: {
          '-members': 1,
          'slug': 1,
          'stagename': 1,
          'username': 1,
          'abouts': 1,
          'image': 1,
          'teaserImage': 1,
          'file': 1
        }
      }]).
      */
      exec(cb);
};

dataprovider.fetchShow = (req, model, cb) => {
  logger.debug('fetchShow '+req.params.slug);  
  model.
  findOne({slug: req.params.slug}).
  // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
  populate({
    path: 'footage',
    select: {
      title: 1,
      slug: 1,
      stats: 1,
      image: 1
    },
    populate: { path: 'users', select: 'stagename', model: User},
    options: { limit: 5 },
    model: Footage
  }).
  populate({
    path: 'performances',
    select: {
      title: 1,
      slug: 1,
      stats: 1,
      image: 1
    },
    populate: { path: 'users', select: 'stagename', model: User},
    options: { limit: 5 },
    model: Performance
  }).
  populate({
    path: 'events',
    select: {
      title: 1,
      slug: 1,
      stats: 1,
      schedule: 1,
      categories: 1,
      image: 1
    },
    populate: { path: 'categories', select: 'name permalink', model: Category},
    options: { limit: 5 },
    model: Event
  }).
  select({
    stagename: 1,
    is_crew: 1,
    slug: 1,
    image: 1
  }).
  exec((err, data) => {
    cb(err, data);
  });
};

dataprovider.getPerformanceByIds = (req, ids, cb) => {
  logger.debug('getPerformanceByIds ');
  logger.debug(ids);

  Performance.find({'users':{$in: ids}}).
  populate({path: 'categories', select: 'name'}).
  populate({path: 'users', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
  select({ title: 1, categories: 1 }).
  exec((err, data) => {
    logger.debug('getPerformanceByIds Res');  
    logger.debug(err);  
    //logger.debug(data);  
    for (var item in data) logger.debug(data[item].users);  
    cb(err, data);
  });
};

dataprovider.fetchLists = (model, query, limit, skip, sorting, cb) => {
  logger.debug('fetchLists');  
  model.count(query, function(error, total) {
    model.find(query)
    //.populate()
    .limit(limit)
    .skip(skip)
    .sort(sorting)
    /*.select(config.sections[section].list_fields)*/
    .exec(function(err, data) {
      cb(err, data, total);
    });
  });
};

dataprovider.show = (req, res, section, model) => {
  dataprovider.fetchShow(req, model, (err, data) => {
    logger.debug(err);
    //logger.debug(data);
    if (err || data === null) {
      res.status(404).render('404', {});
    } else {
      if (req.query.api || req.headers.host.split('.')[0] === 'api' || req.headers.host.split('.')[1] === 'api') {
        if (process.env.DEBUG) {
          res.render('json', {data: data});
        } else {
          res.json(data);
        }
        logger.debug(err);
        //res.send(JSON.stringify(data, null, '\t'));
      } else {
        res.render(section + '/show', {
          title: data.stagename,
          data: data
        });
      }
    }
  });
};

dataprovider.list = (req, res, section, model) => {
  logger.debug('LIST dataprovider.list');

  const page = req.params.page;
  const filter = req.params.filter;
  const sorting = req.params.sorting;

  let notfound = false;

  if (config.sections[section].categories.indexOf(filter) === -1) notfound = true;
  if (typeof config.sections[section].sortQ[sorting] === 'undefined') notfound = true;
  if (parseInt(page).toString()!=page.toString()) notfound = true;

  const skip = (page - 1) * config.sections[section].limit;

  if (notfound) {
    res.status(404).render('404', {
      title: __('Hmm…'),
      nav: [],
      path: req.originalUrl
    });
  } else {
    const query = filter=='individuals' ? {is_crew: 0} : filter=='crews' ? {is_crew: 1} : {};

    dataprovider.fetchLists(model, query, config.sections[section].limit, skip, config.sections[section].sortQ[sorting], (err, data, total) => {
      logger.debug('bella'+config.sections[section].title);
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        //return next(err);
        res.send({total:total, skip:skip, data:data});
      } else {
        const title = config.sections[section].title + ': ' + config.sections[section].labels[filter] + ' ' + config.sections[section].labels[sorting];
        let info = ' From ' + skip + ' to ' + (skip + config.sections[section].limit) + ' on ' + total + ' ' + title;
        let link = '/' + section + '/' + filter + '/' + sorting + '/';
        let pages = helper.getPagination(link, skip, config.sections[section].limit, total);
        logger.debug(config.sections[section].view_list);
        res.render(config.sections[section].view_list, {
          title: title,
          section: section,
          sort: sorting,
          pages: pages,
          filter: filter,
          categories: config.sections[section].categories,
          orderings: config.sections[section].orders,
          data: data
        });
        /* C
        res.render(section + '/list', {
          title: title,
          info: info,
          section: section,
          total: total,
          path: path,
          sort: sorting,
          filter: filter,
          skip: skip,
          page: page,
          pages: pages,
          result: events,
          categories: config.sections[section].categories,
          orderings: config.sections[section].orders,
          user: req.user,
          _h: _h
        });
        */
      }
    });
  }
};

module.exports = dataprovider;
