jest.mock('./hooks/useAuth');
import '@testing-library/jest-dom'
import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react';
import useAuth from './hooks/useAuth';

const mockSignOutFn = jest.fn();

test('Verificando botón de signin', () => {
    useAuth.mockResolvedValue(mockSignOutFn);
    const { getByTestId } = render(<SignIn />);
    fireEvent.click(getByTestId("btn-signin"));
    expect(mockSignOutFn).toBeCalled();
})

test('Verificando comportamientos', () => {
    render(<SignIn />);
    expect(screen.queryByText("Ingresar")).toBeInTheDocument();
})

