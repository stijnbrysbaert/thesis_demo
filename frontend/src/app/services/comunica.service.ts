import { Injectable } from '@angular/core';
import { from } from 'rxjs';
declare let Comunica: any;

@Injectable({
  providedIn: 'root'
})
export class ComunicaService {

  constructor() { }

  public search(query: string) {
    return from(Comunica.newEngine().query(query, { sources: ['http://fragments.dbpedia.org/2015/en'] }) as Promise<any>);
  }
}
