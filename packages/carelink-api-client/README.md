# Carelink API Client

Unofficial TypeScript client for Medtronic CareLink Connect

> The project is in no way related or associated to CareLink, Medtronic or any company. It is only tested on limited devices and locations. Feel free to get in b564
> b564contact and send pull requests.

Based on [minimed-connect-to-nightscout](https://github.com/nightscout/minimed-connect-to-nightscout), [nightscout-connect](https://github.com/nightscout/nightscout-connect/blob/main/lib/sources/minimedcarelink/index.js),
[xDrip](https://github.com/NightscoutFoundation/xDrip/blob/master/app/src/main/java/com/eveningoutpost/dexdrip/cgm/carelinkfollow/client/CareLinkClient.java) and [others](../../README.md#related-projects-and-repositories)

Usage example:

```shell
npm install carelink-api-client
```

```TypeScript
import CarelinkClient from 'carelink-api-client';
import fs from 'node:fs/promises';

async function main(){
    const carelinkClient = new CarelinkClient({
        username: 'username',
        password: 'password',
        countryCode: 'AR'
    });
    await carelinkClient.login();
    const recentData = await carelinkClient.getRecentData();
    await fs.writeFile('./myData.json', JSON.stringify(recentData, null, 4))
}

main();
```

## TypeScript

The typings for the responses were generated using [`maketypes`](https://www.npmjs.com/package/maketypes) based on sample responses obtained from the API Calls. They may not be accurate if those samples were not representative of all response scenarios.

```shell
pnpm dlx maketypes -i src/carelinkv6/types/Profile.ts src/carelinkv6/example-responses/profile.json Profile
```
