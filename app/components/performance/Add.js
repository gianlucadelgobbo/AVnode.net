import { h } from 'preact';

import TitleForm from '../TitleForm';
import { addPerformance } from '../../reducers/actions';
import { injectIntl, FormattedMessage } from 'preact-intl';

const PerformanceAdd = injectIntl(({ ajaxInProgress, intl }) => {
  return (
    <TitleForm
      label={intl.formatMessage({
        id: 'addPerformance',
        defaultMessage: 'Add Performance'
      })}
      placeholder={intl.formatMessage({
        id: 'nameNewPerformance',
        defaultMessage: 'Name new performance'
      })}
      ajaxInProgress={ajaxInProgress}
      action={addPerformance}
    />
  );
});

export default PerformanceAdd;
