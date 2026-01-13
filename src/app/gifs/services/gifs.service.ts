import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";

import { map, Observable, tap } from "rxjs";

import { environment } from "@environments/environment";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "../mapper/gif.mapper";


const GIF_KEY = 'gifs'

const loadFromLoccalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse( gifsFromLocalStorage );

  // console.log( gifs );

  return gifs;

}


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private http = inject(HttpClient);
  public trendingGifs = signal<Gif[]>([]);

  public trendingGifsGroups = computed<Gif[][]>(() => {
    const groups: Gif[][] = [];
    for ( let i = 0; i < this.trendingGifs().length; i += 3 ) {
      groups.push( this.trendingGifs().slice(i, i+3) );
    }
    // console.log( groups );
    return groups;
  });

  public trendingGifsLoading = signal<boolean>(false);
  public searchHistory = signal<Record<string, Gif[]>>( loadFromLoccalStorage() );
  public searchHistoryKeys = computed( () => Object.keys( this.searchHistory() ) );

  private trendingPage = signal<number>(0);

  constructor() {
    this.loadTrendingGifs();
    // console.log('SERVICIO CREADO');
  }

  public saveGifsToLocalStorage = effect(()=>{
    localStorage.setItem(GIF_KEY, JSON.stringify( this.searchHistory() ));
  })


  public loadTrendingGifs(): void {

    if ( this.trendingGifsLoading() ) return;

    this.trendingGifsLoading.set( true );


    this.http.get<GiphyResponse>( `${ environment.giphyUrl }/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20,
      }
    }).subscribe( ( res ) => {

      const gifs = GifMapper.mapGiphyItemsToGifArray( res.data );
      this.trendingGifs.update( tg => [
        ...tg,
        ...gifs
      ]);

      this.trendingPage.update( tp => tp + 1 );
      this.trendingGifsLoading.set( false );

      // console.log({ gifs });

    })

  }


  public searchGifs( query: string ): Observable<Gif[]> {

    return this.http.get<GiphyResponse>( `${ environment.giphyUrl }/gifs/search/`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 20,
      }
    }).pipe(
      map(({ data }) => data ),
      map( ( items ) => GifMapper.mapGiphyItemsToGifArray( items ) ),
      tap( ( items ) => { this.searchHistory.update( sh => ({
        ...sh,
        [query.toLowerCase()]: items,
      }) ) } )
    );

    // .subscribe( ( res ) => {

    //   const gifs = GifMapper.mapGiphyItemsToGifArray( res.data );
    //   console.log({ search: gifs });

    // });



  }


  public getHistoryGifs( query: string ): Gif[] {
    return this.searchHistory()[query] ?? [];
  }


}

