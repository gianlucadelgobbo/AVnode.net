import {SHOW_MODAL, HIDE_MODAL} from "./constants";

export const showModal = ({type, props}) => (dispatch) => {
    console.log({
        type: SHOW_MODAL,
        modalType: type,
        modalProps: props
    });
    dispatch({
        type: SHOW_MODAL,
        modalType: type,
        modalProps: props
    })
};

export const hideModal = () => (dispatch) => {

    dispatch({
        type: HIDE_MODAL
    })
};