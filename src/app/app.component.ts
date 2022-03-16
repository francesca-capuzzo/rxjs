import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { ApiService } from './services/api.service';
import { Data } from './data';
import { Observable, observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  logData: Data[] = [];

  constructor(private dataServ: DataService, private apiServ: ApiService){

  }

  ngOnInit(): any{
    //this.dataServ.createInterval().subscribe(number => console.log('interval',number)); //logga in console un numero crescente ogni secondo 
    //this.dataServ.createTimer().subscribe(number => console.log('timer',number));  //logga in console un numero e basta 

    //this.dataServ.getObservableArray().subscribe(data => console.log(data)); //logga un array di numeri come observable -> utile per utilizzare una pipe di modifica dei dati
    //this.dataServ.getRange().subscribe(data => console.log(data)); //logga tutti i numeri pari da 0 a 2000 --> come da impostazioni del service

    //this.dataServ.counter.subscribe(count => console.log(count)); //logga il counter +1
    //this.dataServ.getCounter().subscribe(count => console.log(count)); //logga il counter * counter;


    this.apiServ.getApi().subscribe(data => this.logData = data);

  }


  incrementCounter(): void{
    this.dataServ.counter.next(this.dataServ.counter.value + 1);
  }

  // arrowUp(): Data{
  //   if (this.logData.value) {
  //   }
  // }


}
