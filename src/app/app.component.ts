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
  chartOption: EChartsOption = {}
  title = 'socket';
  mensaje: string;
  echartsInstance: any;
  chart: any;
  user: any;
  messages: any[] = [];
  constructor(private renderer: Renderer2) {
    this.user = this.generateTokenId();
    console.log(this.user);
    this.mensaje = "";
    this.socket = io(environment.appUrl);
    this.socket.on("connect", () => {
    });
    this.socket.on("onmessage", (response: any) => {
      this.messages.push(response);
    });
    this.socket.on("onupdatedata", (data: any) => {
      if (this.echartsInstance) {
        this.echartsInstance.setOption({
          series:[{
            data:data.data
          }],
          xAxis: {
            data: data.labels
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
  ngAfterViewInit() {
    this.initChart();
    
  }
  onChartInit(ec:any) {
    this.echartsInstance = ec;
  }
  public initChart() {
    this.chartOption = {
      title: {
        text: 'Grafico con datos de prueba en tiempo real'
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      toolbox:{
        show:true,
      },
      tooltip: {
        trigger: 'axis'
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [],
          type: 'bar',
        },
      ],
    };
  
    
  }
  

}
