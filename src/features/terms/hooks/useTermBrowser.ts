import { useEffect, useMemo, useState } from "react";
import type {
  GetBrandsResponse,
  GetPackagesResponse,
  GetTermsResponse,
  TermScope,
} from "../../../interfaces";
import {
  getBrandTerms,
  getPackageTerms,
  getTerms,
} from "../../../api/services/termsService";
import { getBrands } from "../../../api/services/brandService";
import { getPackages } from "../../../api/services/packageService";

/**
 * Drives the term browser used on the edit pages: lists terms by scope using
 * the matching endpoint (`/terms?scope=global`, `/terms/brands/:id`,
 * `/terms/packages/:id`) and filters the loaded list client-side.
 */
export function useTermBrowser() {
  const [scope, setScope] = useState<TermScope>("global");
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [packages, setPackages] = useState<GetPackagesResponse[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null
  );
  const [terms, setTerms] = useState<GetTermsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const [brandsResponse, packagesResponse] = await Promise.all([
          getBrands(),
          getPackages({}),
        ]);
        setBrands(brandsResponse);
        setPackages(packagesResponse);
      } catch (error) {
        console.error("Error fetching brands or packages:", error);
      }
    };

    fetchTargets();
  }, []);

  useEffect(() => {
    const fetchTerms = async () => {
      if (scope === "brand" && selectedBrandId === null) {
        setTerms([]);
        return;
      }

      if (scope === "package" && selectedPackageId === null) {
        setTerms([]);
        return;
      }

      setIsLoading(true);

      try {
        let results: GetTermsResponse[] = [];

        if (scope === "global") {
          results = await getTerms({ termScope: "global" });
        } else if (scope === "brand" && selectedBrandId !== null) {
          results = await getBrandTerms(selectedBrandId);
        } else if (scope === "package" && selectedPackageId !== null) {
          results = await getPackageTerms(selectedPackageId);
        }

        setTerms(results);
      } catch (error) {
        console.error("Error fetching terms:", error);
        setTerms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, [scope, selectedBrandId, selectedPackageId]);

  const filteredTerms = useMemo(() => {
    const normalizedFilter = filter.trim().toLowerCase();

    if (!normalizedFilter) {
      return terms;
    }

    return terms.filter(
      (term) =>
        term.title.toLowerCase().includes(normalizedFilter) ||
        term.content.toLowerCase().includes(normalizedFilter)
    );
  }, [terms, filter]);

  const changeScope = (nextScope: TermScope) => {
    setScope(nextScope);
    setFilter("");
    setSelectedBrandId(null);
    setSelectedPackageId(null);
    setTerms([]);
  };

  return {
    scope,
    brands,
    packages,
    selectedBrandId,
    selectedPackageId,
    filter,
    terms: filteredTerms,
    isLoading,
    changeScope,
    setSelectedBrandId,
    setSelectedPackageId,
    setFilter,
  };
}
