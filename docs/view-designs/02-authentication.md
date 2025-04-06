# Authentication Pages Design - Sharebrary

## Overview

Design clean, user-friendly authentication pages for Sharebrary, including login, registration, password reset, and account approval screens. These pages should be simple, secure-looking, and aligned with the overall brand aesthetic.

## Brand Context

- **App Name**: Sharebrary
- **Primary Colors**: Blue (#3b82f6) and green (#10b981)
- **Typography**: Modern, clean sans-serif (Inter)

## Common Elements For All Authentication Pages

- Sharebrary logo at the top
- Clean card-style layout with subtle shadow
- Clear form labels and inputs
- Validation messaging
- Consistent button styles
- Links to toggle between authentication options (e.g., "Need an account? Register" or "Already have an account? Login")
- Option to return to home page

## Login Page

### Layout Requirements

- Email input field with validation
- Password input field with show/hide toggle
- "Remember me" checkbox option
- "Login" primary button (full width)
- "Forgot password?" link
- Social login options:
  - Google login button
  - Facebook login button
- Horizontal divider with "or" text between social logins and email/password form
- Link to registration page
- Brief note about account approval process

### Interaction Notes

- Form validation should happen on input blur and form submission
- Clear error messages for invalid inputs
- Subtle loading state for the login button
- Input focus states

## Registration Page

### Layout Requirements

- Display name input field
- Email input field with validation
- Password input field with show/hide toggle and strength indicator
- Password confirmation field
- Terms and conditions checkbox with link to full terms
- "Register" primary button (full width)
- Social registration options (same as login)
- Link to login page
- Note explaining that new accounts require admin approval

### Interaction Notes

- Real-time password strength indicator
- Email and password validation
- Terms and conditions must be accepted to enable registration
- Success state showing "Registration Complete" with next steps explanation

## Password Reset

### Layout Requirements

- Brief explanation of the password reset process
- Email input field
- "Send Reset Link" primary button
- Back to login link
- Success state showing confirmation that reset email was sent

### Interaction Notes

- Simple form validation
- Clear success messaging
- Loading state during submission

## Account Approval Pending Page

### Layout Requirements

- Friendly illustration indicating waiting/pending state
- Clear headline: "Account Approval Pending"
- Explanation text: "Your account is awaiting administrator approval. This usually takes 1-2 business days. You'll receive an email when your account is approved."
- Secondary message encouraging users to check their email
- "Contact Support" link or button (optional)
- "Return to Home" button

### Interaction Notes

- No interactive elements except the buttons/links
- Could include a simple animation to indicate waiting status

## Responsive Considerations

- All forms should be fully functional and visually appealing on mobile devices
- Input fields should be appropriately sized for touch input on mobile
- Social login buttons should stack on smaller screens if needed
- Card width should adjust based on screen size

## Special Requirements

- Dark/light theme versions of all authentication pages
- Ensure high contrast for accessibility
- Clear focus states for keyboard navigation
- Consider adding subtle brand-related imagery or patterns as background elements
- Field validation should follow best practices for security and usability
