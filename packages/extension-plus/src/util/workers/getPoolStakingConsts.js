// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */

import getApi from '../getApi.ts';

async function getPoolStackingConsts(endpoint) {
  try {
    const api = await getApi(endpoint);
    const at = await api.rpc.chain.getFinalizedHead();
    const apiAt = await api.at(at);

    const [maxPoolMembers, maxPoolMembersPerPool, maxPools, minCreateBond, minJoinBond, minNominatorBond, lastPoolId] =
      await Promise.all([
        apiAt.query.nominationPools.maxPoolMembers(),
        apiAt.query.nominationPools.maxPoolMembersPerPool(),
        apiAt.query.nominationPools.maxPools(),
        apiAt.query.nominationPools.minCreateBond(),
        apiAt.query.nominationPools.minJoinBond(),
        apiAt.query.staking.minNominatorBond(),
        apiAt.query.nominationPools.lastPoolId()
      ]);

    return {
      lastPoolId: lastPoolId,
      maxPoolMembers: maxPoolMembers.isSome ? maxPoolMembers.unwrap().toNumber() : 0,
      maxPoolMembersPerPool: maxPoolMembersPerPool.isSome ? maxPoolMembersPerPool.unwrap().toNumber() : 0,
      maxPools: maxPools.isSome ? maxPools.unwrap().toNumber() : 0,
      minCreateBond: minCreateBond,
      minJoinBond: minJoinBond,
      minNominatorBond: minNominatorBond
    };
  } catch (error) {
    console.log('something went wrong while getStackingConsts. err: ' + error);

    return null;
  }
}

onmessage = (e) => {
  const { endpoint } = e.data;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  getPoolStackingConsts(endpoint).then((consts) => {
    console.log(`poolStackingConsts in worker using:${endpoint}: %o`, consts);
    postMessage(consts);
  });
};
