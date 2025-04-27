export function validatePhoto(file) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB
  
    if (!file) return { valid: true };
  
    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: "Only JPEG and PNG files are allowed." };
    }
  
    if (file.size > maxSize) {
      return { valid: false, error: "File size exceeds 2MB." };
    }
  
    return { valid: true };
}