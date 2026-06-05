import Layout from "@layout/index";
import type { ReactElement } from "react";
import { TermsAndConditionsAddPage } from "../features/terms/pages/TermsAndConditionsAddPage";

const TermsAndConditionsAdd = () => <TermsAndConditionsAddPage />;

TermsAndConditionsAdd.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TermsAndConditionsAdd;
