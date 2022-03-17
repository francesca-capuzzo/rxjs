import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Data } from '../model/data';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL =
    'https://erddap.emodnet-physics.eu/erddap/tabledap/EP_ERD_INT_RVFL_AL_TS_NRT.csv0?time%2CRVFL%2CRVFL_QC&EP_PLATFORM_ID=%223130579%22';

  private httpOptions = { responseType: 'text' as 'json' }; //oppure 'text' as 'text' ma la get NON deve avere <..>

  constructor(private http: HttpClient) {}

  getApi(): Observable<Data[]> {
    return this.http.get<any>(this.API_URL, this.httpOptions).pipe(
      map((data) => this.parseCSVtoJSON(data)),
      map(this.assignIcon), //può essere scritto con una lambda ma non avendo altri 'this' all'interno della funzione, non è strettamente necessaria
      map((data) => this.assignIconByAverage(data)), //non può essere scritto come map(this.assignIconByAverage) --> ERROR: 'this is undefined' perchè chiamo già il this.calculateAverage all'interno della funzione 
      //--> questo perchè le lambda fanno closure e si ricordano dei parametri che avevano all'interno nel momento in cui sono stati istanziati
      map((data) => data.sort((d1,d2) => d1.date.getTime() - d2.date.getTime())),
    );
  }

  //CSV parse to JSON per l'http get che richiede un json e non può lavorare con un CSV!!!!!
  parseCSVtoJSON(csv: string): any[] {
    const dataArray = [] as Data[]; //oppure const dataArray = Data[] = [];
    const lines = csv.split('\n'); //split on new line

    for (const line of lines) {
      if (line !== '') {
        //questo check mi serve per evitar che l'ultima linea vuota crei un oggetto vuoto e mi risulti NaN
        const dataObject = {} as Data; //in questo caso scrivere const dataObject: Data = {} --> GENERA UN ERRORE perchè Data ha 2 proprità fondamentali (date e value)
        //--> POSSO SCRIVERLO COME:
        //const dataObject: Data = {date: "", value: ""}
        //--> oppure nel Data model metto date? e value? come proprità non obbligatorie
        //oppure lo scrivo come 'as Data'
        const words = line.split(',');
        const date = new Date(words[0]);
        const value = parseFloat(words[1]);
        dataObject.date = date;
        dataObject.value = value;
        dataArray.push(dataObject);
      }
    }
    return dataArray;
    //CON IL FOR NORMALE:
    //   for (let i = 0; i < lines.length; i++) {
    //     const obj = {} as Data;
    //     const currentline = lines[i].split(',');
    //     obj.date = currentline[0];
    //     obj.value = parseFloat(currentline[1]);

    //     dataArray.push(obj);
    //   }
    //   return dataArray;
  }

  assignIcon(seaDataArray: Data[]): Data[] {
    for (let i = 0; i < seaDataArray.length; i++) {
      const element = seaDataArray[i];
      if (i === 0) {
        element.icon = 'start';
      } else {
        const previous = seaDataArray[i - 1];
        if (element.value > previous.value) {
          element.icon = 'up';
        }
        if (element.value < previous.value) {
          element.icon = 'down';
        }
        if (element.value === previous.value) {
          element.icon = 'equal';
        }
      }
    }
    return seaDataArray;
  }


  calculateAverage(seaDataArray: Data[]): number{
    let seaDataArrayAverage = 0;
    for (let i = 0; i < seaDataArray.length; i++) {
      let seaDataValue = seaDataArray[i];
      seaDataArrayAverage = (seaDataArrayAverage + seaDataValue.value);
    }
    seaDataArrayAverage = seaDataArrayAverage / (seaDataArray.length);
    return seaDataArrayAverage;
  }

  assignIconByAverage(seaDataArray: Data[]): Data[] {
    
    let seaDataArrayAverage = this.calculateAverage(seaDataArray);
    for (let i = 0; i < seaDataArray.length; i++) {
      let seaDataValue = seaDataArray[i];

      if ((seaDataArrayAverage === seaDataValue.value)) {
        seaDataValue.icon = 'equal';
      } else if (seaDataValue.value > seaDataArrayAverage) {
        seaDataValue.icon = 'up';
      } else if (seaDataValue.value < seaDataArrayAverage) {
        seaDataValue.icon = 'down';
      }
    }
    console.log(seaDataArrayAverage);
    
    return seaDataArray;
  }


}
