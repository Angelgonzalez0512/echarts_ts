import { Component, Renderer2 } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { EChartsOption } from 'echarts';
declare var tf: any;
import DataEntrenamiento from './data_temperatura';
import AlertaTemperatura from './alerta-temperatura';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private socket: Socket;
  dataentrenamiento: DataEntrenamiento = new DataEntrenamiento();
  datachart1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  datachart2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  labelschart1 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
  chartOption: EChartsOption = {};

  chartOption3: EChartsOption = {};
  mensajeestado: AlertaTemperatura = new AlertaTemperatura(0, "");
  chartOption2: EChartsOption = {};
  a0: any;
  a1: any;
  a2: any;
  title = 'Temperatura';
  mensaje: string;
  echartsInstance: any;
  echartsInstance2: any;
  echartsInstancePrediction: any;
  chart: any;
  user: any;
  messages: any[] = [];
  constructor(private renderer: Renderer2) {
    this.user = this.generateTokenId();
    this.initChart();
    this.mensaje = "";
    this.socket = io(environment.appUrl);
    this.socket.on("connect", () => {
    });
    this.socket.on("onmessage", (response: any) => {
      this.messages.push(response);
    });
    this.socket.on("onupdatedata", (data: any) => {
      console.log(data);
      this.datachart1.shift();
      this.datachart1.push(data.data);
      this.labelschart1.shift();
      this.labelschart1.push(data.label);
      this.datachart2.shift();
      this.datachart2.push(data.data2);
      const predict = this.predict(data.data, data.data2).dataSync();
      if (predict < 22) {
        this.mensajeestado.id=1;
        this.mensajeestado.text = "Sensación térmica baja";
      } else if (predict >= 22 && predict <= 29) {
        this.mensajeestado.id=2;
        this.mensajeestado.text = "Sensación térmica óptima";
      }
      else if (predict > 29) {
        this.mensajeestado.id=3;
        this.mensajeestado.text = "Sensación térmica peligrosa";
      }
      if (this.echartsInstance) {
        this.echartsInstance.setOption({
          series: [{
            data: this.datachart2
          }],
          xAxis: {
            data: this.labelschart1
          }
        });
        this.echartsInstancePrediction.setOption({
          series: [{
            data: [parseInt(predict)]
          }],

        });
        this.echartsInstance2.setOption({
          series: [{
            data: this.datachart1
          }],
          xAxis: {
            data: this.labelschart1
          }
        });
      }
    });
    this.a0 = tf.variable(tf.scalar(Math.random()));
    this.a1 = tf.variable(tf.scalar(Math.random()));
    this.a2 = tf.variable(tf.scalar(Math.random()));
    this.optimization();
  }

  sendMessage() {
    this.socket.emit("message", { message: this.mensaje, id: this.user }, (ev: any) => {
    });
    this.mensaje = "";
  }
  generateTokenId() {
    return Math.random().toString(36).substr(2, 10);
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }
  onChart2Init(ec: any) {
    this.echartsInstancePrediction = ec;
  }
  onChart3Init(ec: any) {
    this.echartsInstance2 = ec;
  }

  initChart() {
    this.chartOption = {
      title: {
        text: 'Temperatura ' + new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear() 
      },
      xAxis: {
        type: 'category',
        data: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      },
      toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
          ,

          magicType: { type: ['line', 'bar'] },
        }
      },
      tooltip: {
        trigger: 'axis',


      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C'
        }
      },
      series: [
        {
          name: 'Temperatura',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          color: 'red'

        },

      ],

    };
    this.chartOption3 = {
      title: {
        text: 'Humedad ' + new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear() 
      },
      xAxis: {
        type: 'category',
        data: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      },
      toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
          ,

          magicType: { type: ['line', 'bar'] },
        }
      },
      tooltip: {
        trigger: 'axis',


      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °%'
        }
      },
      series: [

        {
          name: 'Humedad',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          color: 'blue'
        }
      ],

    };
    this.chartOption2 = {
      title: {
        text: 'PREDICCIÓN DE LA SENSACIÓN TÉRMICA ' 
      },
      xAxis: {
        type: 'category',
        data: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      },
      toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
          ,

        }
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C'
        }
      },
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 60,
          splitNumber: 12,
          itemStyle: {
            color: '#FFAB91'
          },
          progress: {
            show: true,
            width: 30
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 30
            }
          },
          axisTick: {
            distance: -45,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            distance: -52,
            length: 14,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            distance: -20,
            color: '#999',
            fontSize: 20
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '-15%'],
            fontSize: 60,
            fontWeight: 'bolder',
            formatter: '{value} °C',
            color: 'auto'
          },
          data: [
            {
              value: 20
            }
          ]
        },

      ],
      visualMap: {
        top: 50,
        right: 10,
        pieces: [

          {

            lte: 22,
            color: 'blue'
          },
          {
            gt: 22,
            lte: 29,
            color: 'skyblue'
          },


          {
            gt: 29,
            color: 'orange'
          }
        ],

      },

    };

  }
  predict(t: any, h: any) {
    return tf.tidy(() => {
      return this.a2.mul(h).add(this.a1.mul(t)).add(this.a0);
    });
  }
  loss(predictions: any, labels: any) {
    return predictions.sub(labels).square().mean();
  }
  optimization() {
    const learningRate = 0.0001;
    const optimizer = tf.train.sgd(learningRate);
    const numIterations = 1000;
    const errors = [];
    // Ciclo de Optimización
    for (let iter = 0; iter < numIterations; iter++) {
      optimizer.minimize(() => {
        const predsYs = this.predict(this.dataentrenamiento.datat, this.dataentrenamiento.datah);
        const e = this.loss(predsYs, this.dataentrenamiento.datast);
        errors.push(e.dataSync());
        return e;
      });
    }
  }
}
