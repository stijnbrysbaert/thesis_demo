import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ComunicaService } from 'src/app/services/comunica.service';
import { GeojsonApiService } from 'src/app/services/geojson-api.service';
import { finalize } from 'rxjs/operators';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  private map;
  public items: any[];
  public isBusy: boolean;
  public bikeLayer: L.GeoJSON<any>;
  public sources: { url: string, isChecked: boolean }[];
  public query: string = `
  PREFIX 	rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX 	rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX  locn: <http://www.w3.org/ns/locn#>
  PREFIX 	geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
  PREFIX ext:  <https://stijnbrysbaert.github.io/OSLO-extension/vocabulary.ttl#>
  PREFIX trips: <https://data.vlaanderen.be/ns/mobiliteit/trips-en-aanbod#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  
  SELECT ?s ?label ?aantal ?lat ?long {
    ?s rdfs:label ?label .
      ?s trips:Transportobject.beschikbaarheid ?beschikbaarheid .
      ?beschikbaarheid ext:voertuigenBeschikbaar ?aantal .
      ?s locn:geometry ?loc .
      ?loc geo:lat ?lat .
      ?loc geo:long ?long .
      
  }LIMIT 5`;

  constructor(
    private comunicaService: ComunicaService,
    private geojsonService: GeojsonApiService,
  ) { }

  ngOnInit(): void {
    this.initMap();
    this.initSources();
  }

  private initSources = () => {
    this.sources = this.comunicaService.sources.map(x => ({ url: x, isChecked: true }));
  }

  private initMap = () => {
    this.map = L.map("map").setView([50.846684, 4.352585], 8);
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "pk.eyJ1Ijoic2JyeXNiYWUiLCJhIjoiY2tocWVqMWdlMDhsNzJzdDB1eXlxb2FsMiJ9.7y2XQ3jh4gmSBhq5BkaWuw",
    }).addTo(this.map);
    this.bikeLayer = L.geoJSON().addTo(this.map);
  }

  public search = () => {
    this.items = [];
    this.bikeLayer.clearLayers();
    this.isBusy = true;

    this.comunicaService.search(this.query, this.sources.filter(x => x.isChecked).map(x => x.url)).pipe(
      finalize(() => this.isBusy = false)
    ).subscribe(result => {
      this.items.push(result);
      this.bikeLayer.addData(this.geojsonService.mapObject(result, this.bikeLayer));
    });
  }
}
