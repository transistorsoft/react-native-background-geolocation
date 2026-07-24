package com.transistorsoft.rnbackgroundgeolocation;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import com.facebook.react.bridge.JavaOnlyMap;

import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

/**
 * Bridge-translation tests for the React Native Android module — the JS→native marshaling seam.
 *
 * These run on the JVM (Robolectric only for a real {@code org.json} implementation) with no device
 * and no SDK: they exercise the exact {@code ReadableMap → org.json.JSONObject} conversion the real
 * {@code insertLocation} path hands to the native SDK. This is the layer where the bridge-audit
 * findings live (a numeric timestamp must stay a number; nested {@code coords}/{@code extras} must
 * survive), and it is un-catchable by either a JS-only Jest test (mocked native) or a native SDK
 * test (no bridge).
 *
 * The complementary half — the native {@code onSuccess(uuid) → promise.resolve(uuid)} settlement —
 * is trivial glue that needs a live React runtime (RN 0.81's {@code ReactApplicationContext} is
 * abstract and the module constructor initialises the SDK), so it belongs to the on-device E2E
 * layer rather than a JVM unit test.
 */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 34)
public class RNBackgroundGeolocationModuleTest {

    /** A bridge-shaped insertLocation params map: {coords:{lat,lng}, timestamp, extras:{...}}. */
    private JavaOnlyMap makeInsertParams(double timestampMillis) {
        JavaOnlyMap coords = new JavaOnlyMap();
        coords.putDouble("latitude", 45.5152);
        coords.putDouble("longitude", -73.6104);

        JavaOnlyMap extras = new JavaOnlyMap();
        extras.putString("source", "import");

        JavaOnlyMap params = new JavaOnlyMap();
        params.putMap("coords", coords);
        params.putDouble("timestamp", timestampMillis);
        params.putMap("extras", extras);
        return params;
    }

    @Test
    public void mapToJson_preservesNestedCoordsAndExtras() throws Exception {
        JSONObject json = RNBackgroundGeolocationModule.mapToJson(makeInsertParams(1_705_314_600_000d));

        assertTrue("coords must survive as a nested object", json.has("coords"));
        assertEquals(45.5152, json.getJSONObject("coords").getDouble("latitude"), 0.0);
        assertEquals(-73.6104, json.getJSONObject("coords").getDouble("longitude"), 0.0);
        assertEquals("import", json.getJSONObject("extras").getString("source"));
    }

    @Test
    public void mapToJson_keepsNumericTimestampAsNumber_notString() throws Exception {
        // Audit finding: a numeric epoch timestamp must reach the SDK as a NUMBER, so the SDK's
        // epoch branch (TSLocation.normalizeTimestamp `raw instanceof Number`) fires — never a String.
        JSONObject json = RNBackgroundGeolocationModule.mapToJson(makeInsertParams(1_705_314_600_000d));

        Object ts = json.get("timestamp");
        assertTrue("timestamp must be a JSON number, not a String (got " + ts.getClass().getSimpleName() + ")",
                ts instanceof Number);
        assertEquals(1_705_314_600_000L, ((Number) ts).longValue());
    }
}
