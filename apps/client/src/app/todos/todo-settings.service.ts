import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { scan, shareReplay } from 'rxjs/operators';

export interface TodoSettingsOptions {
  isPollingEnabled: boolean;
  pollingInterval: number;
}

@Injectable()
export class TodoSettings {
  private settings$$ = new BehaviorSubject<Partial<TodoSettingsOptions>>({
    isPollingEnabled: true,
    pollingInterval: 5000
  });
  //  prev =  {
  //     isPollingEnabled: true,
  //     pollingInterval: 5000
  //   }

  //   next={ pollingInterval: 300 }
  settings$ = this.settings$$.pipe(
    scan((prev, next) => ({ ...prev, ...next })),
    shareReplay(1)
  );

  update(updates: Partial<TodoSettingsOptions>) {
    this.settings$$.next(updates);
  }
}
