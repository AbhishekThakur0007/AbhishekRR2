import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InteractiveAvatarTextInput from '../InteractiveAvatarTextInput';

describe('InteractiveAvatarTextInput', () => {
  const mockOnSubmit = jest.fn();
  const mockSetInput = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(
      <InteractiveAvatarTextInput
        label="Test Label"
        placeholder="Test Placeholder"
        input=""
        onSubmit={mockOnSubmit}
        setInput={mockSetInput}
      />
    );

    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  it('calls setInput when typing in the input field', () => {
    render(
      <InteractiveAvatarTextInput
        label="Test Label"
        placeholder="Test Placeholder"
        input=""
        onSubmit={mockOnSubmit}
        setInput={mockSetInput}
      />
    );

    const input = screen.getByPlaceholderText('Test Placeholder');
    fireEvent.change(input, { target: { value: 'test input' } });

    expect(mockSetInput).toHaveBeenCalledWith('test input');
  });

  it('calls onSubmit when clicking the submit button', () => {
    render(
      <InteractiveAvatarTextInput
        label="Test Label"
        placeholder="Test Placeholder"
        input="test input"
        onSubmit={mockOnSubmit}
        setInput={mockSetInput}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockSetInput).toHaveBeenCalledWith('');
  });

  it('calls onSubmit when pressing Enter in the input field', () => {
    render(
      <InteractiveAvatarTextInput
        label="Test Label"
        placeholder="Test Placeholder"
        input="test input"
        onSubmit={mockOnSubmit}
        setInput={mockSetInput}
      />
    );

    const input = screen.getByPlaceholderText('Test Placeholder');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockSetInput).toHaveBeenCalledWith('');
  });

  it('does not call onSubmit when input is empty', () => {
    render(
      <InteractiveAvatarTextInput
        label="Test Label"
        placeholder="Test Placeholder"
        input=""
        onSubmit={mockOnSubmit}
        setInput={mockSetInput}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('renders in disabled state when disabled prop is true', () => {
    render(
      <InteractiveAvatarTextInput
        label="Test Label"
        placeholder="Test Placeholder"
        input=""
        onSubmit={mockOnSubmit}
        setInput={mockSetInput}
        disabled={true}
      />
    );

    const input = screen.getByPlaceholderText('Test Placeholder');
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('renders loading state when loading prop is true', () => {
    render(
      <InteractiveAvatarTextInput
        label="Test Label"
        placeholder="Test Placeholder"
        input=""
        onSubmit={mockOnSubmit}
        setInput={mockSetInput}
        loading={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});