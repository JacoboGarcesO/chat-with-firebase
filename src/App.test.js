import '@testing-library/jest-dom'
import { SignIn } from './App';
import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'


test('Verificando comportamientos', () => {
    render(<SignIn />);
    expect(screen.queryByText("Ingresar")).toBeInTheDocument();
})

test('Verificando botón de signin', () => {
    render(<SignIn />);
    expect(screen.queryByTestId("btn-signin")).toBeDefined();
    fireEvent.click(screen.queryByTestId("btn-signin"))
})
