import React, { useState } from 'react'; //, useMemo, useEffect
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import DefaultLayout from '../pages/_layouts/default';

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest // será inserido todas as outras propriedades no rest
}) {  
  const Layout = DefaultLayout;
  
  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )} // uma função que recebe todas as propriedades da tela
    />
  );
}

RouteWrapper.defaultProps = {
  isPrivate: false,
};

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired, // o componente tem que ser um elemento react (uma classe) ou uma função
};
