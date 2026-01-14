export interface Scans {
  qrId: string;
  userId: string;
  type: string;

  createdAt: string;
  netadata: {
    userAgent: string;
    platform: string;
  };
  scannerId: string;
  rawContent: string;
}

export interface QRCodes {
  uid: string;
  name: string;
  scanCount: number;
  ownerId: string;
  createdAt: string;
  originalUrl: string;
  hashedUrl: string;
  hash: string;
  fgColor: string;
  bgColor: string;
  logo: string;
  workspaceId: string;
  folderId: string | undefined;
}
