/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file name from S3 key
 */
export const getFileName = (key: string): string => {
  return key.split('/').pop() || key;
};

/**
 * Get folder name from S3 prefix
 */
export const getFolderName = (prefix: string): string => {
  return prefix.replace(/\/$/, '').split('/').pop() || prefix;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Create a file input element for triggering file selection
 */
export const createFileInput = (
  multiple: boolean = true,
  accept?: string,
  onChange?: (files: FileList | null) => void
): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = multiple;
  
  if (accept) {
    input.accept = accept;
  }
  
  if (onChange) {
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      onChange(target.files);
    };
  }
  
  return input;
};

/**
 * Trigger file input dialog
 */
export const triggerFileSelect = (
  multiple: boolean = true,
  accept?: string,
  onChange?: (files: FileList | null) => void
): void => {
  const input = createFileInput(multiple, accept, onChange);
  input.click();
};
