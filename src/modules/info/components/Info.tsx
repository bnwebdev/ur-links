import { FC } from "react";
import { useTranslate } from "../../../module-core/i18n-js";

const Info: FC = () => {
  const i18n = useTranslate()

  return <>
    <p>{i18n.t('info.whyHasItMade')}</p>
    <p>{i18n.t('info.whatCanYouDo')}</p>
    <p>{i18n.t('info.ourWhishes')}</p>
  </>
}

export default Info;
