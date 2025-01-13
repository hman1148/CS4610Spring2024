import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import {
  patchState,
  signalStore,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { initialStoreState, User } from '../models/user';
import { UserSerivce } from '../services/user.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

const collection: string = 'users';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialStoreState()),
  withEntities({ entity: type<User>(), collection }),
  withMethods(
    (
      store,
      userService = inject(UserSerivce),
      messageService = inject(MessageService)
    ) => ({
      resolveUsers: async () => {
        patchState(store, { isLoading: true });

        const { items } = await firstValueFrom(userService.getUsers());

        if (items) {
          patchState(store, setAllEntities(items, { collection }), {
            users: items,
            isEntitiesLoaded: true,
          });
        }

        const allUsers = store.usersEntities();
        patchState(store, { isLoading: false });
      },

      resolveUser: (user: User) => {
        patchState(store, { currentUser: user });
      },

      getUserbyName: async (name: string) => {
        patchState(store, { isLoading: true });

        userService.getUserByName(name).subscribe({
          next: ({ item, success }) => {
            if (success && item) {
              patchState(store, { currentUser: item });

              messageService.add({
                severity: 'success',
                summary: 'Found User By Name',
                detail: `Found ${item?.name}`,
              });
            } else {
              messageService.add({
                severity: 'error',
                summary: 'Could not find User',
                detail: `Could not find user by ${name}`,
              });
            }
          },
          error: ({ message }) => console.error(message),
          complete: () => patchState(store, { isLoading: false }),
        });
      },

      updateUser: async (id: string, updatedUser: User) => {},

      deleteUser: (id: string) => {},
      submit: () => {},
    })
  )
);
