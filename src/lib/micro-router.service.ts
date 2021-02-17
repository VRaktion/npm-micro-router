import { Injectable } from '@angular/core';
import { tap, filter, distinctUntilChanged } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

interface conditionalSubject {
  subject: BehaviorSubject<any>
  enable: BehaviorSubject<boolean>
  started: BehaviorSubject<boolean>
  subscription?: Subscription
}

// TODO: setter checks if subject is enabled
//        enable/disable subjects
// set saveable commands
// storage
// debounce for storage
// subscription -> subscriptions ... for new merge operator (additional to switch)
// changeDetection instead of zone run?

@Injectable({
  providedIn: 'root'
})
export class MicroRouterService {

  subjects: Map<string, Map<string, conditionalSubject>> = new Map()

  constructor() {
  }

  private command(command: string, subCommand: string = 'main'): conditionalSubject {
    if (!this.subjects.has(command)) {
      this.subjects.set(command, new Map())
    }

    if (!this.subjects.get(command)!.has(subCommand)) {
      this.subjects
        .get(command)!
        .set(subCommand, {
          subject: new BehaviorSubject(null),
          enable: new BehaviorSubject<boolean>(true),
          started: new BehaviorSubject<boolean>(false),
        })
    }

    let cS = this.subjects.get(command)!.get(subCommand)!

    return cS
  }

  get(command: string, subCommand: string = 'main'): Observable<any> {
    let cS = this.command(command, subCommand)
    return cS.subject
      .pipe(
        tap(() => {
          let cS = this.command(command, subCommand)
          if (!cS.started.value && cS.subject.observers.length > 0) {
            cS.started.next(true)
          }
        }),
        filter(value => value !== null),
        distinctUntilChanged(),
        // switchMap(enabled => enabled ? cS.subject : EMPTY)
      )
  }

  value(command: string, subCommand: string = 'main'): any {
    return this.command(command, subCommand).subject.getValue()
  }

  set(command: string, subCommand: string = 'main', value: any) {
    let cS = this.command(command, subCommand)
    if (cS.started.value && cS.subject.observers.length < 1) {
      cS.started.next(false)
    }
    cS.subject.next(value)
  }

  toggle(command: string, subCommand: string = 'main') {
    let value = this.command(command, subCommand).subject.getValue()
    if (value) {
      this.set(command, subCommand, !value)
    } else {
      this.set(command, subCommand, true)
    }
  }

  switch(commandIn: string, subCommandIn: string, commandOut: string, subCommandOut: string) {
    let cmdOut = this.command(commandOut, subCommandOut)

    if (cmdOut.subscription !== undefined) {
      cmdOut
        .subscription
        .unsubscribe()
    }

    cmdOut
      .subscription =
      this.get(commandIn, subCommandIn)
        .subscribe(
          value => {
            if (value) {
              this.set(commandOut, subCommandOut, value)
            }
          }
        )
  }

  switchOff(command: string, subCommand: string ) {
    let cmd = this.command(command, subCommand)
    if (cmd.subscription !== undefined) {
      cmd.subscription.unsubscribe()
    } else {
      // this.logger.info("NO PREVIOUS SUBSCRIPTION!")
    }
  }

  startCb(
    command: string,
    subCommand: string,
    startCb: (command: string, subCommand: string) => void) {
    this.command(command, subCommand)
      .started
      .pipe(
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value) {
          startCb(command, subCommand)
        }
      })
  }

  stopCb(
    command: string,
    subCommand: string,
    stopCb: (command: string, subCommand: string) => void) {
    this.command(command, subCommand)
      .started
      .pipe(
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (!value) {
          stopCb(command, subCommand)
        }
      })
  }

  enable(command: string, subCommand: string = 'main') {
    this.command(command, subCommand)
      .enable
      .next(true)
  }

  disable(command: string, subCommand: string = 'main') {
    this.command(command, subCommand)
      .enable
      .next(false)
  }

  //https://rxjs-dev.firebaseapp.com/api/operators/filter

  //https://medium.com/js-in-action/rxjs-pause-and-resume-mighty-switchmap-41d0d1fe1113

}
