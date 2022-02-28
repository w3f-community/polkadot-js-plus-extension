/* eslint-disable camelcase */
// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
// eslint-disable-next-line header/header
import request from 'umi-request';

import { Chain } from '@polkadot/extension-chains/types';

import { TransferRequest } from '../plusTypes';
 
export function getTxTransfers(_chain: Chain, address: string, pageNum: number, pageSize: number): Promise<TransferRequest> {
  const network = _chain.name.replace(' Relay Chain', '');

  return postReq(`https://${network}.api.subscan.io/api/scan/transfers`, {
    address,
    // from_block: 8658091,
    // to_block: 8684569,
    page: pageNum,
    row: pageSize
  });
}

function postReq(api: string, data: Record<string, any> = {}, option?: Record<string, any>): Promise<TransferRequest> {
  return request.post(api, {
    data,
    ...option
  });
}