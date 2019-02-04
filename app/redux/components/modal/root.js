import React, { Component } from "react";
import Example from "./example";
import Saved from "./saved";
import Remove from "./remove";
import AddEvent from "../events/add";
import AddPerformance from "../performances/add";
import AddUserPerformance from "../performances/users";
import AddUserVideos from "../videos/users";
import AddUserGalleries from "../galleries/users";
import AddMediaModal from "./media/add";
import AddPartnerModal from "./partners/add";
import AddCrewModal from "./crews/add";
import AddMembersModal from "./members/add";
import AddFootageModal from "./footage/add";
import AddPlaylistModal from "./playlists/add";
import AddVideosModal from "./videos/add";
import AddGalleriesModal from "./galleries/add";
import AddPerformancesGalleriesModal from "../performances/galleries/add";
import AddPerformancesVideosModal from "../performances/videos/add";
import AddEventsGalleriesModal from "../events/galleries/add";
import AddEventsVideosModal from "../events/videos/add";
import SignupModal from "./signup/index";
import EmailVerificationSuccess from "./emails/success";
import EmailVerificationError from "./emails/error";

import ModalWrapper from "./wrapper";
import { connect } from "react-redux";
import { getModal } from "./selectors";
import * as actions from "./actions";
import {
  MODAL_EXAMPLE,
  MODAL_REMOVE,
  MODAL_SAVED,
  MODAL_ADD_EVENT,
  MODAL_ADD_PERFORMANCE,
  MODAL_ADD_USER_PERFORMANCE,
  MODAL_ADD_USER_VIDEOS,
  MODAL_ADD_USER_GALLERIES,
  MODAL_ADD_MEDIA,
  MODAL_ADD_PARTNER,
  MODAL_ADD_CREW,
  MODAL_ADD_MEMBERS,
  MODAL_ADD_FOOTAGE,
  MODAL_ADD_PLAYLIST,
  MODAL_ADD_VIDEOS,
  MODAL_ADD_GALLERIES,
  MODAL_ADD_PERFORMANCES_GALLERIES,
  MODAL_ADD_PERFORMANCES_VIDEOS,
  MODAL_ADD_EVENTS_GALLERIES,
  MODAL_ADD_EVENTS_VIDEOS,
  MODAL_SIGN_UP_SUCCESS,
  MODAL_EMAIL_VERIFICATION_SUCCESS,
  MODAL_EMAIL_VERIFICATION_ERROR
} from "./constants";

/*
 * Come creare una nuova modale:
 * - creare la cartella corrispondente dentro ./src/containers/modal come 'example'
 * - decidere una chiave univoca per identificare la modale (per Example e' EXAMPLE)
 * - importare la nuova modale dentro root
 * - aggiungere a MODAL_COMPONENTS e MODAL_TITLES utilizzando la chiave
 * -dentro profile e' presente come aprire la modale
 * */

const MODAL_COMPONENTS = {
  [MODAL_EXAMPLE]: Example,
  [MODAL_SAVED]: Saved,
  [MODAL_REMOVE]: Remove,
  [MODAL_ADD_EVENT]: AddEvent,
  [MODAL_ADD_PERFORMANCE]: AddPerformance,
  [MODAL_ADD_USER_PERFORMANCE]: AddUserPerformance,
  [MODAL_ADD_USER_VIDEOS]:AddUserVideos,
  [MODAL_ADD_USER_GALLERIES]:AddUserGalleries,
  [MODAL_ADD_MEDIA]: AddMediaModal,
  [MODAL_ADD_PARTNER]: AddPartnerModal,
  [MODAL_ADD_CREW]: AddCrewModal,
  [MODAL_ADD_MEMBERS]: AddMembersModal,
  [MODAL_ADD_FOOTAGE]: AddFootageModal,
  [MODAL_ADD_PLAYLIST]: AddPlaylistModal,
  [MODAL_ADD_VIDEOS]: AddVideosModal,
  [MODAL_ADD_GALLERIES]: AddGalleriesModal,
  [MODAL_ADD_PERFORMANCES_GALLERIES]: AddPerformancesGalleriesModal,
  [MODAL_ADD_PERFORMANCES_VIDEOS]: AddPerformancesVideosModal,
  [MODAL_ADD_EVENTS_GALLERIES]: AddEventsGalleriesModal,
  [MODAL_ADD_EVENTS_VIDEOS]: AddEventsVideosModal,
  [MODAL_SIGN_UP_SUCCESS]: SignupModal,
  [MODAL_EMAIL_VERIFICATION_SUCCESS]: EmailVerificationSuccess,
  [MODAL_EMAIL_VERIFICATION_ERROR]: EmailVerificationError

  /* other modals */
};

const MODAL_TITLES = {
  [MODAL_EXAMPLE]: "This is the title",
  [MODAL_SAVED]: "Saved!",
  [MODAL_REMOVE]: "Remove?",
  [MODAL_ADD_EVENT]: "Add Event",
  [MODAL_ADD_PERFORMANCE]: "Add Performance",
  [MODAL_ADD_USER_PERFORMANCE]: "Add Users",
  [MODAL_ADD_USER_VIDEOS]: "Add Users",
  [MODAL_ADD_USER_GALLERIES]:"Add Users",
  [MODAL_ADD_MEDIA]: "Add Media",
  [MODAL_ADD_PARTNER]: "Add Partner",
  [MODAL_ADD_CREW]: "Add Crew",
  [MODAL_ADD_MEMBERS]: "Add Members",
  [MODAL_ADD_FOOTAGE]: "Add Footage",
  [MODAL_ADD_PLAYLIST]: "Add Playlist",
  [MODAL_ADD_VIDEOS]: "Add Video",
  [MODAL_ADD_GALLERIES]: "Add Gallery",
  [MODAL_ADD_PERFORMANCES_GALLERIES]: "Add Gallery",
  [MODAL_ADD_PERFORMANCES_VIDEOS]: "Add Video",
  [MODAL_ADD_EVENTS_GALLERIES]: "Add Gallery",
  [MODAL_ADD_EVENTS_VIDEOS]: "Add Video",
  [MODAL_SIGN_UP_SUCCESS]: "Welcome!",
  [MODAL_EMAIL_VERIFICATION_SUCCESS]: "Verification sent!",
  [MODAL_EMAIL_VERIFICATION_ERROR]: "Ops..."
  /* other modals */
};

const getAdditionalProps = type => {
  switch (type) {
    default:
      return {};
  }
};

const ModalRoot = ({ modalType, modalProps, hideModal }) => {
  if (!modalType) {
    return <ModalWrapper show={!!modalType} />;
  } else {
    const SpecificModal = MODAL_COMPONENTS[modalType];
    const title = MODAL_TITLES[modalType];
    const additionalProps = getAdditionalProps(modalType);

    if (!SpecificModal) {
      return <span />;
    }

    return (
      <ModalWrapper title={title} type={modalType} show={!!modalType}>
        <SpecificModal
          {...additionalProps}
          {...modalProps}
          hideModal={hideModal}
        />
      </ModalWrapper>
    );
  }
};

export default connect(
  state => getModal(state),
  actions
)(ModalRoot);
