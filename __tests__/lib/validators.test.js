import {
  studentSchema,
  registerValidator,
  loginValidator,
  studentUpdateValidator
} from '@/lib/validators';

describe('studentSchema', () => {
  it('should pass with valid data', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      major: 'Computer Science',
    };
    await expect(studentSchema.validate(validData)).resolves.toBeTruthy();
  });

  it('should fail if name is missing', async () => {
    const data = {
      email: 'john@example.com',
      major: 'CS',
    };
    await expect(studentSchema.validate(data)).rejects.toThrow('name is a required field');
  });
});

describe('registerValidator', () => {
  it('should pass with valid data', async () => {
    const validData = {
      name: 'Alice',
      email: 'alice@example.com',
      password: '123456',
      confirmPassword: '123456',
    };
    await expect(registerValidator.validate(validData)).resolves.toBeTruthy();
  });

  it('should fail if passwords do not match', async () => {
    const data = {
      name: 'Bob',
      email: 'bob@example.com',
      password: '123456',
      confirmPassword: '654321',
    };
    await expect(registerValidator.validate(data)).rejects.toThrow('Passwords must match');
  });

  it('should fail if email is invalid', async () => {
    const data = {
      name: 'Charlie',
      email: 'not-an-email',
      password: '123456',
      confirmPassword: '123456',
    };
    await expect(registerValidator.validate(data)).rejects.toThrow('Invalid email address');
  });
});

describe('loginValidator', () => {
  it('should pass with valid data', async () => {
    const validData = {
      email: 'user@example.com',
      password: 'securePass123',
    };
    await expect(loginValidator.validate(validData)).resolves.toBeTruthy();
  });

  it('should fail if email is missing', async () => {
    const data = { password: '123456' };
    await expect(loginValidator.validate(data)).rejects.toThrow('Email is required');
  });
});

describe('studentUpdateValidator', () => {
  it('should pass with optional valid fields', async () => {
    const validData = {
      name: 'Jane',
      major: 'Math',
      address: '123 Street',
      phone: '0123456789',
    };
    await expect(studentUpdateValidator.validate(validData)).resolves.toBeTruthy();
  });

  it('should fail with short major', async () => {
    const data = { major: 'CS' };
    await expect(studentUpdateValidator.validate(data)).rejects.toThrow('Major must be at least 3 characters');
  });

  it('should fail with invalid phone format', async () => {
    const data = { phone: 'abc' };
    await expect(studentUpdateValidator.validate(data)).rejects.toThrow('Phone number must be a valid 10-digit number');
  });
});
