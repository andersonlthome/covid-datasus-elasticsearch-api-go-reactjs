import { createGlobalStyle } from 'styled-components';
// import 'react-toastify/dist/ReactToastify.css';
// import 'react-perfect-scrollbar/dist/css/styles.css';

export default createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

  * {
   margin:0;
   padding: 0;
   outline: 0;
   box-sizing: border-box;
  }

  /* tirar contorno por volta do botão, que o chrome faz por padrão */
  *:focus {
    outline: 0;
  }

  html, body, #root {
    height: 100%;
  }

  /* faz as fontes ficarem mais definidas */
  body {
    -webkit-font-smoothing: antialiased;
    background: #fff;
  }

  /* caso esteja sem internet carrega a sans-serif */
  body, input, button {
    font: 14px 'Roboto', sans-serif;
  }

  a {
    text-decoration:none;
  }

  ul {
    list-style: none;
  }

  /* pra ficar com cursos de click */
  button {
    cursor: pointer;
  }

`;
