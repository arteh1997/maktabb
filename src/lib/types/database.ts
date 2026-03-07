export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          postcode: string | null;
          subscription_tier: "free" | "starter" | "pro";
          subscription_status: "active" | "past_due" | "cancelled" | "trialing";
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          postcode?: string | null;
          subscription_tier?: "free" | "starter" | "pro";
          subscription_status?: "active" | "past_due" | "cancelled" | "trialing";
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          postcode?: string | null;
          subscription_tier?: "free" | "starter" | "pro";
          subscription_status?: "active" | "past_due" | "cancelled" | "trialing";
          stripe_customer_id?: string | null;
          created_at?: string;
        };
      };
      teachers: {
        Row: {
          id: string;
          school_id: string;
          auth_user_id: string;
          name: string;
          email: string;
          role: "admin" | "teacher";
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          auth_user_id: string;
          name: string;
          email: string;
          role?: "admin" | "teacher";
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          auth_user_id?: string;
          name?: string;
          email?: string;
          role?: "admin" | "teacher";
          is_active?: boolean;
          created_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          teacher_id: string | null;
          year_group: string | null;
          meeting_days: string[] | null;
          academic_year: string;
          archived_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          teacher_id?: string | null;
          year_group?: string | null;
          meeting_days?: string[] | null;
          academic_year: string;
          archived_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          teacher_id?: string | null;
          year_group?: string | null;
          meeting_days?: string[] | null;
          academic_year?: string;
          archived_at?: string | null;
          created_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          date_of_birth: string | null;
          gender: "male" | "female" | null;
          enrolled_at: string;
          archived_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          date_of_birth?: string | null;
          gender?: "male" | "female" | null;
          enrolled_at?: string;
          archived_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          date_of_birth?: string | null;
          gender?: "male" | "female" | null;
          enrolled_at?: string;
          archived_at?: string | null;
          created_at?: string;
        };
      };
      class_enrolments: {
        Row: {
          id: string;
          student_id: string;
          class_id: string;
          enrolled_at: string;
          left_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          class_id: string;
          enrolled_at?: string;
          left_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          class_id?: string;
          enrolled_at?: string;
          left_at?: string | null;
        };
      };
      parents: {
        Row: {
          id: string;
          student_id: string;
          school_id: string;
          auth_user_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          consent_given_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          school_id: string;
          auth_user_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          consent_given_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          school_id?: string;
          auth_user_id?: string | null;
          name?: string;
          email?: string | null;
          phone?: string | null;
          consent_given_at?: string | null;
          created_at?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          student_id: string;
          class_id: string;
          school_id: string;
          date: string;
          status: "present" | "absent" | "late" | "excused";
          marked_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          class_id: string;
          school_id: string;
          date: string;
          status: "present" | "absent" | "late" | "excused";
          marked_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          class_id?: string;
          school_id?: string;
          date?: string;
          status?: "present" | "absent" | "late" | "excused";
          marked_by?: string | null;
          created_at?: string;
        };
      };
      quran_progress: {
        Row: {
          id: string;
          student_id: string;
          class_id: string;
          school_id: string;
          date: string;
          sabaq_surah: string | null;
          sabaq_ayah_from: number | null;
          sabaq_ayah_to: number | null;
          sabqi: string | null;
          manzil: string | null;
          notes: string | null;
          recorded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          class_id: string;
          school_id: string;
          date: string;
          sabaq_surah?: string | null;
          sabaq_ayah_from?: number | null;
          sabaq_ayah_to?: number | null;
          sabqi?: string | null;
          manzil?: string | null;
          notes?: string | null;
          recorded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          class_id?: string;
          school_id?: string;
          date?: string;
          sabaq_surah?: string | null;
          sabaq_ayah_from?: number | null;
          sabaq_ayah_to?: number | null;
          sabqi?: string | null;
          manzil?: string | null;
          notes?: string | null;
          recorded_by?: string | null;
          created_at?: string;
        };
      };
      fee_records: {
        Row: {
          id: string;
          student_id: string;
          school_id: string;
          amount_pence: number;
          due_date: string;
          paid_date: string | null;
          payment_method: "stripe" | "cash" | "bank_transfer" | null;
          stripe_payment_intent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          school_id: string;
          amount_pence: number;
          due_date: string;
          paid_date?: string | null;
          payment_method?: "stripe" | "cash" | "bank_transfer" | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          school_id?: string;
          amount_pence?: number;
          due_date?: string;
          paid_date?: string | null;
          payment_method?: "stripe" | "cash" | "bank_transfer" | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
        };
      };
      homework: {
        Row: {
          id: string;
          class_id: string;
          school_id: string;
          set_by: string | null;
          title: string;
          description: string | null;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          school_id: string;
          set_by?: string | null;
          title: string;
          description?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          school_id?: string;
          set_by?: string | null;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          school_id: string;
          class_id: string | null;
          title: string;
          body: string | null;
          created_by: string | null;
          created_at: string;
          sent_at: string | null;
        };
        Insert: {
          id?: string;
          school_id: string;
          class_id?: string | null;
          title: string;
          body?: string | null;
          created_by?: string | null;
          created_at?: string;
          sent_at?: string | null;
        };
        Update: {
          id?: string;
          school_id?: string;
          class_id?: string | null;
          title?: string;
          body?: string | null;
          created_by?: string | null;
          created_at?: string;
          sent_at?: string | null;
        };
      };
      reports: {
        Row: {
          id: string;
          student_id: string;
          school_id: string;
          term: string;
          academic_year: string;
          generated_by: string | null;
          storage_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          school_id: string;
          term: string;
          academic_year: string;
          generated_by?: string | null;
          storage_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          school_id?: string;
          term?: string;
          academic_year?: string;
          generated_by?: string | null;
          storage_path?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_school_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      get_user_role: {
        Args: Record<string, never>;
        Returns: "admin" | "teacher";
      };
      is_teacher_of_class: {
        Args: { p_class_id: string };
        Returns: boolean;
      };
      is_parent: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_parent_student_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      teacher_role: "admin" | "teacher";
      attendance_status: "present" | "absent" | "late" | "excused";
      gender_type: "male" | "female";
      subscription_tier: "free" | "starter" | "pro";
      subscription_status: "active" | "past_due" | "cancelled" | "trialing";
      payment_method: "stripe" | "cash" | "bank_transfer";
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
