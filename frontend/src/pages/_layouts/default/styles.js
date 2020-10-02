import styled from 'styled-components';

export const Wrapper = styled.div`
  /* position: fixed; */
  /* min-height: 100vh;  */
  /* position: fixed;
	left: 0;
	top: 64px;
	width: 100%;
	height: 100%; */
  /* ou 100% ? */
  /* background: #f0f0f0; deixado no global */
`;

export const Content = styled.div`
  /* min-height: 100vh;  */

  position: absolute;
  top: 64px;
  @media (max-width: 799px) {
    padding-left: 5%;
    padding-right: 7%;
    padding-top: 30px;
    left: 70px;
    width: calc(100% - 70px);
  }
  @media (min-width: 800px) {
    padding-left: 10%;
    padding-right: 20%;
    padding-top: 50px;
    left: 200px;
    width: calc(100% - 200px);
  }
  /* position: fixed;
	left: 0;
	top: 64px;
	width: 100%;
	height: 100%; */
  /* ou 100% ? */
  /* background: #f0f0f0; deixado no global */
  /* background-color: ${props =>
    (props.type === 'primary' && 'blue') ||
    (props.type === 'danger' && 'red') ||
    (props.type === 'warning' && 'yellow')

  } */
`;
