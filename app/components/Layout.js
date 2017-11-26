import { h } from 'preact';

const Layout = ({children}) => {
  return (
    <div className="row">
      <div className="col-md-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;
