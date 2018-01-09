import { h } from 'preact';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
    <div>
      {/*console.log('renderField:'+ JSON.stringify(input))*/}
      <label>{label}</label>
      <div>
        <input {...input} placeholder={label} type={type}/>
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );

export default renderField;