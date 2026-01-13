import { AfterViewInit, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifsService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';


@Component({
  selector: 'app-trending-page',
  imports: [
    // GifListComponent
  ],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit {

  public gifsService = inject(GifsService);
  public scrollStateService = inject(ScrollStateService);

  public scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');


  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();

  }



  public onScroll(event: Event) {

    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    // console.log({
    //   scrollTop,
    //   clientHeight,
    //   scrollHeight,
    //   scrollTotal: clientHeight + scrollTop
    // });

    const isAtBottom = (scrollTop + clientHeight + 300) >= scrollHeight;
    this.scrollStateService.trendingScrollState.set(scrollTop);

    // console.log({ scrollTop, isAtBottom });

    if (isAtBottom) {
      this.gifsService.loadTrendingGifs();
    }


  }

}

