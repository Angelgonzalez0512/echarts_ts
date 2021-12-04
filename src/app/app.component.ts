import { Component, ElementRef, Renderer2, ViewChild, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { Chart } from 'chart.js';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { EChartsOption } from 'echarts';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private socket: Socket;
  datachart1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  labelschart1 = ["", "", "", "", "", "", "", "", "", "", "", "","", "", "", "", "", "", "", "", "", "", "", ""]
  chartOption: EChartsOption = {};
  title = 'Temperatura';
  mensaje: string;
  echartsInstance: any;
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
      this.datachart1.shift();
      this.datachart1.push(data.data);
      this.labelschart1.shift();
      this.labelschart1.push(data.label);
      if (this.echartsInstance) {
        this.echartsInstance.setOption({
          series: [{
            data: this.datachart1
          }],
          xAxis: {
            data: this.labelschart1
          }
        });
      }
    });
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

  initChart() {
    this.chartOption={
      title: {
        text: 'Temperatura ' + new Date().getDate() + "/"+new Date().getMonth()+ "/"+new Date().getFullYear()+ " datos de prueba"
      },
      xAxis: {
        type: 'category',
        data: ['', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', ''],
      },
      toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis',
    
        
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          type: 'line',
        },
      ],
      visualMap: {
        top: 50,
        right: 10,
        pieces: [
          {
            gt: 0,
            lte: 15,
            color: 'skyblue'
          },
          
          {
            gt: 15,
            lte: 30,
            color: 'orange'
          },
         
          {
            gt: 30,
            color: 'red'
          }
        ],
        outOfRange: {
          color: '#999'
        }
      },
    };
  }
}
