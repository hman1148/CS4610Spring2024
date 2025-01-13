import { FormGroup } from '@angular/forms';

export type State = {
  isDialogVisible: boolean;
  dialogTitle: string;
  userForm: FormGroup | null;
};

export const initialState = (): State => ({
  isDialogVisible: false,
  dialogTitle: '',
  userForm: null,
});
