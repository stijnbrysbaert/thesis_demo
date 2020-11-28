import { Injectable } from '@angular/core';
declare let GeoJSON: any;

@Injectable({
  providedIn: 'root'
})
export class GeojsonApiService {

  // constructor(private http: HttpClient) { }

  // private url = "https://raw.githubusercontent.com/stijnbrysbaert/mapper/master/public/bluebike.geojson";

  // public get(){
  //   return this.http.get(this.url);
  // }
  public addPopup(feature, layer){
    let content = "";
    for(const [key, value] of Object.entries(feature.properties)){
      content += `${key}: ${value}<br>`;
    }
    layer.bindPopup(content);
  }

  public mapObject(data:any){
    return GeoJSON.parse(data, {Point: ['?lat', '?long']});
  }
}
