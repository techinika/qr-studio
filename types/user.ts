export interface Profile {
  uid: string;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  lastLogin: string;
  defaultWorkspaceId: string;
  language: string;
  timezone: string;
  notificationsEnabled: boolean;
  role: string;
}
