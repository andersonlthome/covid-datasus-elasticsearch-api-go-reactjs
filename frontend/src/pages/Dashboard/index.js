import React, { useState, useEffect } from 'react'; 
import api from '../../services/api';
import { Line } from 'react-chartjs-2';
import { Grid, Button } from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import './index.css';

export default function Dashboard() {

  const [dataPositive, setDataPositive] = useState([]);
  const [dataNegative, setDataNegative] = useState([]);
  const [dataWithoutTestOrTestResponse, setDataWithoutTestOrTestResponse] = useState([]);  
  const [renderChart, setRenderChart] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2020-05-02T00:24:48.897Z'));
  const [endDate, setendDate] = useState(new Date());
  const [totalPositive, setTotalPositive] = useState(0);
  const [totalNegative, setTotalNegative] = useState(0);
  const [totalWithoutTestOrTestResponse, setTotalWithoutTestOrTestResponse] = useState(0);

  async function getFiltredFata() {
    const before = new Date();
    api.get(`/getFiltredFata/${startDate.toISOString()}/${endDate.toISOString()}`).then(res => {
      const didRequest = new Date();
      console.log('totalTimeRequest: ' + (didRequest.getTime() - before.getTime()))

      const negative = res.data.Negative.dataNotificacao;
      const positive = res.data.Positive.dataNotificacao;
      const WithoutTestOrTestResponse = res.data.WithoutTestOrTestResponse.dataNotificacao;
      const negativeList = [];
      const positiveList = [];
      const WithoutTestOrTestResponseList = [];
      var totalPos = 0;
      var totalNeg = 0;
      var totalW = 0;
      
      positive != null && positive.forEach(dateString => {
        let day = new Date(dateString).getDate();
        let month = new Date(dateString).getMonth() + 1;
        let year = new Date(dateString).getFullYear();
        let date = new Date(`${year}-${month}-${day}`);
        let indexDateExists = null;
        positiveList.map((p, index) => {
          if (p.t.getTime() == date.getTime()) {
            indexDateExists = index;
          }
        });
        indexDateExists != null ?
          positiveList[indexDateExists].y += 1 :
          positiveList.push({ t: new Date(date), y: 1 });

        totalPos += 1;
      })

      negative != null && negative.forEach(dateString => {
        let day = new Date(dateString).getDate();
        let month = new Date(dateString).getMonth() + 1;
        let year = new Date(dateString).getFullYear();
        let date = new Date(`${year}-${month}-${day}`);
        let indexDateExists = null;
        negativeList.map((p, index) => {
          if (p.t.getTime() == date.getTime()) {
            indexDateExists = index;
          }
        });
        indexDateExists != null ?
          negativeList[indexDateExists].y += 1 :
          negativeList.push({ t: new Date(date), y: 1 });

        totalNeg += 1;
      })

      WithoutTestOrTestResponse != null && WithoutTestOrTestResponse.forEach(dateString => {
        let day = new Date(dateString).getDate();
        let month = new Date(dateString).getMonth() + 1;
        let year = new Date(dateString).getFullYear();
        let date = new Date(`${year}-${month}-${day}`);
        let indexDateExists = null;
        WithoutTestOrTestResponseList.map((p, index) => {
          if (p.t.getTime() == date.getTime()) {
            indexDateExists = index;
          }
        });
        indexDateExists != null ?
          WithoutTestOrTestResponseList[indexDateExists].y += 1 :
          WithoutTestOrTestResponseList.push({ t: new Date(date), y: 1 });

        totalW += 1;
      })

      const after = new Date();
      console.log('totalTime: ' + (after.getTime() - before.getTime()))      
      setTotalPositive(totalPos);
      setTotalNegative(totalNeg);
      setTotalWithoutTestOrTestResponse(totalW);
      setDataPositive(positiveList);
      setDataNegative(negativeList);
      setDataWithoutTestOrTestResponse(WithoutTestOrTestResponseList)
      setRenderChart(true);
    })

  }

  useEffect(() => {
    getFiltredFata();
  }, []);

  async function handleUpdate() {    
    getFiltredFata();
  }

  const state = {
    datasets: [
      {
        label: 'Testes Positivos',
        fill: false,
        lineTension: 0.1,
        borderColor: 'red',
        borderWidth: 2,
        data: dataPositive
      },
      {
        label: 'Testes Negativos',
        fill: false,
        lineTension: 0.1,
        borderColor: 'blue',
        data: dataNegative
      },
      {
        label: 'Sem Teste ou Resultado do Teste',
        fill: false,
        lineTension: 0.1,
        borderColor: 'grey',
        data: dataWithoutTestOrTestResponse
      }
    ]
  }

  return (
    <div>
      <div className="getData">
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Atualizar
        </Button>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-start"
              label="Data inicial dos resultados"
              value={startDate}
              onChange={(date) => { setStartDate(date) }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-end"
              label="Data final dos resultados"
              value={endDate}
              onChange={(date) => { setendDate(date) }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </div>
      <br />
      {renderChart && 
        <Line
          data={state}
          options={{
            title: {
              display: true,
              text: 'Evolução dos Testes de COVID-19 no Brasil por data dos resultados',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'bottom'
            },
            scales: {
              xAxes: [{
                type: 'time',
                distribution: 'linear',
                time: {
                  unit: 'month'
                }
              }]
            }
          }}
        />        
      }
      <br/>
      <label>Total de testes positivos no período: {totalPositive}</label><br/>
      <label>Total de testes negativos no período: {totalNegative}</label><br/>
      <label>Total sem testes ou resultado de teste no período: {totalWithoutTestOrTestResponse}</label><br/>
    </div>
  );

}






