# Security Policy

## Supported Versions

We actively support the following versions of SafeBase with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in SafeBase, please follow these steps:

1. **Do not** open a public GitHub issue
2. Email the security team directly at: [your-email@example.com]
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue before making it public.

## Security Best Practices

### For Users

- Always use strong encryption keys (`ENCRYPTION_KEY`)
- Keep your API keys secure and rotate them regularly
- Use environment variables for sensitive configuration
- Regularly update dependencies
- Review backup file permissions

### For Developers

- Never commit secrets or API keys
- Use `.env` files for local development (already in `.gitignore`)
- Review pull requests for security implications
- Follow secure coding practices
- Keep dependencies up to date

## Known Security Considerations

- Database passwords are encrypted at rest using AES-256-GCM
- API endpoints can be protected with `API_KEY` authentication
- Backup files should be stored in a secure location with appropriate permissions
- The scheduler service should run with minimal privileges

## Disclosure Policy

- Security vulnerabilities will be disclosed after a fix is available
- We will credit security researchers who responsibly disclose vulnerabilities
- Critical vulnerabilities will be patched within 7 days when possible

