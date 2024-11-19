
interface TemplateApiResponse {
  success: boolean;
  message?: string;
  errors?: any[];
  data?: {
    placeholders?: string[];
    preview?: string;
  };
}

export default TemplateApiResponse;