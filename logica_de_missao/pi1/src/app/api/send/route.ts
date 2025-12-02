import client from "../../../../lib/mqttServer";

export async function POST(req: Request){
    const {topic, message} = await req.json();
    client.publish(topic, message);

    return Response.json({ok: true})
}