import { h } from 'preact';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'preact-intl';
import { Field } from 'redux-form';


const dropzoneStyle = {
  border: 'none',
  width: '100%',
  padding: '1rem',
  backgroundColor: '#eee'
};

const ActualDropzone = (onDrop) =>  (field) => {
  //const files = field.input.value;
  //const allowedTypes = [ 'image/png', 'image/jpeg', 'image/jpg' ];
  // FIXME: Restrict to these types…
        //( filesToUpload, e ) => field.input.onChange(filesToUpload)}
  //accept={allowedTypes.join(', ')}

  return (
    <div className="dropzone">
      <Dropzone
        style={dropzoneStyle}
        name={field.name}
        multiple={false}
        onDrop={onDrop}
        activeClassName="drop"
      >
        <div>
          <FormattedMessage id="crew.edit.form.label.imageDrop" defaultMessage="Drop image here or click to upload…" />
        </div>
      </Dropzone>
      {field.meta.touched &&
        field.meta.error &&
        <span className="alert alert-error">{field.meta.error}</span>
      }
    </div>
  );
};

const ImageDropzone = ({imageUploadInProgress, onDrop}) => {
  return (imageUploadInProgress) ?  ( 
    <div style={dropzoneStyle}>
      <i className="fa fa-fw fa-spinner fa-pulse"></i>
      {' '}
      <FormattedMessage id="crew.edit.form.label.imageUploading" defaultMessage="Squeezing your image through the tubes…" />
    </div>
    ) : (
        <Field
          name="image"
          component={ActualDropzone(onDrop)}
        />
    );
};

export default ImageDropzone;
