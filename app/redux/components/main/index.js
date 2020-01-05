import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";

import TopBar from "../topBar";
import TopMenu from "../topMenu/index";
import ModalRoot from "../modal/root";

// 404 page
import PageNotFound from "../pageNotFound";

// Profile
import ProfilePublic from "../profile/public/index";
import ProfileEmails from "../profile/emails/index";
import ProfileImages from "../profile/image/index";
import ProfilePrivate from "../profile/private/index";
import ProfilePassword from "../profile/password/index";
import ProfileConnections from "../profile/connections/index";

// Events
import Events from "../events/index.js";
import EventPublic from "../events/public/";
import EventImages from "../events/image/";
import EventPartners from "../events/partners/";
import EventProgram from "../events/program/";
import EventGalleries from "../events/galleries/";
import EventVideos from "../events/videos/";
import EventCalls from "../events/calls/";
import EventSettings from "../events/settings/";

// // Performances
import Performances from "../performances/index.js";
import PerformancesPublic from "../performances/public";
import PerformancesImages from "../performances/image";
import PerformancesGalleries from "../performances/galleries";
import PerformancesVideos from "../performances/videos";

// // Crews
import Crews from "../crews/index.js";
import CrewsPublic from "../crews/public";
import CrewsImages from "../crews/image";
import CrewsMembers from "../crews/members";
import CrewsOrganization from "../crews/organization";

// // Footage
import Footage from "../footage/index.js";
import FootagePublic from "../footage/public";
import FootageVideo from "../footage/video";

// // News
import News from "../news/index.js";
import NewsPublic from "../news/public";
import NewsImages from "../news/image";

// // Playlists
import Playlist from "../playlists/index.js";
import PlaylistPublic from "../playlists/public";

// // Videos
import Videos from "../videos/index.js";
import VideosPublic from "../videos/public";
import VideosVideo from "../videos/video";

// // Galleries
import Galleries from "../galleries/index.js";
import GalleriesPublic from "../galleries/public";
import GalleriesGallery from "../galleries/gallery";

import LoadingBar from "react-redux-loading-bar";

class MainApp extends Component {
  render() {
    return (
      <div>
        <LoadingBar />
        <Router>
        <div>
            <TopBar />
            <div className="container-fluid">
              <div className="row pb-3">
                <TopMenu />
                <div className="col maincontent">
                  <Switch>
                    <Route path="/admin/profile/public" component={ProfilePublic} />
                    <Route path="/admin/profile/images" component={ProfileImages} />
                    <Route path="/admin/profile/emails" component={ProfileEmails} />
                    <Route
                      path="/admin/profile/private"
                      component={ProfilePrivate}
                    />
                    <Route
                      path="/admin/profile/password"
                      component={ProfilePassword}
                    />
                    <Route
                      path="/admin/profile/connections"
                      component={ProfileConnections}
                    />

                    <Route
                      path="/admin/crews/:_id/public/"
                      component={CrewsPublic}
                    />
                    <Route
                      path="/admin/crews/:_id/images/"
                      component={CrewsImages}
                    />
                    <Route
                      path="/admin/crews/:_id/members/"
                      component={CrewsMembers}
                    />
                    <Route
                      path="/admin/crews/:_id/organization/"
                      component={CrewsOrganization}
                    />
                    <Route path="/admin/crews" component={Crews} />

                    <Route
                      path="/admin/performances/:_id/public/"
                      component={PerformancesPublic}
                    />
                    <Route
                      path="/admin/performances/:_id/images/"
                      component={PerformancesImages}
                    />
                    <Route
                      path="/admin/performances/:_id/galleries/"
                      component={PerformancesGalleries}
                    />
                    <Route
                      path="/admin/performances/:_id/videos/"
                      component={PerformancesVideos}
                    />
                    <Route path="/admin/performances" component={Performances} />

                    <Route
                      path="/admin/videos/:_id/public/"
                      component={VideosPublic}
                    />
                    <Route
                      path="/admin/videos/:_id/video/"
                      component={VideosVideo}
                    />
                    <Route path="/admin/videos" component={Videos} />

                    <Route
                      path="/admin/galleries/:_id/public/"
                      component={GalleriesPublic}
                    />

                    <Route
                      path="/admin/galleries/:_id/gallery"
                      component={GalleriesGallery}
                    />

                    <Route path="/admin/galleries" component={Galleries} />

                    <Route
                      path="/admin/events/:_id/public/"
                      component={EventPublic}
                    />
                    <Route
                      path="/admin/events/:_id/images/"
                      component={EventImages}
                    />
                    <Route
                      path="/admin/events/:_id/partners/"
                      component={EventPartners}
                    />
                    <Route
                      path="/admin/events/:_id/program/"
                      component={EventProgram}
                    />
                    <Route
                      path="/admin/events/:_id/galleries/"
                      component={EventGalleries}
                    />
                    <Route
                      path="/admin/events/:_id/videos/"
                      component={EventVideos}
                    />
                    <Route
                      path="/admin/events/:_id/calls/"
                      component={EventCalls}
                    />
                    <Route
                      path="/admin/events/:_id/settings/"
                      component={EventSettings}
                    />
                    <Route path="/admin/events" component={Events} />

                    <Route
                      path="/admin/footage/:_id/public/"
                      component={FootagePublic}
                    />
                    <Route
                      path="/admin/footage/:_id/video/"
                      component={FootageVideo}
                    />
                    <Route path="/admin/footage" component={Footage} />

                    <Route
                      path="/admin/news/:_id/public/"
                      component={NewsPublic}
                    />

                    <Route
                      path="/admin/news/:_id/images/"
                      component={NewsImages}
                    />
                    <Route path="/admin/news" component={News} />

                    <Route
                      path="/admin/playlists/:_id/public/"
                      component={PlaylistPublic}
                    />
                    <Route path="/admin/playlists" component={Playlist} />

                    <Route path="*" component={PageNotFound} />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </Router>

        <ModalRoot />
      </div>
    );
  }
}

export default injectIntl(MainApp);
