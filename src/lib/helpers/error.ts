import {Auth} from "../../graphql/schema";

export const validateFetchUser = (user: Auth | undefined): string | null => {
  if(!user || user.isDeleted) {
    return `user does not exist`;
  }
  if(!user.active) {
    return `user have been deactivated`;
  }
  return null;
}
