import {expect, test} from 'vitest'
import app from "../src";
import {EarlRecord} from "../src/utils";

test("fetch the kv of :id", async () => {
    const res = await app.request("http://localhost/hive");
    expect(await res.text()).toBe("");
});

test("adds a new record", async () => {
    const newRecord: EarlRecord = {originPath: 'test', destinationUrl: 'www.target.com'};

    const res = new Request("http://localhost/records/input", {
            method: 'POST',
            body: JSON.stringify(newRecord),
        });

    expect(await res.json()).toEqual(newRecord);
});