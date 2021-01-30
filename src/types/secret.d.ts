export interface Secret {
  id: string;
  authid?: string;
  authSecret: string;
  refreshSecret: string;
  isDeleted: boolean;
  createdAt: Date;
  updateAt: Date;
}