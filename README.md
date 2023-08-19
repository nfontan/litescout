# litescout

This **proof of concept** is the result of trying to answer: "what if... I could get glucose data from carelink, expose it in a [nightscout](https://nightscout.github.io/)-compatible way (json API and simple html visualization), all in the same process, without the need to run a mongodb server".

**Experimental**, light-weight and **very limited**.

This is a monorepo containing multiple packages:

- [carelink-api-client](./packages/carelink-api-client/README.md)
- [carelink-fetcher](./packages/carelink-fetcher/README.md)
- [litescout](./packages/litescout/README.md)

## Installing

Requirements: NodeJS 18+, [pnpm](https://pnpm.io/installation)

```
pnpm install
cp packages/litescout/.sample.env packages/litescout/.env
$EDITOR packages/litescout/.env
pnpm run litescout:migrate
pnpm run litescout
```

## Related projects and repositories

This project is based on other open source software:

- https://github.com/nightscout/minimed-connect-to-nightscout
- https://github.com/paul1956/CareLink
- https://github.com/NightscoutFoundation/xDrip/
- https://github.com/benceszasz/CareLinkJavaClient
- https://github.com/ondrej1024/carelink-python-client
- https://nightscout.github.io/

## Ideas

- Allow saving to influxDb instead of sqlite
