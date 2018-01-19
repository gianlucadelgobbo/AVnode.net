import { h } from 'preact';

import TitleForm from '../TitleForm';
import { addEvent } from '../../reducers/actions';

const EventAdd = ({ajaxInProgress}) => {
  return (
    <TitleForm
      label="Add Event"
      placeholder="Name new event"
      ajaxInProgress={ajaxInProgress}
      action={addEvent}
    />
  );
};

export default EventAdd;
