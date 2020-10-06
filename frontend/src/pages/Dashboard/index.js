import React, { useState, useEffect } from 'react'; //useMemo,
// import { Form } from '@rocketseat/unform'; //, Input
import api from '../../services/api';
import { Line } from 'react-chartjs-2';

export default function Dashboard(props) {

  const [label, setLabel] = useState(['January', 'February', 'March', 'April', 'May']);
  const [dataPositive, setDataPositive] = useState([]);
  const [dataNegative, setDataNegative] = useState([]);
  const [renderChart, setRenderChart] = useState(false);

  async function getFiltredFata() {
    api.get('/getFiltredFata/2020-03-01T00:00:00/2020-10-01T00:00:00').then(res => {
      const negative = res.data.Negative.dataNotificacao;
      const positive = res.data.Positive.dataNotificacao;
      const negativeList = []
      const positiveList = []
      // negative != null && negative.forEach(dateString => {
        
      //   if (negativeList.length === 0) {
      //     negativeList.push({t: date, y: 1})
      //   } else {
      //     negativeList.forEach((n, index) => {
      //       console.log(n.t,'->' ,date)
      //       // if (n.t === date ) {
      //       //   console.log("entrou")
      //       //   n[index].y += 1;            
      //       // } 
      //       // else {
      //       //   // console.log(negativeList)
      //       //   negativeList.push({t: date, y: 1});
      //       // }          
      //     })
      //   }
      //   // 
      // });
      // console.log(negativeList)
      positive != null && positive.forEach(dateString => {
        let day = new Date(dateString).getDate();
        let month = new Date(dateString).getMonth() + 1;        
        let year = new Date(dateString).getFullYear();
        let date = new Date(`${year}-${month}-${day}`);

        positiveList.push({t: new Date(date), y: 1});
      })
      negative != null && negative.forEach(dateString => {
        let day = new Date(dateString).getDate();
        let month = new Date(dateString).getMonth() + 1;        
        let year = new Date(dateString).getFullYear();
        let date = new Date(`${year}-${month}-${day}`);
        let indexDateExists;
        negativeList.map((p, index) => { 
          console.log(index, p.t, date);
          if (p.t.getTime() == date.getTime()) { 
            console.log(true); 
            indexDateExists = index;
          } else { indexDateExists = null };
        });
        console.log('indexDateExists', indexDateExists)
        indexDateExists ? negativeList[indexDateExists].y += 1 : negativeList.push({t: new Date(date), y: 1});
        console.log('negativeList', negativeList)        
      })
      console.log(negativeList)
      setDataPositive(positiveList)
      setDataNegative(negativeList)
      setRenderChart(true)
    })

  }

  useEffect(() => {
    getFiltredFata();
  }, []);

  async function handleUpdate() {
    getFiltredFata();
    // inserir datas e fetchAll 
  }

  const state = {
    // labels: label,
    datasets: [
      {
        label: 'Testes Positivos',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'red',
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
      <button className="getData" onClick={handleUpdate}></button>
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






