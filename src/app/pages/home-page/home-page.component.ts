import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import { finalize } from 'rxjs/operators';
import { ComunicaService } from 'src/app/services/comunica.service';
import { GeojsonApiService } from 'src/app/services/geojson-api.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  private map: L.Map;
  public items: any[];
  public isBusy: boolean;
  public sources: { url: string, isChecked: boolean }[];
  public query: string = `  PREFIX ex: <http://example.org/>
  PREFIX 	rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX 	rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX  locn: <http://www.w3.org/ns/locn#>
    PREFIX 	geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX ext:  <https://stijnbrysbaert.github.io/OSLO-extension/vocabulary.ttl#>
    PREFIX trips: <https://data.vlaanderen.be/ns/mobiliteit/trips-en-aanbod#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX geonames: <http://www.geonames.org/ontology#>
    
    SELECT ?label ?vehicles ?docks ?type_name ?lat ?long ?nearby ?dienst {
        ?s a ext:Station ;
           rdfs:label ?label ;
           trips:Transportobject.beschikbaarheid ?beschikbaarheid ;
           locn:geometry ?loc .
        ?loc geo:lat ?lat .
        ?loc geo:long ?long .
        ?beschikbaarheid ext:voertuigTypesBeschikbaar ?vehicles_available ;
                         ext:voertuigDocksBeschikbaar ?docks_available .
        ?vehicles_available ext:aantal ?vehicles ;
                  trips:Resource.vervoermiddel ?type .
        ?type rdfs:label ?type_name .
        ?docks_available ext:aantal ?docks .
        OPTIONAL {?s geonames:nearby ?nearby . }
        OPTIONAL {?s ext:mobiliteitsdienst ?dienst . }
    }`;

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
    //laatste datasource niet default op true zetten
    this.sources[this.sources.length - 1].isChecked = false;
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
  }

  public search = () => {
    this.items = [];
    // TODO: Remove pin points from map
    this.isBusy = true;

    this.comunicaService.search(this.query, this.sources.filter(x => x.isChecked).map(x => x.url)).pipe(
      finalize(() => this.isBusy = false)
    ).subscribe(result => {
      this.items.push(result);
      L.geoJSON(this.geojsonService.mapObject(result), {
        onEachFeature: this.geojsonService.addPopup
      }).addTo(this.map);
    });
  }
}
