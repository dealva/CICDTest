import { validatePhoto } from '@/lib/fileValidators';

describe('validatePhoto', () => {
  it('should return valid: true when no file is provided', () => {
    expect(validatePhoto(null)).toEqual({ valid: true });
  });

  it('should return valid: true for a valid JPEG file under 2MB', () => {
    const mockFile = { mimetype: 'image/jpeg', size: 1024 * 1024 }; // 1MB
    expect(validatePhoto(mockFile)).toEqual({ valid: true });
  });

  it('should return valid: true for a valid PNG file under 2MB', () => {
    const mockFile = { mimetype: 'image/png', size: 500 * 1024 }; // 500KB
    expect(validatePhoto(mockFile)).toEqual({ valid: true });
  });

  it('should reject files with invalid mimetypes', () => {
    const mockFile = { mimetype: 'application/pdf', size: 1024 };
    expect(validatePhoto(mockFile)).toEqual({
      valid: false,
      error: 'Only JPEG and PNG files are allowed.',
    });
  });

  it('should reject files larger than 2MB', () => {
    const mockFile = { mimetype: 'image/jpeg', size: 3 * 1024 * 1024 }; // 3MB
    expect(validatePhoto(mockFile)).toEqual({
      valid: false,
      error: 'File size exceeds 2MB.',
    });
  });
});
