import { ElementRef } from '@angular/core';
import { AfterAppendSubHtmlDetail, AfterCloseDetail, AfterOpenDetail, AfterSlideDetail, BeforeCloseDetail, BeforeNextSlideDetail, BeforeOpenDetail, BeforePrevSlideDetail, BeforeSlideDetail, ContainerResizeDetail, DragEndDetail, DragMoveDetail, DragStartDetail, InitDetail, PosterClickDetail, SlideItemLoadDetail } from 'lightgallery/lg-events';
import { LightGallerySettings } from 'lightgallery/lg-settings';
import * as i0 from "@angular/core";
export declare class LightgalleryComponent {
    private _elementRef;
    private LG;
    private lgInitialized;
    constructor(_elementRef: ElementRef);
    settings: LightGallerySettings;
    onAfterAppendSlide?: (detail: AfterSlideDetail) => void;
    onInit?: (detail: InitDetail) => void;
    onHasVideo?: (detail: InitDetail) => void;
    onContainerResize?: (detail: ContainerResizeDetail) => void;
    onAfterAppendSubHtml?: (detail: AfterAppendSubHtmlDetail) => void;
    onBeforeOpen?: (detail: BeforeOpenDetail) => void;
    onAfterOpen?: (detail: AfterOpenDetail) => void;
    onSlideItemLoad?: (detail: SlideItemLoadDetail) => void;
    onBeforeSlide?: (detail: BeforeSlideDetail) => void;
    onAfterSlide?: (detail: AfterSlideDetail) => void;
    onPosterClick?: (detail: PosterClickDetail) => void;
    onDragStart?: (detail: DragStartDetail) => void;
    onDragMove?: (detail: DragMoveDetail) => void;
    onDragEnd?: (detail: DragEndDetail) => void;
    onBeforeNextSlide?: (detail: BeforeNextSlideDetail) => void;
    onBeforePrevSlide?: (detail: BeforePrevSlideDetail) => void;
    onBeforeClose?: (detail: BeforeCloseDetail) => void;
    onAfterClose?: (detail: AfterCloseDetail) => void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    private registerEvents;
    static ɵfac: i0.ɵɵFactoryDef<LightgalleryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<LightgalleryComponent, "lightgallery", never, { "settings": "settings"; "onAfterAppendSlide": "onAfterAppendSlide"; "onInit": "onInit"; "onHasVideo": "onHasVideo"; "onContainerResize": "onContainerResize"; "onAfterAppendSubHtml": "onAfterAppendSubHtml"; "onBeforeOpen": "onBeforeOpen"; "onAfterOpen": "onAfterOpen"; "onSlideItemLoad": "onSlideItemLoad"; "onBeforeSlide": "onBeforeSlide"; "onAfterSlide": "onAfterSlide"; "onPosterClick": "onPosterClick"; "onDragStart": "onDragStart"; "onDragMove": "onDragMove"; "onDragEnd": "onDragEnd"; "onBeforeNextSlide": "onBeforeNextSlide"; "onBeforePrevSlide": "onBeforePrevSlide"; "onBeforeClose": "onBeforeClose"; "onAfterClose": "onAfterClose"; }, {}, never, ["*"]>;
}
//# sourceMappingURL=lightgallery-angular.component.d.ts.map