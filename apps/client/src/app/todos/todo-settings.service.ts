import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, scan, shareReplay, tap } from 'rxjs/operators';

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
    shareReplay(1),
    distinctUntilChanged(
      (prev, next) =>
        prev.pollingInterval !== next.pollingInterval &&
        prev.isPollingEnabled !== next.isPollingEnabled
    ),
    tap((d) => console.info('!', d))
  );

  update(updates: Partial<TodoSettingsOptions>) {
    console.info('!');
    this.settings$$.next(updates);
  }
}
