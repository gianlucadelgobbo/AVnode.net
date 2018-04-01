import { h } from 'preact';

// FIXME: content behind is scrollable…
const Modal = ({open, title, children, footer, close}) => {
  if (!open) {
    return null;
  } else {
    const modalStyle = {
      display: 'block'
    };
    return (
      <div className="modal-open">

        <div>
          <div className="modal show" style={modalStyle}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    onClick={close}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">
                      <i className="fa fa-times fa-fw"></i>
                    </span>
                  </button>
                  <h4 className="modal-title">{title}</h4>
                </div>
                <div className="modal-body">
                  {children}
                </div>
                { footer ?
                  <div className="modal-footer">
                    {footer}
                  </div> :
                  null
                }
              </div>
            </div>
          </div>
        </div>

        <div className="modal-backdrop show"> </div>
      </div>
    );
  }
};

export default Modal;
