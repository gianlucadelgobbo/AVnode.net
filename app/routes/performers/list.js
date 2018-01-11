const config = require('getconfig');
const router = require('../router')();
const logger = require('../../utilities/logger');

const helper = require('../../utilities/asset/helper');
const dataprovider = require('../../utilities/dataprovider');

router.get('/:filter/:sorting/:page', (req, res) => {
  logger.debug('LIST page');
  list(req, res);
});

router.get('/:filter/:sorting', (req, res) => {
  logger.debug('LIST sorting');
  req.params.page = 1;
  list(req, res);
});

router.get('/:filter', (req, res) => {
  logger.debug('LIST filter');
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  list(req, res);
});

router.get('/', (req, res) => {
  logger.debug('LIST');
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  req.params.filter = config.sections[section].categories[0];
  list(req, res);
});

list = (req, res) => {
  logger.debug('LIST LIST');
  var section = 'performers';
  
  var page = req.params.page;
  var filter = req.params.filter;
  var sorting = req.params.sorting;

  var notfound = false;
  if (config.sections[section].categories.indexOf(filter) === -1) notfound = true;
  if (typeof config.sections[section].sortQ[sorting]=="undefined") notfound = true;
  if (parseInt(page).toString()!=page.toString()) notfound = true;
    
  var skip = (page - 1) * config.sections[section].limit;
  
  
  if (notfound) {
    res.status(404).render('404', {
      title: __('Hmm…'),
      nav: [],
      path: req.originalUrl
    });
  } else {
    var path = '/' + section + '/' + filter + '/' + sorting + '/' + page;
    //path = path.replace('//', '/');
    // TODO: Validate that the params above are configured in `config`, if not
    // => 404 or 500
    var query = filter=='individuals' ? {is_crew: 0} : filter=='crews' ? {is_crew: 1} : {};
  
    dataprovider.fetchPerformers(query, config.sections[section].limit, skip, config.sections[section].sortQ[sorting], (err, data, total) => {
      logger.debug('bella');
      if (req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        //return next(err);
        res.send({total:total, skip:skip, data:data});
      } else {
        var title = config.sections[section].title;
        var info = ' From ' + skip + ' to ' + (skip + config.sections[section].limit) + ' on ' + total + ' ' + title;
        var link = '/' + section + '/' + filter + '/' + sorting + '/';
        var pages = helper.getPagination(link, skip, config.sections[section].limit, total);
        res.render('performers/list', {
          title: __('Performers'),
          section: section,
          sort: sorting,
          pages: pages,
          filter: filter,
          categories: config.sections[section].categories,
          orderings: config.sections[section].orders,
          data: data
        });
        /*res.render(section + '/list', {
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
        });*/
      }
    });
  }
}

module.exports = router;