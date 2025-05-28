import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '@angular/common';

@Pipe({ name: 'localizedAsset' })
export class LocalizedAssetPipe implements PipeTransform {
  constructor(private location: Location) {}

  transform(assetPath: string): string {
    const currentLang = this.location.path().split('/')[1]; // "es", "en", etc.
    return `/${currentLang}/assets/${assetPath}`;
  }
}
