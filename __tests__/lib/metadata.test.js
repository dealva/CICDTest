import { metadataConfig } from '@/lib/metadata';

describe('metadataConfig', () => {
  it('should have login metadata', () => {
    expect(metadataConfig.login).toEqual({
      title: 'Login | College CRUD App',
      description: 'Login to your account to manage student data',
    });
  });

  it('should have register metadata', () => {
    expect(metadataConfig.register).toEqual({
      title: 'Register | College CRUD App',
      description: 'Create a new account',
    });
  });

  it('should have dashboard metadata', () => {
    expect(metadataConfig.dashboard).toEqual({
      title: 'Dashboard | College CRUD App',
      description: 'Dashboard Experience',
    });
  });

  it('should contain all expected keys', () => {
    expect(Object.keys(metadataConfig)).toEqual(
      expect.arrayContaining(['login', 'register', 'dashboard'])
    );
  });
});
