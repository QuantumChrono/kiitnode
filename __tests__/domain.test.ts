describe('KIIT Domain Verification Rules', () => {
  const isKiitEmail = (email: string): boolean => {
    return email.trim().toLowerCase().endsWith('@kiit.ac.in');
  };

  it('accepts valid @kiit.ac.in roll number emails', () => {
    expect(isKiitEmail('2205001@kiit.ac.in')).toBe(true);
    expect(isKiitEmail('2105123@kiit.ac.in')).toBe(true);
  });

  it('rejects external domain emails', () => {
    expect(isKiitEmail('student@gmail.com')).toBe(false);
    expect(isKiitEmail('student@yahoo.com')).toBe(false);
    expect(isKiitEmail('fake@kiit.ac.in.fake.com')).toBe(false);
  });

  it('handles uppercase and whitespace gracefully', () => {
    expect(isKiitEmail(' 2205001@KIIT.AC.IN ')).toBe(true);
  });
});
