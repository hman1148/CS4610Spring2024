import {
  addEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import {
  patchState,
  signalStore,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { initialStoreState, initialUser, User } from '../models/user';
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

      addUser: (user: User) => {
        patchState(store, { isLoading: true });

        userService.createUser(user).subscribe({
          next: ({ item, success }) => {
            if (success && item) {
              const currentUsers = store.users();
              currentUsers.push(item);
              patchState(store, { currentUser: item, users: currentUsers });
            }
          },
          error: ({ message }) => console.error(message),
          complete: () => patchState(store, { isLoading: false }),
        });
      },

      updateUser: (id: string, updatedUser: User) => {
        patchState(store, { isLoading: true });

        userService.updateUser(id, updatedUser).subscribe({
          next: ({ item, success }) => {
            if (success) {
              patchState(store, {
                currentUser: item,
                users: store.users().map((user) => {
                  if (user.id == item?.id) {
                    return { ...user, ...item };
                  } else {
                    return user;
                  }
                }),
              });
            }
          },
          error: ({ message }) => console.error(message),
          complete: () => patchState(store, { isLoading: false }),
        });
        patchState(store, { isLoading: true });

        userService.updateUser(id, updatedUser).subscribe({
          next: ({ item, success }) => {
            if (success) {
              patchState(store, {
                currentUser: item,
                users: store.users().map((user) => {
                  if (user.id === item?.id) {
                    return { ...user, ...item };
                  }
                  return user;
                }),
              });

              messageService.add({
                severity: 'success',
                summary: `Updated User: ${updatedUser.name}`,
              });
            } else {
              messageService.add({
                severity: 'error',
                detail: 'Failed to Update User',
              });
            }
          },
          error: ({ message }) => console.error(message),
          complete: () => patchState(store, { isLoading: false }),
        });
      },

      deleteUser: (id: string) => {
        patchState(store, { isLoading: true });

        userService.deleteUser(id).subscribe({
          next: ({ success }) => {
            if (success) {
              messageService.add({
                severity: 'success',
                summary: 'Deleted User',
              });
              patchState(store, { currentUser: initialUser() });
            } else {
              messageService.add({
                severity: 'error',
                summary: 'Failed to delete User',
              });
            }
          },
          error: ({ message }) => console.error(message),
          complete: () => patchState(store, { isLoading: false }),
        });
      },
    })
  )
);
