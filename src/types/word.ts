export interface WordData {
  word: string;
  sound?: {
    uk?: string[];
    us?: string[];
  };
  ipa?: string;
  meaning?: string;
}
