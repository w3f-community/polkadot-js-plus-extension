// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { TxInfo } from '../plusTypes';

export async function signAndSend (
  api: ApiPromise,
  submittable: SubmittableExtrinsic<'promise', ISubmittableResult>,
  _signer: KeyringPair,
  senderAddress: string): Promise<TxInfo> {
  return new Promise((resolve) => {
    console.log('signing and sending a tx ...');
    // eslint-disable-next-line no-void
    void submittable.signAndSend(_signer, async (result) => {
      let txFailed = false;
      let failureText: string;

      console.log(JSON.parse(JSON.stringify(result)));

      if (result.dispatchError) {
        if (result.dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(result.dispatchError.asModule);
          const { docs, name, section } = decoded;

          txFailed = true;
          failureText = `${docs.join(' ')}`;

          console.log(`dispatchError module: ${section}.${name}: ${docs.join(' ')}`);
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          console.log(`dispatchError other reason: ${result.dispatchError.toString()}`);
        }
      }

      if (result.status.isFinalized || result.status.isInBlock) {
        const hash = result.status.isFinalized ? result.status.asFinalized : result.status.asInBlock;
        const signedBlock = await api.rpc.chain.getBlock(hash);
        const blockNumber = signedBlock.block.header.number;
        const txHash = result.txHash.toString();

        // search for the hash of the extrinsic in the block
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        signedBlock.block.extrinsics.forEach(async (ex) => {
          if (ex.isSigned) {
            if (String(ex.signer) == senderAddress) {
              const queryInfo = await api.rpc.payment.queryInfo(ex.toHex(), signedBlock.block.hash);
              const fee = queryInfo.partialFee.toString();

              resolve({ block: Number(blockNumber), failureText, fee, status: txFailed ? 'failed' : 'success', txHash });
            }
          }
        });
      }
    });
  });
}
