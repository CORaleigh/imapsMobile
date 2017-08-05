import {
  Pipe,
  PipeTransform
} from '@angular/core';
@Pipe({
  name: 'layerfilter',
})
export class LayerFilterPipe implements PipeTransform {
  transform(layer: any, baselayerids: Array < string > ) {
    return baselayerids.indexOf(layer.id) === -1;
  }
}
