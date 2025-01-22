import { IMovements } from "./redux/reducers/acountReducer";

export const checkActive = (mov: IMovements): boolean => {
    if (mov.type != 0 && mov.type != 1) return true;
    if (!mov.pending) return true;
  return false;
};
