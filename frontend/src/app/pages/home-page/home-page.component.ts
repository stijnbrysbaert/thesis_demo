import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComunicaService } from 'src/app/services/comunica.service';
import { GeojsonApiService } from 'src/app/services/geojson-api.service';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public observable: Observable<any>;
  public subject = new BehaviorSubject<string[]>([]);
  public query: string = `SELECT * {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`;

  constructor(
    private comunicaService: ComunicaService,
    private geojsonService: GeojsonApiService
  ) { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap = () => {
    const map = L.map("map").setView([50.846684, 4.352585], 8);
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "pk.eyJ1Ijoic2JyeXNiYWUiLCJhIjoiY2tocWVqMWdlMDhsNzJzdDB1eXlxb2FsMiJ9.7y2XQ3jh4gmSBhq5BkaWuw",
    }).addTo(map);

    this.geojsonService.get().subscribe((x: any) => {
      const bikeLayer = L.geoJSON().addTo(map);
      bikeLayer.addData(x);

      L.geoJSON(x, {
        onEachFeature: (feature, layer) => layer.bindPopup(feature.properties.name + '<br>Beschikbaar: ' + feature.properties.beschikbaar)
      }).addTo(map);
    });
  }

  public search = () => {
    let items = [];
    this.comunicaService.search(this.query).subscribe(result => {
      result.bindingsStream.on('data', data => {
        items.push(data.get('?s').value);
        this.subject.next(items);
      });
    });
  }
}
