import React from 'react';
import { render } from '@testing-library/react';

import App from 'App';

describe('<App />', () => {
    test('renders without crashing', () => {
        expect(() => render(<App />)).not.toThrow();
    });

    test('renders correctly', () => {
        const { getByTestId } = render(<App />);

        expect(getByTestId('App-template')).toHaveTextContent('Typescript React App');
    });
});
