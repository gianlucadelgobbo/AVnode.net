import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { bindActionCreators } from "redux";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { fetchModel } from "../profile/actions";
import { fetchList as fetchCrews } from "../crews/actions";
import { fetchList as fetchPerformances } from "../performances/actions";
import { fetchList as fetchEvents } from "../events/actions";
import { fetchList as fetchFootage } from "../footage/actions";
import { fetchList as fetchNews } from "../news/actions";
import { fetchList as fetchPlaylists } from "../playlists/actions";
import { fetchList as fetchVideos } from "../videos/actions";
import { fetchList as fetchGalleries } from "../galleries/actions";
import { getList as getCrews } from "../crews/selectors";
import { getList as getPerformances } from "../performances/selectors";
import { getList as getEvents } from "../events/selectors";
import { getList as getFootage } from "../footage/selectors";
import { getList as getNews } from "../news/selectors";
import { getList as getPlaylists } from "../playlists/selectors";
import { getList as getVideos } from "../videos/selectors";
import { getList as getGalleries } from "../galleries/selectors";
import { getDefaultModel } from "../profile/selectors";

class TopMenu extends Component {
  componentDidMount() {
    const {
      fetchModel,
      fetchCrews,
      fetchPerformances,
      fetchEvents,
      fetchFootage,
      fetchNews,
      fetchPlaylists,
      fetchVideos,
      fetchGalleries
    } = this.props;

    fetchCrews();
    fetchPerformances();
    fetchEvents();
    fetchFootage();
    fetchNews();
    fetchPlaylists();
    fetchVideos();
    fetchGalleries();
  }

  createMenuItem = ({ model, index }) => {
    return (
      <NavLink
        to={model.href}
        activeClassName="active"
        className="bg-dark list-group-item list-group-item-action"
        key={index}
      >
        <span className={model.icon}></span>
        <span className="menu-collapsed">{model.label} </span>

        <span className="badge badge-pill badge-info float-right">
          {model.counter}
        </span>
      </NavLink>
    );
  };

  render() {
    const {
      profile,
      crews,
      performances,
      events,
      footage,
      news,
      playlists,
      videos,
      galleries
    } = this.props;
    const id = profile !== undefined ? profile._id : "";
    const items = [
      {
        href: `/admin/profile/${id}/public`,
        icon: "fa fa-user fa-fw mr-3",
        counter: "me",
        label: <FormattedMessage id="profile" defaultMessage="Profile" />
        /* submenu: subitems[0] */
      },
      {
        href: "/admin/crews",
        icon: "fa fa-users fa-fw mr-3",
        counter: crews.length,
        label: <FormattedMessage id="crews" defaultMessage="Crews" />
        /* submenu: subitems[1] */
      },
      {
        href: "/admin/performances",
        icon: "fa fa-theater-masks fa-fw mr-3",
        counter: performances.length,
        label: (
          <FormattedMessage id="performances" defaultMessage="Performances" />
        )
        /* submenu: subitems[2] */
      },
      {
        href: "/admin/events",
        icon: "far fa-calendar fa-fw mr-3",
        counter: events.length,
        label: <FormattedMessage id="events" defaultMessage="Events" />
        /* submenu: subitems[3] */
      },
      {
        href: "/admin/news",
        icon: "fa fa-newspaper fa-fw mr-3",
        counter: news.length,
        label: <FormattedMessage id="news" defaultMessage="News" />
        /* submenu: subitems[4] */
      },
      {
        href: "/admin/videos",
        icon: "fa fa-video fa-fw mr-3",
        counter: videos.length,
        label: <FormattedMessage id="videos" defaultMessage="Videos" />
        /* submenu: subitems[5] */
      },
      {
        href: "/admin/galleries",
        icon: "fa fa-images fa-fw mr-3",
        counter: galleries.length,
        label: <FormattedMessage id="galleries" defaultMessage="Galleries" />
        /* submenu: subitems[6] */
      },
      {
        href: "/admin/footage",
        icon: "fa fa-film fa-fw mr-3",
        counter: footage.length,
        label: <FormattedMessage id="footage" defaultMessage="Footage" />
        /* submenu: subitems[7] */
      },
      {
        href: "/admin/playlists",
        icon: "fa fa-clipboard-list fa-fw mr-3",
        counter: playlists.length,
        label: <FormattedMessage id="playlists" defaultMessage="Playlists" />
        /* submenu: subitems[8] */
      }
    ];

    return (
      <div className="d-print-none">
        <div
          className="sidebar-expanded d-none d-lg-block"
          id="sidebar-container"
        >
          <nav id="account-nav" className="list-group">
            <div className="list-group-item sidebar-separator-title d-flex">
              <small className="menu-collapsed">Control panel</small>
            </div>
            {items.map((model, index) => this.createMenuItem({ model, index }))}
            <a
              className="bg-dark list-group-item"
              aria-current="false"
              href="/admin/subscriptions"
            >
              <div className="d-flex w-100 justify-content-start align-items-center">
                <span className="fa fa-calendar-check fa-fw mr-3"></span>
                <span className="menu-collapsed">Subscriptions</span>
              </div>
            </a>
            <a
              className="bg-dark list-group-item"
              href="#"
              data-toggle="sidebar-collapse"
            >
              <div className="d-flex w-100 justify-content-start align-items-center">
                <span className="fa fa-arrow-alt-circle-left fa-fw mr-3"></span>
                <span className="menu-collapsed">Collapse</span>
              </div>
            </a>
          </nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: getDefaultModel(state),
  crews: getCrews(state),
  performances: getPerformances(state),
  events: getEvents(state),
  footage: getFootage(state),
  news: getNews(state),
  playlists: getPlaylists(state),
  videos: getVideos(state),
  galleries: getGalleries(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchModel,
      fetchCrews,
      fetchPerformances,
      fetchEvents,
      fetchFootage,
      fetchNews,
      fetchPlaylists,
      fetchVideos,
      fetchGalleries
    },
    dispatch
  );

TopMenu = connect(mapStateToProps, mapDispatchToProps)(TopMenu);

export default TopMenu;
