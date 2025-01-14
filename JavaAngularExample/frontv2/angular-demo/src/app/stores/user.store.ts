import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
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

const collection = 'users';

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
        if (store.isEntitiesLoaded()) {
          return true;
        }

        patchState(store, { isLoading: true });
        try {
          const { items, success } = await firstValueFrom(
            userService.getUsers()
          );

          if (success && items) {
            patchState(store, setAllEntities(items, { collection }), {
              isLoading: false,
              isEntitiesLoaded: true,
            });
          }
        } catch (error) {
          console.error(error);
        }
        return true;
      },

      resolveUser: async (id: number) => {
        const user = store.usersEntities().find((user) => user.id === id);

        patchState(store, {
          currentUser: user,
        });
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
              patchState(store, addEntity(item, { collection }));
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
            if (success && item) {
              patchState(
                store,
                updateEntity({ id: item?.id, changes: item }, { collection })
              );
              messageService.add({
                severity: 'success',
                summary: 'Updated User',
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
        patchState(store, { isLoading: true });
      },

      deleteUser: (id: string) => {
        patchState(store, { isLoading: true });

        userService.deleteUser(id).subscribe({
          next: ({ success }) => {
            if (success) {
              patchState(store, removeEntity(id, { collection }));
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
