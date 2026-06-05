import Layout from "@layout/index";
import type { ReactElement } from "react";
import { TermsAndConditionsEditPage } from "../../features/terms/pages/TermsAndConditionsEditPage";

const TermsAndConditionsEdit = () => <TermsAndConditionsEditPage />;

TermsAndConditionsEdit.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TermsAndConditionsEdit;
