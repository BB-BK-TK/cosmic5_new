import { getSupabaseServerClient } from "@/lib/supabase-server";

interface SaveReadingBody {
  birthInfo: {
    name?: string;
    calendarType: "solar" | "lunar";
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
    /** 별자리 상승(한글). 출생시간·근사치 없으면 생략 */
    risingSignKo?: string;
  };
  periodKey: string;
  styleKey: string;
  rawPayload: Record<string, unknown>;
  interpretedPayload: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const sb = getSupabaseServerClient();
    if (!sb) return Response.json({ ok: true, skipped: "SUPABASE_SERVICE_ROLE_KEY not configured" });

    const body = (await req.json()) as SaveReadingBody;
    const { birthInfo, periodKey, styleKey, rawPayload, interpretedPayload } = body;
    const birthContext = (rawPayload?.birthContext ?? {}) as {
      resolvedLocation?: { lat?: number; lon?: number; timeZone?: string };
      utcOffsetMinutes?: number;
      solarOffsetMinutes?: number;
    };
    if (!birthInfo?.birthDate || !periodKey || !styleKey) {
      return Response.json({ ok: false, error: "INVALID_REQUEST" }, { status: 400 });
    }

    const rising =
      typeof birthInfo.risingSignKo === "string" && birthInfo.risingSignKo.trim()
        ? birthInfo.risingSignKo.trim()
        : null;
    const risingStorable =
      rising &&
      rising !== "출생시간 필요" &&
      rising !== "정보 부족"
        ? rising
        : null;

    const { data: profile, error: profileError } = await sb
      .from("birth_profiles")
      .insert({
        name: birthInfo.name || null,
        calendar_type: birthInfo.calendarType,
        birth_date: birthInfo.birthDate,
        birth_time: birthInfo.birthTime || null,
        birth_place: birthInfo.birthPlace || null,
        rising_sign_ko: risingStorable,
        birth_lat: birthContext.resolvedLocation?.lat ?? null,
        birth_lon: birthContext.resolvedLocation?.lon ?? null,
        birth_timezone: birthContext.resolvedLocation?.timeZone ?? null,
        utc_offset_minutes: birthContext.utcOffsetMinutes ?? null,
        solar_offset_minutes: birthContext.solarOffsetMinutes ?? null,
      })
      .select("id")
      .single();
    if (profileError || !profile) {
      return Response.json({ ok: false, error: "PROFILE_INSERT_FAILED", detail: profileError?.message }, { status: 500 });
    }

    const { data: requestRow, error: requestError } = await sb
      .from("reading_requests")
      .insert({
        profile_id: profile.id,
        period_key: periodKey,
        style_key: styleKey,
      })
      .select("id")
      .single();
    if (requestError || !requestRow) {
      return Response.json({ ok: false, error: "REQUEST_INSERT_FAILED", detail: requestError?.message }, { status: 500 });
    }

    const requestId = requestRow.id as string;
    const [{ error: rawError }, { error: interpError }] = await Promise.all([
      sb.from("raw_chart_results").insert({ request_id: requestId, payload: rawPayload }),
      sb.from("interpreted_results").insert({ request_id: requestId, payload: interpretedPayload }),
    ]);
    if (rawError || interpError) {
      return Response.json(
        {
          ok: false,
          error: "RESULT_INSERT_FAILED",
          detail: rawError?.message || interpError?.message,
          requestId,
        },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, requestId });
  } catch (e) {
    return Response.json(
      { ok: false, error: "UNKNOWN", detail: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}

