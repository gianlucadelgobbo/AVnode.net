import { h } from 'preact';
import { IntlProvider } from 'preact-intl';

const Language = ({children, locale,  messages}) => {
  return (
    <IntlProvider
      defaultLocale="en"
      locale={locale}
      messages={messages}
    >
      {children}
    </IntlProvider>
  );
};

export default Language;
