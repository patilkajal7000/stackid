import { Provider } from 'react-redux';
import React, { Component } from 'react';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './scss/style.scss';
import store from './store/store';
import BaseRouter from 'core/container/BaseRouter';
import Toaster from 'shared/components/toastr/Toaster';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 3.6e6,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            onError: (error) => {
                console.log(`App.tsx: `, error);
            },
        },
    },
});

class App extends Component {
    render() {
        return (
            <QueryClientProvider client={queryClient}>
                <CookiesProvider>
                    {' '}
                    <Provider store={store}>
                        <BaseRouter />
                        <Toaster />
                    </Provider>
                </CookiesProvider>
            </QueryClientProvider>
        );
    }
}

export default App;
