export async function GET() {
  const r = await fetch(`${process.env.PI_FEEDER_URL}/schedules`);
  return Response.json(await r.json());
}

export async function POST(req) {
  const body = await req.json();

  const r = await fetch(`${process.env.PI_FEEDER_URL}/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return Response.json(await r.json());
}
