export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
  type: "personal" | "team";
  createdAt: string;
}
