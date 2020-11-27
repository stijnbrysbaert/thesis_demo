import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
declare let Comunica: any;

@Injectable({
  providedIn: 'root'
})
export class ComunicaService {

  constructor(private ngZone: NgZone) { }

  public sources = [
    'https://bluebike-mapper.azurewebsites.net/bluebike.ttl',
    'https://bluebike-mapper.azurewebsites.net/velo.ttl'
  ]

  public search(query: string, sources: string[]) {
    const subject = new Subject()

    Comunica.newEngine().query(query, { sources: sources }).then(result => {
      result.bindingsStream.on('end', data => {
        this.ngZone.run(() => subject.complete());
      });
  
      result.bindingsStream.on('data', data => {
        let o = {};
        data._root.entries.forEach(term => {
          o[term[0]] = data.get(term[0]).value;
        });
  
        this.ngZone.run(() => subject.next(o));
      });
    });
    
    return subject.asObservable();
  }
}
