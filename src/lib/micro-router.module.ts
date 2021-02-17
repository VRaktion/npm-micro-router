import { MicroRouterService } from './micro-router.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroRouterComponent } from './micro-router.component';



@NgModule({
  declarations: [MicroRouterComponent],
  imports: [
    CommonModule
  ],
  exports: [MicroRouterComponent]
})
export class MicroRouterModule {
  static forRoot(): ModuleWithProviders<MicroRouterModule> {
    return {
      ngModule: MicroRouterModule,
      providers: [
        MicroRouterService
      ]
    }
  }
}
