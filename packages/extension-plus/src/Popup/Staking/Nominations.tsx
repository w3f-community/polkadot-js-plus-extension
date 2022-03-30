// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
/* eslint-disable react/jsx-max-props-per-line */

/**
 * @description here nominated validators are listed, which shows very usefull information/notifications like current active nominator,
 *  oversubscribds, noActive in this era, stuff like that, and also stop/change nomination is provided. 
 * */

import type { StakingLedger } from '@polkadot/types/interfaces';

import { Adjust as AdjustIcon, StopCircle as StopCircleIcon, TrackChanges as TrackChangesIcon } from '@mui/icons-material';
import { Button as MuiButton, Grid } from '@mui/material';
import React, { useCallback } from 'react';

import { DeriveAccountInfo, DeriveStakingQuery } from '@polkadot/api-derive/types';

import { Chain } from '../../../../extension-chains/src/types';
import { NextStepButton } from '../../../../extension-ui/src/components';
import useTranslation from '../../../../extension-ui/src/hooks/useTranslation';
import { Progress } from '../../components';
import { ChainInfo, RebagInfo, StakingConsts, Validators } from '../../util/plusTypes';
import ValidatorsList from './ValidatorsList';

interface Props {
  activeValidator: DeriveStakingQuery | undefined;
  ledger: StakingLedger | null;
  nominatedValidators: DeriveStakingQuery[] | null;
  stakingConsts: StakingConsts | null;
  noNominatedValidators: boolean;
  chain: Chain;
  chainInfo: ChainInfo | undefined;
  validatorsIdentities: DeriveAccountInfo[] | null;
  validatorsInfo: Validators | null;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  handleSelectValidatorsModalOpen: (isSetNominees: boolean) => void;
  handleStopNominating: () => void;
  handleRebag: () => void;
  gettingNominatedValidatorsInfoFromChain: boolean;
  nominatorInfo: { minNominated: bigint, isInList: boolean } | undefined;
  rebagInfo: RebagInfo;
}

export default function Nominations({ activeValidator, chain, chainInfo, gettingNominatedValidatorsInfoFromChain, handleRebag, handleSelectValidatorsModalOpen, handleStopNominating, ledger, noNominatedValidators, nominatedValidators, nominatorInfo, rebagInfo, setState, stakingConsts, state, validatorsIdentities, validatorsInfo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const tuneUpButtonEnable = !noNominatedValidators && nominatorInfo && !nominatorInfo?.isInList && (rebagInfo.shouldRebag || rebagInfo.shouldPutInFrontOf);

  const handleSetNominees = useCallback((): void => {
    setState('setNominees');
    handleSelectValidatorsModalOpen(true);
  }, [handleSelectValidatorsModalOpen, setState]);

  return (
    <>
      {nominatedValidators?.length && stakingConsts && !noNominatedValidators
        ? <Grid container sx={{ p: 0 }}>
          <Grid item xs={12}>
            <ValidatorsList
              activeValidator={activeValidator}
              chain={chain}
              chainInfo={chainInfo}
              height={220}
              stakingConsts={stakingConsts}
              validatorsIdentities={validatorsIdentities}
              validatorsInfo={nominatedValidators}
            />
          </Grid>

          <Grid container item justifyContent='space-between' sx={{ padding: '5px 10px 0px' }} xs={12}>
            <Grid item xs={4}>
              <MuiButton
                onClick={handleStopNominating}
                size='medium'
                startIcon={<StopCircleIcon />}
                sx={{ color: 'black', textTransform: 'none' }}
                variant='text'
              >
                {t('Stop nominating')}
              </MuiButton>
            </Grid>
            {/* <Hint id='rebag' tip='If it takes more than '> */}
            <Grid item xs={4} sx={{ textAlign: 'center' }}>
              <MuiButton
                disabled={!tuneUpButtonEnable}
                onClick={handleRebag}
                size='medium'
                startIcon={<AdjustIcon />}
                sx={{ color: 'red', textTransform: 'none' }}
                variant='text'
              >
                {t('Tune up')}
              </MuiButton>
            </Grid>
            {/* </Hint> */}
            <Grid item sx={{ textAlign: 'right' }} xs={4}>
              <MuiButton
                color='warning'
                onClick={() => handleSelectValidatorsModalOpen(false)}
                size='medium'
                startIcon={<TrackChangesIcon />}
                sx={{ textTransform: 'none' }}
                variant='text'
              >
                {t('Change validators')}
              </MuiButton>
            </Grid>
          </Grid>
        </Grid>
        : !noNominatedValidators
          ? <Progress title={'Loading ...'} />
          : <Grid container justifyContent='center'>
            <Grid sx={{ fontSize: 13, margin: '60px 10px 30px', textAlign: 'center' }} xs={12}>
              {t('No nominated validators found')}
            </Grid>
            <Grid item>
              {chainInfo && stakingConsts && ledger.active >= stakingConsts?.minNominatorBond &&
                <NextStepButton
                  data-button-action='Set Nominees'
                  isBusy={validatorsInfo && state === 'setNominees'}
                  onClick={handleSetNominees}
                >
                  {t('Set nominees')}
                </NextStepButton>
              }
            </Grid>
          </Grid>
      }
    </>
  );
}
