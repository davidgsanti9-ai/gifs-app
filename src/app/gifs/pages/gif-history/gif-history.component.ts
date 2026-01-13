import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifsService } from '../../services/gifs.service';
import { GifListComponent } from "../../components/gif-list/gif-list.component";

@Component({
  selector: 'gif-history',
  imports: [
    GifListComponent
],
  templateUrl: './gif-history.component.html',
})
export default class GifHistoryComponent {

  public gifService = inject( GifsService );
  public query = toSignal(
    inject(ActivatedRoute ).params.pipe( map( (params) => params['query'] ) )
  );

  public gifsByKey = computed( () => this.gifService.getHistoryGifs( this.query() ) );






}
