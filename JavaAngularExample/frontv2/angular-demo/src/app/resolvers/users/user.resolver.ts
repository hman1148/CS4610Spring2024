import { ResolveFn, Router } from "@angular/router";
import { User } from "../../models/user";
import { inject } from "@angular/core";
import { UserStore } from '../../stores/user.store';
import { patchState } from '@ngrx/signals';

export const usersResolver: ResolveFn<Promise<User[]>> = async (...args) => {
    const userStore = inject(UserStore);

    if (userStore.isEntitiesLoaded()) {
      return userStore.users();
    }

    try {
      await userStore.resolveUsers();
      return userStore.users();
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export const userResolver: ResolveFn<Promise<User>> = async (...args) => {
    const userStore = inject(UserStore);
    const router = inject(Router);

    const route = args[0];
    const userId = route.params['id'];

    await usersResolver(...args);

    if (!userId) {
        router.navigate(['/'])
    }

    try {
      const foundUser = userStore.users().find((user) => user.id === userId);

      if (!foundUser) {
        console.error("Failed to find user");
        router.navigate(['/']);
        throw new Error("Failed to find User");
      }
      userStore.resolveUser(foundUser);
      return foundUser;

    } catch (error) {
      console.error("Error Resolving user");
      router.navigate(['/']);
      throw error;
    }
}
