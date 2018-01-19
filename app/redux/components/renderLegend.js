import { h } from 'preact';

const renderLegend = ({ input, label, type, meta: { touched, error } }) => (
    <div>
      <legend>{input.value}</legend>
    </div>
  );

export default renderLegend;