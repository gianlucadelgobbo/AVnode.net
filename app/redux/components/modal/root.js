import {h, Component} from 'preact';
import Example from './example'
import Saved from './saved'
import Remove from './remove'

import ModalWrapper from './wrapper';
import {connect} from 'preact-redux';
import {getModal} from './selectors';
import * as actions from './actions';
import {MODAL_EXAMPLE, MODAL_REMOVE, MODAL_SAVED} from "./constants"
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
    /* other modals */
};

const MODAL_TITLES = {
    [MODAL_EXAMPLE]: 'This is the title',
    [MODAL_SAVED]: 'Saved!',
    [MODAL_REMOVE]: 'Remove?',

    /* other modals */
};

const getAdditionalProps = (type) => {

    switch (type) {
        default:
            return {};
    }
};


const ModalRoot = ({modalType, modalProps, hideModal}) => {

    if (!modalType) {

        return <ModalWrapper show={!!modalType}/>;
    } else {

        const SpecificModal = MODAL_COMPONENTS[modalType];
        const title = MODAL_TITLES[modalType];
        const additionalProps = getAdditionalProps(modalType);

        if (!SpecificModal) {
            return <span/>
        }

        return (<ModalWrapper title={title} type={modalType} show={!!modalType}>
            <SpecificModal {...additionalProps} {...modalProps} hideModal={hideModal}/>
        </ModalWrapper>);
    }
};


export default connect(
    (state) => getModal(state),
    actions
)(ModalRoot);