export interface UploadFileInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  folder?: string;
}

export interface UploadedFile {
  key: string;
  url: string;
  provider: string;
  originalName: string;
  mimeType: string;
  size: number;
}
