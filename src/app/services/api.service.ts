import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Data } from '../data';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpOptions = {
    headers: new HttpHeaders({}),
    responseType: 'text' as 'text',
  };

  constructor(private http: HttpClient) {}

  getApi(): Observable<Data[]> {
    return this.http
      .get(
        'https://erddap.emodnet-physics.eu/erddap/tabledap/EP_ERD_INT_RVFL_AL_TS_NRT.csv0?time%2CRVFL%2CRVFL_QC&EP_PLATFORM_ID=%223130579%22',
        this.httpOptions
      )
      .pipe(map((data) => this.csvJSON(data)));
  }

  csvJSON(csv: string): any[] {
    const lines = csv.split('\n');
    const result = [] as Data[];
    for (let i = 0; i < lines.length; i++) {
      const obj = {} as Data;
      var currentline = lines[i].split(',');
      obj.date = currentline[0];
      obj.value = parseFloat(currentline[1]);

      result.push(obj);
    }
    return result;
  }
}