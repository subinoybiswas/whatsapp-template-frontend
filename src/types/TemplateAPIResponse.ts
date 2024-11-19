
export interface TemplateApiResponse {
  success: boolean;
  data?: {
    placeholders?: string[];
    preview?: string;
  };
  message?: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}