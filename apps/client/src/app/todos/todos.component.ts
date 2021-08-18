import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { first, map, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { Todo } from './models';
import { TodoService } from './todo.service';

@Component({
  selector: 'dos-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit {
  todos$: Observable<Todo[]>;
  todosSource$ = this.todosService
    .loadFrequently()
    .pipe(tap(() => (this.showReload$ = of(true))));
  todosInitial$: Observable<Todo[]>;
  todosMostRecent$: Observable<Todo[]>;

  update$$ = new Subject();
  show$: Observable<boolean>;
  hide$: Observable<boolean>;
  showReload$: Observable<boolean> = of(false);

  constructor(private todosService: TodoService) {}

  ngOnInit(): void {
    // TODO: Control update of todos in App (back pressure)
    this.todos$ = this.update$$.pipe(
      withLatestFrom(this.todosSource$),
      tap((data) => console.log(data)),
      map((data) => data[1]),
      tap((data) => console.log(data)),
      tap(() => (this.showReload$ = of(false)))
    );
    // this.todos$ = this.todosSource$;

    // TODO: Control display of refresh button
  }

  completeOrIncompleteTodo(todoForUpdate: Todo) {
    /*
     * Note in order to keep the code clean for the workshop we did not
     * handle the following subscription.
     * Normally you want to unsubscribe.
     *
     * We just want to focus you on RxJS.
     */
    this.todosService.completeOrIncomplete(todoForUpdate).subscribe();
  }
}
