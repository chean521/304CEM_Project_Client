import React, { Component } from 'react';
import PackageInfo from '../../package.json';

class Footer extends Component {
  render = () => {
    return (
      <footer
        className="container-fluid text-center"
        style={{ paddingTop: 10 }}
      >
        <p>
          &copy; Copyright, Oscar Loh. All Right Reserved. Build Version:&nbsp;
          {PackageInfo.version}
        </p>
      </footer>
    );
  };
}

export default Footer;
