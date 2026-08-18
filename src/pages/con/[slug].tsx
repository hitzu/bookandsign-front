import NonLayout from "@layout/NonLayout";
import { ReactElement } from "react";
import PartnerLandingPage, {
  PartnerLandingPageProps,
} from "../../features/partners/pages/PartnerLandingPage";
import { getPartnerLandingServerSideProps } from "../../features/partners/pages/getPartnerLandingServerSideProps";

const PartnerSlugRoute = (props: PartnerLandingPageProps) => (
  <PartnerLandingPage {...props} />
);

PartnerSlugRoute.getLayout = (page: ReactElement) => <NonLayout>{page}</NonLayout>;

export const getServerSideProps = getPartnerLandingServerSideProps;

export default PartnerSlugRoute;
