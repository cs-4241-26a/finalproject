import { PrismaClient, UtilityCategory } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();
const load = (f: string) => JSON.parse(readFileSync(`data/${f}`, 'utf-8'));

// Each createMany is one query. 1000 rows x 4 columns stays well under Postgres' bind-parameter limit.
const CHUNK = 1000;

async function main() {
  const places = load('places.json');
  const providers = load('providers.json');
  const offerings = load('offerings.json');
  console.log(`loaded: ${places.length} places, ${providers.length} providers, ${offerings.length} offerings`);

  // 1. Places: batched inserts (insert-only; existing ZIPs are skipped, not updated)
  console.time('places');
  for (let i = 0; i < places.length; i += CHUNK) {
    await prisma.place.createMany({ data: places.slice(i, i + CHUNK), skipDuplicates: true });
    console.log(`  places ${Math.min(i + CHUNK, places.length)}/${places.length}`);
  }
  console.timeEnd('places');

  // 2. Providers: only ~75 rows, so upsert is fine (and keeps website up to date)
  console.time('providers');
  for (const p of providers) {
    await prisma.provider.upsert({ where: { name: p.name }, update: p, create: p });
  }
  console.timeEnd('providers');

  // Look up every provider id once, instead of one findUniqueOrThrow per offering
  const idByName = new Map<string, number>(
    (await prisma.provider.findMany({ select: { id: true, name: true } })).map((p) => [p.name, p.id]),
  );

  // 3. Offerings: map provider name -> id in memory, then batched inserts
  const rows = offerings.map((o: any) => {
    const providerId = idByName.get(o.provider);
    if (providerId === undefined) throw new Error(`Unknown provider "${o.provider}" (zip ${o.zip})`);
    return {
      zip: o.zip as string,
      providerId,
      category: o.category as UtilityCategory,
      price: (o.price ?? null) as number | null,
    };
  });

  console.time('offerings');
  let created = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const res = await prisma.offering.createMany({ data: rows.slice(i, i + CHUNK), skipDuplicates: true });
    created += res.count;
    console.log(`  offerings ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }
  console.timeEnd('offerings');
  console.log(`done: ${created} offerings created, ${rows.length - created} already present`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());