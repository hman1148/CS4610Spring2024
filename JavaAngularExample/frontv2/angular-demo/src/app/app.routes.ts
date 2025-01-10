import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { usersResolver } from './resolvers/users/user.resolver';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    resolve: {
      usersResolver: usersResolver,
      }
    },
];
