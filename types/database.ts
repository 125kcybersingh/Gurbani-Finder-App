export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      sources: {
        Row: {
          id: number;
          name_english: string;
          name_gurmukhi: string;
          length: number | null;
          created_at: string;
        };
      };
      writers: {
        Row: {
          id: number;
          name_english: string;
          name_gurmukhi: string;
          created_at: string;
        };
      };
      raags: {
        Row: {
          id: number;
          name_english: string;
          name_gurmukhi: string;
          start_ang: number | null;
          end_ang: number | null;
          created_at: string;
        };
      };
      shabads: {
        Row: {
          id: number;
          source_id: number | null;
          writer_id: number | null;
          raag_id: number | null;
          start_ang: number;
          end_ang: number;
          created_at: string;
        };
      };
      lines: {
        Row: {
          id: number;
          shabad_id: number | null;
          source_page: number;
          source_line: number;
          gurmukhi: string;
          transliteration: string | null;
          translation_english: string | null;
          first_letters: string | null;
          first_letters_roman: string | null;
          created_at: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
