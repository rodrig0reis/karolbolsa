import { prisma } from "../src/lib/prisma"

async function patchCategories() {
  console.log("Iniciando patch de categorias...")

  // 1. Bolsas
  let bolsas = await prisma.category.findUnique({ where: { slug: "bolsas" } })
  if (!bolsas) {
    bolsas = await prisma.category.create({
      data: { name: "Bolsas", slug: "bolsas" }
    })
  }
  await prisma.category.update({
    where: { id: bolsas.id },
    data: { parentId: null, showInMainMenu: true, showOnHome: true, sortOrder: 10 }
  })

  // Subcategorias de Bolsas
  const bolsasSubs = [
    { name: "Bolsas de Praia", slug: "bolsas-de-praia", sortOrder: 11, home: true },
    { name: "Bolsas Transversais", slug: "bolsas-transversais", sortOrder: 12, home: false },
    { name: "Bolsas de Mão", slug: "bolsas-de-mao", sortOrder: 13, home: false },
    { name: "Bolsas Artesanais", slug: "bolsas-artesanais", sortOrder: 14, home: false },
    { name: "Mochilas", slug: "mochilas", sortOrder: 15, home: false },
  ]

  for (const sub of bolsasSubs) {
    let cat = await prisma.category.findUnique({ where: { slug: sub.slug } })
    if (!cat) {
      cat = await prisma.category.create({ data: { name: sub.name, slug: sub.slug } })
    }
    await prisma.category.update({
      where: { id: cat.id },
      data: { parentId: bolsas.id, showInMainMenu: false, showOnHome: sub.home, sortOrder: sub.sortOrder }
    })
  }

  // 2. Acessórios
  let acessorios = await prisma.category.findUnique({ where: { slug: "acessorios" } })
  if (!acessorios) {
    acessorios = await prisma.category.create({
      data: { name: "Acessórios", slug: "acessorios" }
    })
  }
  await prisma.category.update({
    where: { id: acessorios.id },
    data: { parentId: null, showInMainMenu: true, showOnHome: true, sortOrder: 20 }
  })

  // Subcategorias de Acessórios
  const acessoriosSubs = [
    { name: "Carteiras", slug: "carteiras", sortOrder: 21 },
    { name: "Cintos", slug: "cintos", sortOrder: 22 },
    { name: "Necessaires", slug: "necessaires", sortOrder: 23 },
    { name: "Chaveiros", slug: "chaveiros", sortOrder: 24 },
  ]

  for (const sub of acessoriosSubs) {
    let cat = await prisma.category.findUnique({ where: { slug: sub.slug } })
    if (!cat) {
      cat = await prisma.category.create({ data: { name: sub.name, slug: sub.slug } })
    }
    await prisma.category.update({
      where: { id: cat.id },
      data: { parentId: acessorios.id, showInMainMenu: false, showOnHome: false, sortOrder: sub.sortOrder }
    })
  }

  // 3. Promoções
  let promocoes = await prisma.category.findUnique({ where: { slug: "promocoes" } })
  if (!promocoes) {
    promocoes = await prisma.category.create({
      data: { name: "Promoções", slug: "promocoes" }
    })
  }
  await prisma.category.update({
    where: { id: promocoes.id },
    data: { parentId: null, showInMainMenu: true, showOnHome: true, sortOrder: 30 }
  })

  // 4. Novidades
  let novidades = await prisma.category.findUnique({ where: { slug: "novidades" } })
  if (!novidades) {
    novidades = await prisma.category.create({
      data: { name: "Novidades", slug: "novidades" }
    })
  }
  await prisma.category.update({
    where: { id: novidades.id },
    data: { parentId: null, showInMainMenu: false, showOnHome: true, sortOrder: 40 }
  })

  console.log("Patch concluído com sucesso!")
}

patchCategories()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
