import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, interval, map, Observable, of, range, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public counter = new BehaviorSubject<number>(0);

  constructor() { }

  createInterval(): Observable<string>{
    //interval è un osservabile
    return interval(1000).pipe(
      filter(number => number % 2 === 0),
      map(number => "numero " + number)
    )      
  }

  createTimer(): Observable<string>{
    //parte la prima chiamata a 5 secondi e poi la ripete ogni 2 secondi
    return timer(5000, 2000).pipe(
      filter(number => number % 2 === 0),
      map(number => "numero " + number)
    )
  }

  getObservableArray(): Observable<number[]>{
    const array = [0, 5, 6, 12 , 6];
    //con return of() pongo l'oggetto tra parentesi e lo trasformo in un osservabile
    return of(array).pipe(
      map(array => array.map(number => number+1))
    );
  }


  getRange(): Observable<number>{
    return range(0, 2000).pipe(
      filter(number => number % 2 === 0)
    );
  }


  getCounter():Observable<number>{
    return this.counter.pipe(
      map(number => number * number));
  }



}


//EVENTI -> TIMER E INTERVAL --> ritornano osservabili di un numero --> in questo caso cambiato a stringa perchè c'è "number" + number 

//OSSERVABILI -> tutti gli osservabili (di qualunque tipo -guardare tipi online-) possono avere delle pipe di modifica del dato --> gli operatori arrivano dalla libreria rxjs

//PROMISE (FETCH) -> possono essere sostituite in un osservabile 