import type { NextApiRequest, NextApiResponse } from "next";

type PrepChange = {
  questionId: string;
  value: unknown;
};

type Body = {
  contractId?: number;
  mode?: "public" | "admin";
  changes: PrepChange[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = (req.body ?? {}) as Partial<Body>;
  const changes = Array.isArray(body.changes) ? body.changes : [];

  // Mock endpoint: no persistence, only echoes what it received.
  return res.status(200).json({
    ok: true,
    received: {
      contractId: body.contractId ?? null,
      mode: body.mode ?? "public",
      changesCount: changes.length,
      changes,
    },
  });
}

