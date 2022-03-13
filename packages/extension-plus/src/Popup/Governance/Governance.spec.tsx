// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/extension-mocks/chrome';

import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route } from 'react-router';

import Governance from './index';

jest.setTimeout(60000);
ReactDOM.createPortal = jest.fn((modal) => modal);

describe('Testing Governance Home page', () => {
  test('Checking the existence of elements while loading ...', () => {
    const { queryAllByRole, queryByTestId, queryByText } = render(
      <MemoryRouter initialEntries={['/governance']}>
        <Route path='/governance'>
          <Governance className='Amir' />
        </Route>
      </MemoryRouter>
    );

    expect(queryByText('Governance')).toBeTruthy();
    expect(queryByText('Relay chain')).toBeTruthy();
    expect(queryAllByRole('option')).toHaveLength(3);

    expect(queryByText('Democracy')).toBeTruthy();
    expect(queryByText('Proposals and referendums voting')).toBeTruthy();

    expect(queryByText('Council')).toBeTruthy();
    expect(queryByText('Vote for council members or candidates')).toBeTruthy();

    expect(queryByText('Treasury')).toBeTruthy();
    expect(queryByText('Treasury spend proposals voting')).toBeTruthy();

    expect(queryByText('Polkassembly')).toBeTruthy();
    expect(queryByText('Discussion platform for polkadot Governance')).toBeTruthy();

    //   Democracy
    const democarcy = queryByTestId('governance')?.children.item(1) as Element;

    fireEvent.click(democarcy);
    expect(queryByText('Referendums')).toBeTruthy();
    expect(queryByText('Loading referendums ...')).toBeTruthy();

    expect(queryByText('Proposals')).toBeTruthy();
    fireEvent.click(queryByText('Proposals') as Element);
    expect(queryByText('Loading proposals ...')).toBeTruthy();

    fireEvent.click(queryByText('Close') as HTMLElement);

    //  Council
    const council = queryByTestId('governance')?.children.item(2) as Element;

    fireEvent.click(council);

    expect(queryByText('Loading members info ...')).toBeTruthy();

    expect(queryByText('Motions (0/0)')).toBeTruthy();
    fireEvent.click(queryByText('Motions (0/0)') as Element);
    expect(queryByText('Loading motions ...')).toBeTruthy();

    fireEvent.click(queryByText('Close') as Element);

    // TODO: Treasury
  });
});