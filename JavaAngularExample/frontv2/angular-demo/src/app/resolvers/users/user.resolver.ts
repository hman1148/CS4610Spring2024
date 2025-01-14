import { ResolveFn, Router } from '@angular/router';
import { User } from '../../models/user';
import { inject } from '@angular/core';
import { UserStore } from '../../stores/user.store';

export const usersResolver: ResolveFn<Promise<boolean>> = async (...args) => {
  const userStore = inject(UserStore);

  if (!userStore.isLoading() && userStore.isEntitiesLoaded()) {
    return true;
  } else {
    return userStore.resolveUsers();
  }
};

export const userResolver: ResolveFn<Promise<User>> = async (...args) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  await usersResolver(...args);
  const [route] = args;
  const userId = route.params['id'];

  const isLoaded: boolean = await userStore.resolveUser(userId).then(() => {
    return userStore.currentUser() ? true : false;
  });

  if (!isLoaded) {
    // If we couldn't find the current user return
    router.navigate(['/']);
  }
  return userStore.currentUser();
};
