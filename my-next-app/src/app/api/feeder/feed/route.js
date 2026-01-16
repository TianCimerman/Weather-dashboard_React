export async function POST(req) {
  const body = await req.json();

  const r = await fetch(`${process.env.PI_FEEDER_URL}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return Response.json(await r.json());
}
