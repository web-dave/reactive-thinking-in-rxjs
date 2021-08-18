import { Observable, timer } from 'rxjs';

const counter$ = new Observable(function subscribe(observer) {
  let i = 0;
  const interval = setInterval(() => {
    i++;

    observer.next(i);
  }, 1500);
  //   observer.error('Damn');
  //   observer.complete();
  return function unsubscribe() {
    clearInterval(interval);
    observer.complete();
  };
});

const observer = {
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('DONE!!')
};

const sub = counter$.subscribe(observer);
sub.add(timer(5000, 1000).subscribe((data) => console.log('-->', data)));
setTimeout(() => {
  sub.unsubscribe();
}, 12000);
