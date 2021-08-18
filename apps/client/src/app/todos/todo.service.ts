import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectableObservable, interval, Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  map,
  retry,
  retryWhen,
  share,
  switchMap,
  tap
} from 'rxjs/operators';
import { Toolbelt } from './internals';
import { Todo, TodoApi } from './models';
import { TodoSettings } from './todo-settings.service';

const todosUrl = 'http://localhost:3333/api';

@Injectable()
export class TodoService {
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    // exhaustMap
    // switchMap
    // concatMap
    // return interval(5000).pipe(
    //   concatMap(() => this.query()),
    //   share(),
    //   tap({ error: () => this.toolbelt.offerHardReload() })
    // );
    return interval(5000).pipe(
      switchMap(() => this.query()),
      share(),
      tap({ error: () => this.toolbelt.offerHardReload() })
    );
    // return interval(5000).pipe(
    //   exhaustMap(() => this.query()),
    //   share(),
    //   tap({ error: () => this.toolbelt.offerHardReload() })
    // );

    // return this.query().pipe(
    //   share(),
    //   tap({ error: () => this.toolbelt.offerHardReload() })
    // );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<any> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      retryWhen((errr) => errr.pipe(delay(1000))),
      tap((data) => console.log(1, data)),
      map((data) => data.map((d) => this.toolbelt.toTodo(d))),
      tap((data) => console.log(2, data)),
      catchError((data) => {
        console.error(data);
        return this.query();
      })
    );
    // TODO: Apply mapping to fix display of tasks
  }

  create(todo: Todo): Observable<TodoApi> {
    return this.http.post<TodoApi>(todosUrl, todo);
  }

  remove(todoForRemoval: TodoApi): Observable<Todo> {
    return this.http
      .delete<TodoApi>(`${todosUrl}/${todoForRemoval.id}`)
      .pipe(map((todo) => this.toolbelt.toTodo(todo)));
  }

  completeOrIncomplete(todoForUpdate: Todo): Observable<Todo> {
    const updatedTodo = this.toggleTodoState(todoForUpdate);
    return this.http
      .put<TodoApi>(
        `${todosUrl}/${todoForUpdate.id}`,
        this.toolbelt.toTodoApi(updatedTodo)
      )
      .pipe(map((todo) => this.toolbelt.toTodo(todo)));
  }

  private toggleTodoState(todoForUpdate: Todo): Todo {
    todoForUpdate.isDone = todoForUpdate.isDone ? false : true;
    return todoForUpdate;
  }
}
