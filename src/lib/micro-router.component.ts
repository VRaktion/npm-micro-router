import { Observable } from 'rxjs';
import { Input, Component, OnInit } from '@angular/core';
import { MicroRouterService } from './micro-router.service';

@Component({
  selector: 'mR',
  template: `
    {{(mR.get(cmd, sCmd) | async)}}
  `,
  styles: [
  ]
})
export class MicroRouterComponent implements OnInit {
  @Input() cmd: string = '';
  @Input() sCmd: string = 'main';

  constructor(public mR: MicroRouterService) { }

  ngOnInit(): void {
  }

}
