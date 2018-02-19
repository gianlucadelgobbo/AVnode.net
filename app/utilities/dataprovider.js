const dataprovider = {};

const config = require('getconfig');
const helper = require('./helper');

const mongoose = require('mongoose');
const UserShow = mongoose.model('UserShow');
const Event = mongoose.model('Event');
const Footage = mongoose.model('Footage');
// const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');
const Playlist = mongoose.model('Playlist');
const Video = mongoose.model('Video');
const News = mongoose.model('News');

const logger = require('./logger');

dataprovider.fetchShow = (req, model, populate, select, cb) => {
  logger.debug('fetchShow '+req.params.slug);  
  model.
  findOne({slug: req.params.slug}).
  // lean({ virtuals: true }).
  // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
  populate(populate).
  select(select).
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

dataprovider.fetchLists = (model, query, select, populate, limit, skip, sorting, cb) => {
  logger.debug('fetchLists');  
  model.count(query, function(error, total) {
    model.find(query)
    .populate(populate)
    .select(select)
    .limit(limit)
    .skip(skip)
    .sort(sorting)
    /*.select(config.sections[section].list_fields)*/
    .exec(function(err, data) {
      cb(err, data, total);
    });
  });
};

dataprovider.show = (req, res, section, subsection, model) => {
  logger.debug("req.params.page");
  logger.debug(req.params.page);
  let populate = config.sections[section][subsection].populate;
  logger.debug(populate);
  for(let item in populate) {
    if (req.params.page && populate[item].options && populate[item].options.limit) populate[item].options.skip = populate[item].options.limit*(req.params.page-1);
    if (populate[item].model === 'UserShow') populate[item].model = UserShow;
    if (populate[item].model === 'Performance') populate[item].model = Performance;
    if (populate[item].model === 'Event') populate[item].model = Event;
    if (populate[item].model === 'Video') populate[item].model = Video;
    if (populate[item].model === 'Footage') populate[item].model = Footage;
    if (populate[item].model === 'Playlist') populate[item].model = Playlist;
    if (populate[item].model === 'Category') populate[item].model = Category;
    if (populate[item].model === 'News') populate[item].model = News;

    if (populate[item].populate && populate[item].populate.model === 'UserShow') populate[item].populate.model = UserShow;
    if (populate[item].populate && populate[item].populate.model === 'Performance') populate[item].populate.model = Performance;
    if (populate[item].populate && populate[item].populate.model === 'Event') populate[item].populate.model = Event;
    if (populate[item].populate && populate[item].populate.model === 'Video') populate[item].populate.model = Video;
    if (populate[item].populate && populate[item].populate.model === 'Footage') populate[item].populate.model = Footage;
    if (populate[item].populate && populate[item].populate.model === 'Playlist') populate[item].populate.model = Playlist;
    if (populate[item].populate && populate[item].populate.model === 'Category') populate[item].populate.model = Category;
    if (populate[item].populate && populate[item].populate.model === 'News') populate[item].populate.model = News;
  }
  const select = config.sections[section][subsection].select;

  dataprovider.fetchShow(req, model, populate, select, (err, data) => {
    logger.debug('fetchShow');
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
      } else if (req.query.xml) {
        logger.debug("nextpage");
        logger.debug(parseFloat(req.params.page)+1);
        res.render(section + '/fpData', {
          title: data.stagename,
          data: data,
          nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
        });
      } else {
        logger.debug("nextpage");
        logger.debug(parseFloat(req.params.page)+1);
        res.render(section + '/' + subsection, {
          title: data.stagename,
          data: data,
          path: req.originalUrl,
          nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
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
  if (typeof config.sections[section].ordersQueries[sorting] === 'undefined') notfound = true;
  if (parseInt(page).toString()!=page.toString()) notfound = true;

  const skip = (page - 1) * config.sections[section].limit;
  const select = config.sections[section].list_fields;
  const populate = config.sections[section].list_populate;
  logger.debug(notfound);

  if (notfound) {
    res.status(404).render('404', {
      title: __('Hmm…'),
      nav: [],
      path: req.originalUrl
    });
  } else {
    //const query = filter=='individuals' ? {is_crew: 0} : filter=='crews' ? {is_crew: 1} : {};
    const query = config.sections[section].categoriesQueries[filter];
    logger.debug('query: '+query.toString());
    logger.debug(query);

    dataprovider.fetchLists(model, query, select, populate, config.sections[section].limit, skip, config.sections[section].ordersQueries[sorting], (err, data, total) => {
      logger.debug('bella'+config.sections[section].title);
      logger.debug(err);
      logger.debug(data);
      logger.debug(total);
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        if (process.env.DEBUG) {
          res.render('json', {total:total, skip:skip, data:data});
        } else {
          res.json({total:total, skip:skip, data:data});
        }
        //return next(err);
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
          labels: config.sections[section].labels,
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
