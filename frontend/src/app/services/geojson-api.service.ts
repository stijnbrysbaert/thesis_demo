import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeojsonApiService {

  constructor(private http: HttpClient) { }

  private url = "https://raw.githubusercontent.com/stijnbrysbaert/mapper/master/public/bluebike.geojson";

  public get(){
    return this.http.get(this.url);
  }
}
