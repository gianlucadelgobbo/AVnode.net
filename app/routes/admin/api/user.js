const router = require('../../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

const logger = require('../../../utilities/logger');


router.get('/', (req, res) => {
    const apiCall = `api, router.get(/user/${JSON.stringify(req.user.id)}`;
    logger.info(`1 ${apiCall} call fetchUser`);
    fetchUser(req.user.id, (err, user) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
      }
      let str = JSON.stringify(user);
      //logger.debug(`${apiCall} user ${str})`);
      logger.info(`${apiCall} user size ${str.length})`);
      logger.info(`${apiCall} user perfs size ${JSON.stringify(user.performances).length})`);
      logger.info(`${apiCall} user gals size ${JSON.stringify(user.galleries).length})`);
      logger.info(`${apiCall} user crews size ${JSON.stringify(user.crews).length})`);
      logger.info(`${apiCall} user events size ${JSON.stringify(user.events).length})`);
      //logger.debug(`${apiCall} user crews before ${JSON.stringify(user.crews)})`);
      /*user.crews.map((c) => (     
        fetchUserCrews(c, (err, crew) => {
          if (err) {
            logger.debug(`${apiCall} user crew findById ERROR: ${JSON.stringify(err)}`);
          }
          let str = JSON.stringify(crew);
          logger.debug(`${apiCall} crew ${str})`);
          logger.debug(`${apiCall} crew size ${str.length})`);
          user.crews = Object.assign(user.crews, str );
        })
      ))*/
      //logger.debug(`${apiCall} user crews after ${JSON.stringify(user.crews)})`);
      res.json(user);
    });
  });
  const fetchUser = (id, cb) => {
    logger.info('2 fetchUser');  
    User
      .findById(id)
      //.select({'-galleries': 1})
      .populate([{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'events',
        model: 'Event',
        populate: [{
          path: 'image',
          model: 'Asset'
        }, {
          path: 'teaserImage',
          model: 'Asset'
        }, {
          path: 'venues',
          model: 'Venue'
        }]
      }, {
        path: 'performances',
        model: 'Performance',
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
        },
        populate: [{
          path: 'image',
          model: 'Asset'
        }, {
          path: 'teaserImage',
          model: 'Asset'
        }, {
          path: 'video',
          model: 'Asset'
        }] //, {
        //path: 'performers', select: { 'stagename': 1 } // virtual relation
        //}//, { //, 'events': 0, 'crews': 0, 'performances': 0, 'addresses': 0, 'emails': 0
        //path: 'crews' // virtual relation
        //}   
      }, {
        path: 'crews',
        select: {
          '-members': 1,
          'org_name': 1,
          'org_foundation_year': 1,
          'org_type': 1,
          'org_logo': 1,
          'org_web_social_channels': 1,
          'org_web_social_channels_for_project_likes_shares': 1,
          'org_phone': 1,
          'description': 1,
          'org_aims_and_activities': 1,
          'org_pic_code': 1,
          'org_address': 1,
          'org_vat_number': 1,
          'org_able_to_recuperate_vat': 1,
          'org_official_registration_number': 1,
          'org_legal_representative_title': 1,
          'org_legal_representative_role': 1,
          'org_legal_representative_name': 1,
          'org_legal_representative_surname': 1,
          'org_legal_representative_email': 1,
          'org_legal_representative_mobile_phone': 1,
          'org_legal_representative_skype': 1,
          'org_legal_representative_facebook': 1,
          'org_contact_facebook': 1,
          'activity_season': 1,
          'org_statute': 1,
          'org_members_cv': 1,
          'org_activity_report': 1,
          'org_permanent_employees': 1,
          'org_permanent_employees_avnode': 1,
          'org_temporary_employees': 1,
          'org_temporary_employees_avnode': 1,
          'org_relevance_in_the_project': 1,
          'org_emerging_artists_definition': 1,
          'org_eu_grants_received_in_the_last_3_years': 1,
          'org_annual_turnover_in_euro': 1,
          'org_contact_title': 1,
          'org_contact_role': 1,
          'org_contact_name': 1,
          'org_contact_surname': 1,
          'org_contact_email': 1,
          'org_contact_language': 1,
          'org_contact_mobile_phone': 1,
          'org_contact_skype': 1,
          'org_website': 1,
          'org_public_email': 1,
          'activity_name': 1,
          'activity_logo': 1,
          'activity_start_date': 1,
          'activity_is_running': 1,
          'activity_end_date': 1,
          'activity_address': 1,
          'activity_website': 1,
          'activity_web_social_channels': 1,
          'activity_public_email': 1,
          'projects': 1,
          'memberscvs': 1,
          'summaryofmemberscvs': 1,
          'activityreport': 1,
          'membershipdate': 1,
          'avnodedelegate': 1,
          'agreementstatus': 1,
          'introducedby1': 1,
          'introducedby2': 1,
          'slug': 1,
          'stagename': 1,
          'username': 1,
          'about': 1,
          'aboutlanguage': 1,
          'abouts': 1,
          'image': 1,
          'teaserImage': 1,
          'file': 1
        },
        model: 'User',
        populate: [{
          path: 'image',
          model: 'Asset'
        }, {
          path: 'teaserImage',
          model: 'Asset'
        }, {
          path: 'events',
          model: 'Event'
        }, {
          path: 'members', // virtual relation
          model: 'User',
          select: { '_id': 1, 'slug': 1, 'stagename': 1, 'username': 1 }
        }]
      }])
      .exec(cb);
  };
  
  module.exports = router;