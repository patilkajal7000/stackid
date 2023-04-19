/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it } from 'vitest';
import { render, screen, waitFor } from './shared/utils/test-utils';

import App from './App';

describe('StackIdentity App', () => {
    // describe -> Used to group the test and used to describe what is currently being tested
    it(
        'the title is visible',
        async () => {
            // it or test -> Individual test which is run by Vitest. It can either pass or fail
            // render(<App />);
            const { container } = render(<App />);
            console.log(
                'CONTAINER--------------------------------',
                container.getElementsByClassName('sk-spinner').length,
            );
            await waitFor(() => screen.getByText('Welcome to Stack Identity'), { timeout: 10000 });
            // await waitForElementToBeRemoved(() => container.getElementsByClassName('sk-spinner'));

            // expect(screen.getByText(/Welcome to Stack Identity/i)).toBeInTheDocument();
            // expect -> is used to create assertions. In this context assertions are functions that can be called to assert a statement.
        },
        { timeout: 10000 },
    );
    // it('should increment the count when icon (+) clicked', async () => {
    //     render(<App />);
    //     userEvent.click(screen.getByText('+'));
    //     expect(await screen.findByText(/count is: 1/i)).toBeInTheDocument();
    // });
    // it('should decrement the count when icon (-) clicked', async () => {
    //     render(<App />);
    //     userEvent.click(screen.getByText('-'));
    //     expect(await screen.findByText(/count is: -1/i)).toBeInTheDocument();
    // });
});
