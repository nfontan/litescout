import test from "node:test";
import OauthLoginHelper from "./OAuthLoginHelper.js";
import assert from "node:assert";

test.describe("OauthLoginHelper.extractLoginValuesFromHtml", () => {
  test.test("Parses correctly the login response", () => {
    const html = `
        <html>
        <HEAD>
            <META HTTP-EQUIV='PRAGMA' CONTENT='NO-CACHE'>
            <META HTTP-EQUIV='CACHE-CONTROL' CONTENT='NO-CACHE'>
            <TITLE>Login Auto-POST form</TITLE></HEAD>
        <body onLoad="document.forms[0].submit()">
        <NOSCRIPT>Your browser does not support JavaScript. Please click the 'Continue' button below to proceed.</NOSCRIPT><br/>
        <form action="https://mdtlogin.medtronic.com/mmcl/auth/oauth/v2/authorize/consent" method="POST" enctype="application/x-www-form-urlencoded">
            <input type="hidden" name="action" value="consent">
            <input type="hidden" name="sessionID" value="2ba2502a-f1c1-49b8-aaaa-9b94894f9b92">
            <input type="hidden" name="sessionData" value="randomstringthatis.a.session.token">
            <input type="hidden" name="response_type" value="code">
            <input type="hidden" name="response_mode" value="query">
            <NOSCRIPT><INPUT TYPE="SUBMIT" VALUE="Continue"></NOSCRIPT>
        </form>
        </body>
        </html>
        `;
    const actual = OauthLoginHelper.extractLoginValuesFromHtml(html);
    assert.deepEqual(actual, {
      url: "https://mdtlogin.medtronic.com/mmcl/auth/oauth/v2/authorize/consent",
      action: "consent",
      sessionID: "2ba2502a-f1c1-49b8-aaaa-9b94894f9b92",
      sessionData: "randomstringthatis.a.session.token",
      response_type: "code",
      response_mode: "query",
    });
  });
});
