const { program } = require('commander');
const { getIntrospectionQuery, printSchema, buildClientSchema } = require('graphql')
const https = require('https')
const fs = require('fs')

program
  .option('-u, --url <url>', 'http://localhost:3000/graphql')
  .option('-p, --path <path>', './schema.graphql')
  .option('-k, --insecure', false);

program.parse();
const options = program.opts();

const url = new URL(options.url ?? 'http://localhost:3000/graphql')
const outPath = options.path ?? './schema.graphql';
const insecure = options.insecure ?? false;

const query = getIntrospectionQuery();
const agent = new https.Agent({ rejectUnauthorized: !insecure })
// const out = fs.createWriteStream(outPath);

const request = https.request(
  url,
  {
    agent: agent,
    method: 'POST',
  },
  (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    let body = ""

    res.on('data', (d) => {
      body += d;
    });

    res.on('end', () => {
      const json = JSON.parse(body);
      const schema = buildClientSchema(json.data);
      // const schema = buildSchema(body);
      fs.writeFileSync(outPath, printSchema(schema))
    })
  }
)

request.write(JSON.stringify({ query }));
request.end();
