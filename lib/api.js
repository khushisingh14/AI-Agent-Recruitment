const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function parseJd(jdText) {
  const response = await fetch(`${API_BASE_URL}/parse-jd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jd_text: jdText }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Could not parse the JD.");
  }

  return payload.parsed;
}

export async function fetchPipeline(jdText) {
  const response = await fetch(`${API_BASE_URL}/pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jd_text: jdText }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Could not fetch pipeline data.");
  }

  return payload;
}

export async function fetchCandidateDetail(candidateId, jdText) {
  const query = new URLSearchParams({ jd_text: jdText });
  const response = await fetch(`${API_BASE_URL}/candidate/${candidateId}?${query.toString()}`);
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Could not fetch candidate detail.");
  }

  return payload;
}
