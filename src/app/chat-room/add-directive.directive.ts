import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAddDirective]'
})
export class AddDirectiveDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
