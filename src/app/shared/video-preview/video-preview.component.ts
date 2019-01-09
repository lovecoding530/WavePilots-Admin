import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'video-preview',
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.css']
})
export class VideoPreviewComponent implements OnInit {
  
  @Input() videoUrl: string;
  @Input() width: number;
  @Input() height: number;

  baseUrl: string = 'https://www.youtube.com/embed/';
  embedUrl: SafeResourceUrl;
  constructor(private santizer: DomSanitizer) {}

  ngOnInit() {
    let videoId = (this.videoUrl) ? this.videoUrl.split('=').pop() : '';
    this.embedUrl = this.santizer.bypassSecurityTrustResourceUrl(this.baseUrl + videoId);
  }

}
