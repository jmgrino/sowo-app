export interface User {
  uid: string;
  email: string;
  photoUrl?: string;
  displayName?: string;
  isAdmin?: boolean;
  printName?: string;
  empresa?: string;
  descEmpresa?: string;
  web?: string;
  socialLinks?: SocialLink;
  queNecesito?: string;
  queOfrezco?: string;
}

export interface SocialLink {
  [key: string] : string;
}

