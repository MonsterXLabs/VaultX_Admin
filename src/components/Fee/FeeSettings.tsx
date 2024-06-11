import React, { FC, useEffect, useState } from 'react';
import { getFeesFromBlockchain, setFeesToBlockchain } from '../../utils/helpers';
import { useActiveAccount } from "thirdweb/react";

interface FeeSettingsProps {}

const FeeSettings: FC<FeeSettingsProps> = () => {
  const [fee, setFee] = useState<string>('');
  const [isFee, setIsFee] = useState<boolean>(false);
  const activeAccount = useActiveAccount();

  const setFees = async (fee: string): Promise<void> => {
    try {
      console.log({ fee });
      await setFeesToBlockchain(fee, activeAccount);
      setIsFee(fee === '0' ? false : true);
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };

  const getFee = async (): Promise<void> => {
    try {
      const fees = await getFeesFromBlockchain();
      setFee((Number(fees) / 100).toString());
      setIsFee(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFee();
  }, []);

  return (
    <>
      <div className="nft__single__switch__box mt-30">
        <div className="nft__switch__text">
          <h6>Fees apply to the marketplace</h6>
        </div>
        <div className="nft__switch">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckChecked"
              checked={isFee}
              onClick={() => setFees('0')}
            />
          </div>
        </div>
      </div>
      <div className="common__edit__proe__wrap mt-20">
        <div className="edit__profilfile__inner__top__blk">
          <div className="edit__profile__inner__title">
            <h5>Fee Rate (Only %)</h5>
          </div>
        </div>
        <div className="row gy-4 gx-3">
          <div className="col-xl-12">
            <div className="single__edit__profile__step link__input">
              <input
                type="text"
                placeholder="Please provide the fee"
                value={fee}
                onChange={(e) =>
                  setFee(
                    Number(e.target.value) >= 0 && Number(e.target.value) < 100 ? e.target.value : '0'
                  )
                }
              />
              <button className="link_ico" type="button">
                <img src="assets/img/cros_ico_1.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="edit__profile__bottom__btn half__width__btn">
        <a href="#" className="cancel">
          Cancel
        </a>
        <a href="#" onClick={() => setFees(fee)}>
          Save
        </a>
      </div>
    </>
  );
};

export default FeeSettings;