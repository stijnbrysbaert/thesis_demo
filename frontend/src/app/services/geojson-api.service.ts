import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
declare let GeoJSON: any;
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeojsonApiService {

  // constructor(private http: HttpClient) { }

  // private url = "https://raw.githubusercontent.com/stijnbrysbaert/mapper/master/public/bluebike.geojson";

  // public get(){
  //   return this.http.get(this.url);
  // }


  public mapObject(data:any){
    return GeoJSON.parse(data, {Point: ['?lat', '?long']});
  }
}
