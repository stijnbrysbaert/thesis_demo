import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComunicaService } from 'src/app/services/comunica.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public observable: Observable<any>;
  public subject = new BehaviorSubject<string[]>(['test', 'test2']);
  public items: string[] = [];

  public query: string = `SELECT * {
    ?s ?p <http://dbpedia.org/resource/Belgium>.
    ?s ?p ?o
  } LIMIT 100`;

  public options = {
    layers: [
      tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1Ijoic2JyeXNiYWUiLCJhIjoiY2tocWVqMWdlMDhsNzJzdDB1eXlxb2FsMiJ9.7y2XQ3jh4gmSBhq5BkaWuw",
      })
    ],
    zoom: 8,
    center: latLng(50.846684, 4.352585)
  };

  constructor(private comunicaService: ComunicaService) {

  }

  ngOnInit(): void {

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
