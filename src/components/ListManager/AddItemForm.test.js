import React from 'react';
import { render, screen } from '@testing-library/react'
import AddBookmark from './AddBookmark'

it('have correct fields and button', () => {
    render(<AddBookmark />);

    const usernameField = screen.getByLabelText(/url:/i)
    const passwordField = screen.getByLabelText(/notes/i)
    const submitButton = screen.getByText(/add/i)

    expect(usernameField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
})
