import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { PartnerLandingPageProps } from "./PartnerLandingPage";
import { resolvePartnerLandingRoute } from "../repository/partnersRepository";

const readParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

type PartnerLandingQuery = ParsedUrlQuery & {
  slug?: string | string[];
  occasion?: string | string[];
};

export const getPartnerLandingServerSideProps: GetServerSideProps<
  PartnerLandingPageProps,
  PartnerLandingQuery
> = async (context: GetServerSidePropsContext<PartnerLandingQuery>) => {
  const resolved = resolvePartnerLandingRoute(
    readParam(context.params?.slug),
    readParam(context.params?.occasion),
  );

  if (resolved.state === "redirect") {
    return {
      redirect: {
        destination: resolved.destination,
        permanent: false,
      },
    };
  }

  const forwardedProto = context.req.headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) ?? "https";
  const host = context.req.headers.host;
  const siteUrl = host ? `${protocol}://${host}` : undefined;

  return {
    props: {
      resolved,
      siteUrl: siteUrl ?? null,
      pagePath: context.resolvedUrl,
    },
  };
};
