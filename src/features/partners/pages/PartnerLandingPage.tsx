import Head from "next/head";
import { PartnerLandingAnalytics } from "../components/PartnerLandingAnalytics";
import { PartnerLandingState } from "../components/PartnerLandingState";
import { PartnerLandingView } from "../components/PartnerLandingView";
import { PartnerLandingErrorState, PartnerLandingReadyState } from "../types";

export type PartnerLandingPageProps = {
  resolved: PartnerLandingReadyState | PartnerLandingErrorState;
  siteUrl?: string | null;
  pagePath?: string;
};

const resolveImageUrl = (imageSrc: string | { src: string } | undefined): string | undefined =>
  typeof imageSrc === "string" ? imageSrc : imageSrc?.src;

export const PartnerLandingPage = ({ resolved, siteUrl, pagePath }: PartnerLandingPageProps) => {
  const title =
    resolved.state === "ready"
      ? `${resolved.content.seoTitle} — ${resolved.partner.visibleName}`
      : `${resolved.title} — Brillipoint`;
  const description =
    resolved.state === "ready"
      ? resolved.content.seoDescription
      : resolved.message;

  const heroImage = resolved.state === "ready" ? resolveImageUrl(resolved.content.gallery[0]?.imageSrc) : undefined;
  const ogImage = heroImage && siteUrl ? new URL(heroImage, siteUrl).toString() : undefined;
  const pageUrl = siteUrl && pagePath ? new URL(pagePath, siteUrl).toString() : undefined;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {pageUrl && <meta property="og:url" content={pageUrl} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Head>
      {resolved.state === "ready" ? (
        <>
          <PartnerLandingAnalytics landing={resolved} />
          <PartnerLandingView landing={resolved} />
        </>
      ) : (
        <PartnerLandingState state={resolved} />
      )}
    </>
  );
};

export default PartnerLandingPage;
