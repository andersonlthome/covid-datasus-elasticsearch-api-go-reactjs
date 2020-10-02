import React, { useState, useEffect } from 'react'; //useMemo,
// import { Form } from '@rocketseat/unform'; //, Input
import api from '../../services/api';
import { Line } from 'react-chartjs-2';
// // var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Dashboard(props) {

  const [label, setLabel] = useState(['January', 'February', 'March', 'April', 'May']);
  const [dataPositive, setDataPositive] = useState([65, 59, 80, 81, 56]);
  const [dataNegative, setDataNegative] = useState([12, 32, 54, 12, 1]);

  async function fetchAll() {
    // api.post('/getDataPositive',dataPositive);

  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleUpdate() {
    // inserir datas e fetchAll 
  }

  const state = {
    labels: label,
    datasets: [
      {
        label: 'Testes Positivos',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(1312,312312,321,1)',
        borderWidth: 2,
        data: dataPositive
      },
      {
        label: 'Testes Negativos',
        fill: false,
        lineTension: 0.1,
        borderColor: 'rgba(12,4321,233,1)',
        data: dataNegative
      }
    ]
  }

  return (
    <div>
      <Line
        data={state}
        options={{
          title: {
            display: true,
            text: 'Evolução dos Testes de COVID-19 no Brasil',
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'right'
          }
        }}
      />
    </div>
  );

}






