import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, map, of } from 'rxjs';
import { Md5 } from 'ts-md5';
import { Hero } from '../models/Hero';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private privateKey = '44ab38ee45dc76e04e7c70b440e9ba077863c640';
  private publicKey = '29d39d61619e4bf1c56a9a8792349c30';
  private baseUrl = 'https://gateway.marvel.com/v1/public';

  constructor(private http: HttpClient) {}

  searchHeroes(searchQuery: string = '', page: number = 0, pageSize: number = 20): Observable<any[]> {
    const limit = pageSize;
    const offset = page * pageSize;
    const heroes: any[] = [];
  
    const fetchHeroesRecursive = (currentOffset: number): Observable<any[]> => {
      const timestamp = new Date().getTime().toString();
      const hash = Md5.hashStr(timestamp + this.privateKey + this.publicKey).toString();
      let url = `${this.baseUrl}/characters?apikey=${this.publicKey}&ts=${timestamp}&hash=${hash}&offset=${currentOffset}&limit=${limit}`;
      
      if (searchQuery) {
        url += `&nameStartsWith=${searchQuery}`;
      }
  
      return this.http.get<any>(url).pipe(
        concatMap(response => {
          const fetchedHeroes = response.data.results;
          heroes.push(...fetchedHeroes);
          const total = response.data.total;
          const nextOffset = currentOffset + fetchedHeroes.length;
          return of(heroes)
        })
      );
    };
  
    return fetchHeroesRecursive(offset);
  }
  

  createHero(hero: Hero): Observable<any> {
    return this.http.post(this.baseUrl, hero)
    .pipe(map((res) => res))
  }

  editHero(id: number, data: Hero): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteHero(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  } 
}
