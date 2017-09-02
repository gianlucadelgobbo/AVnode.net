import { h } from 'preact';

const Layout = ({children}) => {
  return (
    <div class="row">
      <div class="col-md-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;
