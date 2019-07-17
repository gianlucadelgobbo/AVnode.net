import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { bindActionCreators } from "redux";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
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

class TopMenu extends Component {
  componentDidMount() {
    const {
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
        className="nav-link"
        key={index}
      >
        {model.label}{" "}
        <span className="badge badge-pill badge-info">{model.counter}</span>
      </NavLink>
    );
  };

  render() {
    const {
      crews,
      performances,
      events,
      footage,
      news,
      playlists,
      videos,
      galleries
    } = this.props;

    const items = [
      {
        href: "/admin/profile/public",
        label: <FormattedMessage id="profile" defaultMessage="Profile" />
      },
      {
        href: "/admin/crews",
        counter: crews.length,
        label: <FormattedMessage id="crews" defaultMessage="Crews" />
      },
      {
        href: "/admin/performances",
        counter: performances.length,
        label: (
          <FormattedMessage id="performances" defaultMessage="Performances" />
        )
      },
      {
        href: "/admin/events",
        counter: events.length,
        label: <FormattedMessage id="events" defaultMessage="Events" />
      },
      {
        href: "/admin/news",
        counter: news.length,
        label: <FormattedMessage id="news" defaultMessage="News" />
      },
      {
        href: "/admin/videos",
        counter: videos.length,
        label: <FormattedMessage id="videos" defaultMessage="Videos" />
      },
      {
        href: "/admin/galleries",
        counter: galleries.length,
        label: <FormattedMessage id="galleries" defaultMessage="Galleries" />
      },
      {
        href: "/admin/footage",
        counter: footage.length,
        label: <FormattedMessage id="footage" defaultMessage="Footage" />
      },
      {
        href: "/admin/playlists",
        counter: playlists.length,
        label: <FormattedMessage id="playlists" defaultMessage="Playlists" />
      }
    ];

    return (
      <nav id="account-nav" className="nav nav-pills nav-justified">
        {items.map((model, index) => this.createMenuItem({ model, index }))}

        <a
          className="nav-link"
          aria-current="false"
          href="/admin/subscriptions"
        >
          <span>Subscriptions</span>
          <span className="badge badge-pill badge-info" />
        </a>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
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

TopMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopMenu);

export default TopMenu;
