import { Component, input } from '@angular/core';
import { GifItemComponent } from "./gif-item/gif-item.component";
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gif-list',
  imports: [GifItemComponent],
  templateUrl: './gif-list.component.html',
})
export class GifListComponent {


  public gifs = input.required<Gif[]>();

}
