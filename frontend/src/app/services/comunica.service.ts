import { Injectable } from '@angular/core';
import { from } from 'rxjs';
declare let Comunica: any;

@Injectable({
  providedIn: 'root'
})
export class ComunicaService {

  constructor() { }

  public search(query: string) {
    return from(Comunica.newEngine().query(query, { 
      sources: [
      'https://bluebike-mapper.azurewebsites.net/bluebike.ttl',
      'https://bluebike-mapper.azurewebsites.net/velo.ttl'
    ] 
    }) as Promise<any>);
  }
}
