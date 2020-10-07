import React, { useState, useEffect } from 'react'; //useMemo,
// import { Form } from '@rocketseat/unform'; //, Input
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

export default function Dashboard(props) {

  const [label, setLabel] = useState(['January', 'February', 'March', 'April', 'May']);
  const [dataPositive, setDataPositive] = useState([]);
  const [dataNegative, setDataNegative] = useState([]);
  const [renderChart, setRenderChart] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2020-05-02T00:24:48.897Z'));
  const [endDate, setendDate] = useState(new Date());

  async function getFiltredFata() {
    console.log(startDate.toISOString())
    api.get(`/getFiltredFata/${startDate.toISOString()}/${endDate.toISOString()}`).then(res => { 
      const negative = res.data.Negative.dataNotificacao;
      const positive = res.data.Positive.dataNotificacao;
      const negativeList = []
      const positiveList = []

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
      })

      const negativeSortedList = negativeList.slice().sort((a, b) => a.t - b.t)
      const positiveSortedList = positiveList.slice().sort((a, b) => a.t - b.t)
      console.log('negativeSortedList', negativeSortedList)
      setDataPositive(positiveSortedList)
      setDataNegative(negativeSortedList)
      setRenderChart(true)
    })

  }

  useEffect(() => {
    getFiltredFata();
  }, []);

  async function handleUpdate() {
    getFiltredFata();
  }

  const state = {
    // labels: label,
    datasets: [
      {
        label: 'Data dos resultados dos Testes Positivos',
        fill: false,
        lineTension: 0.5,
        // backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'red',
        borderWidth: 2,
        data: dataPositive
      },
      {
        label: 'Data dos resultados dos Testes Negativos',
        fill: false,
        lineTension: 0.1,
        borderColor: 'blue',
        data: dataNegative
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
      {renderChart && <Line
        data={state}
        options={{
          title: {
            display: true,
            text: 'Evolução dos Testes de COVID-19 no Brasil',
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
      />}
    </div>
  );

}






