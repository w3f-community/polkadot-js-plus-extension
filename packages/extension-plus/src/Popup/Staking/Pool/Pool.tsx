// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
/* eslint-disable react/jsx-max-props-per-line */

/**
 * @description
 *
 * */

import type { FrameSystemAccountInfo, PalletNominationPoolsBondedPoolInner, PalletNominationPoolsPoolMember, PalletNominationPoolsRewardPool, PalletStakingNominations } from '@polkadot/types/lookup';
import type { AccountsBalanceType, PoolInfo } from '../../../util/plusTypes';

import { Add as AddIcon, AddCircleOutline as AddCircleOutlineIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, Paper } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { ApiPromise } from '@polkadot/api';

import { Chain } from '../../../../../extension-chains/src/types';
import useTranslation from '../../../../../extension-ui/src/hooks/useTranslation';
import { Progress } from '../../../components';
import ShowPool from './ShowPool';

interface Props {
  chain: Chain;
  api: ApiPromise | undefined;
  poolsInfo: PoolInfo[] | undefined;
  staker: AccountsBalanceType;
  memberInfo: PalletNominationPoolsPoolMember | undefined;
}

interface MyPoolInfo extends PoolInfo {
  poolIndex: number;
}

export default function Pool({ api, chain, memberInfo, poolsInfo, staker }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [info, setInfo] = useState(undefined);
  const [myPool, setMyPool] = useState<MyPoolInfo | undefined>();

  useEffect(() => {
    if (!(api && poolsInfo)) return;
    const myPool = poolsInfo.find((p, index) => index + 1 === memberInfo?.poolId?.toNumber());
    const myPoolIndex = poolsInfo.findIndex((p, index) => index + 1 === memberInfo?.poolId?.toNumber()); // FIXME should do in a better way

    myPoolIndex !== -1 && setMyPool({ poolIndex: myPoolIndex + 1, ...myPool })
  }, [memberInfo, poolsInfo, api]);


  return (
    <Grid container sx={{ p: 0 }}>
      {poolsInfo && api
        ? myPool
          ? <>
            <Paper elevation={2} sx={{ backgroundColor: grey[600], borderRadius: '5px', color: 'white', p: '5px 15px 5px', width: '100%' }}>
              <Grid alignItems='center' container id='header' sx={{ fontSize: 11 }}>
                <Grid item sx={{ textAlign: 'left' }} xs={1}>
                  {t('Index')}
                </Grid>
                <Grid item sx={{ textAlign: 'left' }} xs={4}>
                  {t('Name')}
                </Grid>
                <Grid item sx={{ textAlign: 'left' }} xs={1}>
                  {t('state')}
                </Grid>
                <Grid item sx={{ textAlign: 'center' }} xs={3}>
                  {t('Balance')}
                </Grid>
                <Grid item sx={{ textAlign: 'center' }} xs={2}>
                  {t('Members')}
                </Grid>
                <Grid item sx={{ textAlign: 'center' }} xs={1}>
                  {t('Action')}
                </Grid>
              </Grid>
            </Paper>
            <Box sx={{ bgcolor: 'background.paper', overflowY: 'auto', scrollbarWidth: 'none', width: '100%' }}>
              <Grid id='body' item xs={12}>
                {myPool && myPool?.poolIndex !== -1 &&
                  <Paper elevation={2} sx={{ backgroundColor: '', borderRadius: '10px', mt: '4px', p: '1px 15px 2px 15px' }}>
                    <Grid alignItems='center' container sx={{ fontSize: 11 }}>
                      <Grid item sx={{ textAlign: 'left' }} xs={1}>
                        {myPool.poolIndex}
                      </Grid>
                      <Grid item sx={{ textAlign: 'left' }} xs={4}>
                        {myPool.metadata}
                      </Grid>
                      <Grid alignItems='center' item sx={{ textAlign: 'center' }} xs={1}>
                        {myPool.bondedPools.state}
                      </Grid>
                      <Grid alignItems='center' item sx={{ textAlign: 'center' }} xs={3}>
                        {myPool.bondedPools.points.toHuman()}
                      </Grid>
                      <Grid alignItems='center' item sx={{ textAlign: 'center' }} xs={2}>
                        {myPool.bondedPools.memberCounter}
                      </Grid>
                      <Grid alignItems='center' item sx={{ textAlign: 'center' }} xs={1}>
                        <AddIcon color='warning' fontSize='small' sx={{ cursor: 'pointer' }} />
                      </Grid>
                    </Grid>
                  </Paper>
                }
              </Grid>
            </Box>

            <Grid item sx={{ pt: 1}} xs={12}>
              <Paper elevation={3}>
                <Grid container item justifyContent='flex-start' sx={{ fontSize: 12, p: '10px', textAlign: 'center' }}>

                  <Grid item sx={{ textAlign: 'left' }} xs={12}>
                    <b>{t('Root')}</b>{': '}{myPool.bondedPools.roles.root}
                  </Grid>
                  <Grid item sx={{ pt: '15px' }} xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item sx={{ pb: 1, textAlign: 'left' }} xs={12}>
                    {t('Depositor')}{': '}{myPool.bondedPools.roles.depositor}
                  </Grid>
                  <Grid item sx={{ pb: 1, textAlign: 'left' }} xs={12}>
                    {t('Nominator')}{': '}{myPool.bondedPools.roles.nominator}
                  </Grid>
                  <Grid item sx={{ pb: 1, textAlign: 'left' }} xs={12}>
                    {t('State Toggler')}{': '}{myPool.bondedPools.roles.stateToggler}
                  </Grid>
                  <Grid item sx={{ p: '0px 0px 10px' }} xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item sx={{ pb: 1, textAlign: 'left' }} xs={4}>
                    {t('Balance')}{': '}{myPool.rewardPools.balance}
                  </Grid>
                  <Grid item sx={{ pb: 1, textAlign: 'left' }} xs={4}>
                    {t('Points')}{': '}{myPool.rewardPools.points}
                  </Grid>
                  <Grid item sx={{ pb: 1, textAlign: 'left' }} xs={4}>
                    {t('Total earnings')}{': '}{myPool.rewardPools.totalEarnings}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid container item justifyContent='space-between' sx={{ padding: '5px 10px 0px' }} xs={12}>
              {/* <Grid item sx={{ fontSize: 13, textAlign: 'left' }}>
                <FormControlLabel
                  control={<Checkbox
                    color='default'
                    defaultChecked
                    // onChange={filterOverSubscribeds}
                    size='small'
                  />
                  }
                  label={<Box fontSize={12} sx={{ whiteSpace: 'nowrap' }}>{t('Show only my pools')}</Box>}
                />
              </Grid> */}

              <Grid item>
                <Button
                  // onClick={handleStopNominating}
                  color='warning'
                  size='medium'
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ textTransform: 'none' }}
                  variant='text'
                >
                  {t('Set/Change nominees')}
                </Button>
              </Grid>
            </Grid>
          </>
          : <Grid item sx={{ textAlign: 'center', fontSize: 12, pt: 7 }} xs={12}>
            {t('No active pool found')}
          </Grid>
        : <Progress title={t('Loading pools ....')} />
      }
    </Grid>

  );
}
