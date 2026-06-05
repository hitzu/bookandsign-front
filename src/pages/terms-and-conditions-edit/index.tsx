import Layout from "@layout/index";
import type { ReactElement } from "react";
import { TermsAndConditionsEditIndexPage } from "../../features/terms/pages/TermsAndConditionsEditIndexPage";

const TermsAndConditionsEditIndex = () => <TermsAndConditionsEditIndexPage />;

TermsAndConditionsEditIndex.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TermsAndConditionsEditIndex;
