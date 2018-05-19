import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {FormattedMessage, injectIntl} from 'react-intl';


import TopMenu from '../topMenu/index';
import ModalRoot from '../modal/root'

// 404 page
import PageNotFound from '../pageNotFound'

// Profile
import ProfilePublic from '../profile/public/index'
import ProfileEmails from '../profile/emails/index';
import ProfileImages from '../profile/images/index';
import ProfilePrivate from '../profile/private/index';
import ProfilePassword from '../profile/password/index';
import ProfileConnections from '../profile/connections/index';

// Events
import Events from '../events/index.js';
import EventPublic from '../events/public/';
import EventImages from '../events/images/';
import EventPartners from '../events/partners/';
import EventProgram from '../events/program/';
import EventGalleries from '../events/galleries/';
import EventVideos from '../events/videos/';
import EventCalls from '../events/calls/';
import EventSettings from '../events/settings/';

// // Performances
import Performances from '../performances/index.js';
import PerformancesPublic from '../performances/public';
import PerformancesGalleries from '../performances/galleries';
import PerformancesVideos from '../performances/videos';

// // Crews
import Crews from '../crews/index.js';
import CrewsPublic from '../crews/public';
import CrewsImages from '../crews/images';
import CrewsMembers from '../crews/members';
import CrewsOrganization from '../crews/organization';

// // Preferences
import Preferences from '../preferences/index';


class App extends Component {
    render() {
        return (<div>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">
                        <FormattedMessage
                            id="admin"
                            defaultMessage="Control panel"
                        /></h1>
                </div>
            </div>

            <Router>

                <div>
                    <div className="container-fluid account-nav-wrap">
                        <div className="container">
                            <TopMenu/>
                        </div>
                    </div>

                    <div className="container">
                        <Route exact path="/admin/profile/public" component={ProfilePublic}/>
                        <Route exact path="/admin/profile/images" component={ProfileImages}/>
                        <Route exact path="/admin/profile/emails" component={ProfileEmails}/>
                        <Route exact path="/admin/profile/private" component={ProfilePrivate}/>
                        <Route exact path="/admin/profile/password" component={ProfilePassword}/>
                        <Route exact path="/admin/profile/connections" component={ProfileConnections}/>

                        <Route exact path="/admin/crews" component={Crews}/>
                        <Route exact path="/admin/crews/:_id/public/" component={CrewsPublic}/>
                        <Route exact path="/admin/crews/:_id/images/" component={CrewsImages}/>
                        <Route exact path="/admin/crews/:_id/members/" component={CrewsMembers}/>
                        <Route exact path="/admin/crews/:_id/organization/" component={CrewsOrganization}/>

                        <Route exact path="/admin/performances" component={Performances}/>
                        <Route exact path="/admin/performances/:_id/public/" component={PerformancesPublic}/>
                        <Route exact path="/admin/performances/:_id/galleries/" component={PerformancesGalleries}/>
                        <Route exact path="/admin/performances/:_id/videos/" component={PerformancesVideos}/>


                        <Route exact path="/admin/events" component={Events}/>
                        <Route exact path="/admin/events/:_id/public/" component={EventPublic}/>
                        <Route exact path="/admin/events/:_id/images/" component={EventImages}/>
                        <Route exact path="/admin/events/:_id/partners/" component={EventPartners}/>
                        <Route exact path="/admin/events/:_id/program/" component={EventProgram}/>
                        <Route exact path="/admin/events/:_id/galleries/" component={EventGalleries}/>
                        <Route exact path="/admin/events/:_id/videos/" component={EventVideos}/>
                        <Route exact path="/admin/events/:_id/calls/" component={EventCalls}/>
                        <Route exact path="/admin/events/:_id/settings/" component={EventSettings}/>

                        <Route exact path="/admin/preferences" component={Preferences}/>
                        <Route component={PageNotFound}/>

                    </div>
                </div>

            </Router>

            <ModalRoot/>

        </div>);
    }
};


export default injectIntl(App);
