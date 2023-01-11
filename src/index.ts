import {Hono} from "hono";
import {EarlRecord, isEmpty} from "./utils";


export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    EARLURL: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
}

// Access to environment values
const app = new Hono<{ Bindings: Env }>()

app.get('/:id', async (c) => {
    const id = c.req.param('id');
    const record = await c.env.EARLURL.get(id);
    if (isEmpty(record)) {
        return c.notFound();
    }
    return c.json({id, record});
})
// Add a record
app.post('/records/input', async (c) => {
    const reqBody: EarlRecord = await c.req.parseBody<EarlRecord>();
    await c.env.EARLURL.put(reqBody.originPath, reqBody.destinationUrl);

    c.newResponse(JSON.stringify(
            await c.env.EARLURL.get(reqBody.originPath)
        ),
        200);
})
app.onError((err, c) => {
    console.error(`${err}`)
    return c.text(err?.stack?.toString() ?? '', 500)
})

export default app