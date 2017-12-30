import { h } from 'preact';

const renderLabel = ({ input, label, type, meta: { touched, error } }) => (
    <div>
      <legend>{input.value}</legend>
    </div>
  );

export default renderLabel;