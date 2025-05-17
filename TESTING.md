# Testing Guide for reVA-web

This document provides guidelines for writing and running tests in the reVA-web project.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test File Structure

- Test files should be placed in a `__tests__` directory adjacent to the files they test
- Test files should be named with the `.test.tsx` or `.test.ts` extension
- Example: For a component at `components/Button.tsx`, the test file should be at `components/__tests__/Button.test.tsx`

## Writing Tests

### Component Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Function Tests

```ts
import { formatDate } from '../utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('January 1, 2023');
  });
});
```

## Mocking

### Mocking Components

```tsx
jest.mock('../ComponentToMock', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mocked-component" />
  };
});
```

### Mocking API Calls

```tsx
jest.mock('../api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'mocked data' })
}));
```

## Best Practices

1. Test behavior, not implementation details
2. Use semantic queries (getByRole, getByLabelText) over getByTestId when possible
3. Write tests that resemble how users interact with your app
4. Keep tests simple and focused on a single behavior
5. Use setup functions to reduce duplication
6. Use descriptive test names that explain the expected behavior

## Coverage Goals

- Aim for at least 80% code coverage
- Focus on testing complex logic and user interactions
- Critical paths should have 100% coverage