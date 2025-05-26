export interface BuilderScore {
  id: string;
  fid: string;
  isVerified: boolean;
  talentScore: number;
  createdAt: Date;
  updatedAt: Date;
  profilePicture?: string;
  name?: string;
  totalScore: number;
}
