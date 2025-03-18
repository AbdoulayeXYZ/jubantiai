import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], propertyValue: any, propertyName: string): any[] {
    if (!items || !propertyValue) {
      return items;
    }
    
    return items.filter(item => item[propertyName] === propertyValue);
  }
}