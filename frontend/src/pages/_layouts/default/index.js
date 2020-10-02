import React from 'react';
import PropType from 'prop-types';

// import Header from '~/components/Header';
// import SideNav from '~/components/SideNav';
import { Wrapper, Content } from './styles';

export default function DefaultLayout({ children }) {
  return (
    <Wrapper>
      {/* <Header />
      <SideNav /> */}
      <Content>{children}</Content>
    </Wrapper>
  );
}

DefaultLayout.propType = {
  children: PropType.element.isRequired,
};
