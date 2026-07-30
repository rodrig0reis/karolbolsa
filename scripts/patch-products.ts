import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando patch dos produtos de produção...")

  // 1. Garantir que as categorias existem e estão ativas
  const categorias = [
    { name: "Bolsas", slug: "bolsas" },
    { name: "Bolsas de Praia", slug: "bolsas-de-praia" },
    { name: "Bolsas Artesanais", slug: "bolsas-artesanais" },
    { name: "Bolsas Transversais", slug: "bolsas-transversais" },
    { name: "Bolsas de Mão", slug: "bolsas-de-mao" },
    { name: "Mochilas", slug: "mochilas" },
    { name: "Carteiras", slug: "carteiras" },
    { name: "Acessórios", slug: "acessorios" },
    { name: "Promoções", slug: "promocoes" },
    { name: "Novidades", slug: "novidades" },
  ]

  for (const cat of categorias) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { isActive: true },
      create: { ...cat, isActive: true },
    })
  }
  console.log("Categorias verificadas e atualizadas.")

  // 2. Corrigir produtos existentes (estoque, disponibilidade e imagens base)
  await prisma.product.updateMany({
    where: { isActive: true, stock: { lte: 0 } },
    data: { stock: 1, isAvailable: true }
  })
  
  await prisma.product.updateMany({
    where: { isActive: true, isAvailable: false },
    data: { isAvailable: true }
  })

  // 3. Atualizar/Inserir produtos específicos com imagens corretas
  const catTransversal = await prisma.category.findUnique({ where: { slug: "bolsas-transversais" } })
  const catMochila = await prisma.category.findUnique({ where: { slug: "mochilas" } })
  const catCarteira = await prisma.category.findUnique({ where: { slug: "carteiras" } })
  const catMao = await prisma.category.findUnique({ where: { slug: "bolsas-de-mao" } })
  const catAcessorios = await prisma.category.findUnique({ where: { slug: "acessorios" } })
  const catPraia = await prisma.category.findUnique({ where: { slug: "bolsas-de-praia" } })
  const catArtesanal = await prisma.category.findUnique({ where: { slug: "bolsas-artesanais" } })

  if (catTransversal && catMochila && catCarteira && catMao && catAcessorios && catPraia && catArtesanal) {
    const produtosMock = [
      {
        name: "Bolsa Elegance Nude",
        slug: "bolsa-elegance-nude",
        shortDesc: "Bolsa transversal nude com acabamento em couro sintético.",
        price: 299.90,
        promoPrice: 249.90,
        categoryId: catTransversal.id,
        mainImage: "/products/bolsa-elegance-nude.jpg",
        isPromo: true,
        isFeatured: true,
        isAvailable: true,
        stock: 5,
      },
      {
        name: "Mochila Couro Classic",
        slug: "mochila-couro-classic",
        shortDesc: "Mochila de couro marrom espaçosa e moderna.",
        price: 359.90,
        categoryId: catMochila.id,
        mainImage: "/products/mochila-couro-classic.jpg",
        isFeatured: true,
        isAvailable: true,
        stock: 3,
      },
      {
        name: "Carteira Minimalista",
        slug: "carteira-minimalista",
        shortDesc: "Carteira compacta para o dia a dia.",
        price: 89.90,
        categoryId: catCarteira.id,
        mainImage: "/products/carteira-minimalista.jpg",
        isFeatured: true,
        isAvailable: true,
        stock: 10,
      },
      {
        name: "Bolsa de Mão Glamour",
        slug: "bolsa-de-mao-glamour",
        shortDesc: "Bolsa estruturada perfeita para eventos sociais.",
        price: 429.90,
        promoPrice: 399.90,
        categoryId: catMao.id,
        mainImage: "/products/bolsa-de-mao-glamour.jpg",
        isPromo: true,
        isFeatured: true,
        isAvailable: true,
        stock: 2,
      },
      {
        name: "Cinto Feminino Trançado Bege",
        slug: "cinto-feminino-trancado-bege",
        shortDesc: "Cinto feminino trançado em tom bege, perfeito para looks leves e praianos.",
        price: 79.90,
        promoPrice: 69.90,
        categoryId: catAcessorios.id,
        mainImage: "/products/cinto-feminino-trancado-bege.jpg",
        isPromo: true,
        isFeatured: true,
        isAvailable: true,
        stock: 3,
      },
      {
        name: "Cinto Feminino Fivela Dourada Caramelo",
        slug: "cinto-feminino-fivela-dourada-caramelo",
        shortDesc: "Cinto feminino caramelo com fivela dourada, ideal para compor looks casuais e elegantes.",
        price: 89.90,
        categoryId: catAcessorios.id,
        mainImage: "/products/cinto-feminino-fivela-dourada-caramelo.jpg",
        isPromo: false,
        isFeatured: true,
        isAvailable: true,
        stock: 2,
      },
      {
        name: "Bolsa Praia Palha Natural Pirangi",
        slug: "bolsa-praia-palha-natural-pirangi",
        shortDesc: "Bolsa de praia em estilo palha natural, perfeita para passeios em Pirangi do Norte e dias de sol.",
        fullDesc: "Uma bolsa leve, charmosa e espaçosa, ideal para turistas e clientes que buscam praticidade com estilo praiano. Combina com vestidos leves, saída de praia e looks de verão.\n\nMaterial: Palha sintética / acabamento artesanal\nCores: Natural, Bege",
        price: 189.90,
        promoPrice: 169.90,
        categoryId: catPraia.id,
        mainImage: "/products/bolsa-praia-palha-natural-pirangi.jpg",
        isPromo: true,
        isFeatured: true,
        isAvailable: true,
        stock: 4,
      },
      {
        name: "Bolsa Tote Verão Areia",
        slug: "bolsa-tote-verao-areia",
        shortDesc: "Bolsa tote em tom areia, ideal para praia, passeio e uso diário.",
        fullDesc: "Modelo versátil para quem busca uma bolsa espaçosa e elegante para acompanhar a rotina, viagens e momentos de lazer no litoral.\n\nMaterial: Tecido estruturado / alça reforçada\nCores: Areia, Cru",
        price: 159.90,
        categoryId: catPraia.id,
        mainImage: "/products/bolsa-tote-verao-areia.jpg",
        isPromo: false,
        isFeatured: true,
        isAvailable: true,
        stock: 3,
      },
      {
        name: "Bolsa Transversal Maré Dourada",
        slug: "bolsa-transversal-mare-dourada",
        shortDesc: "Bolsa transversal leve com detalhe dourado, perfeita para passeios turísticos.",
        fullDesc: "Compacta e prática, ideal para caminhar pela praia, feirinhas, restaurantes e passeios em Pirangi do Norte com conforto e estilo.\n\nMaterial: Sintético premium\nCores: Bege, Caramelo, Dourado",
        price: 139.90,
        promoPrice: 119.90,
        categoryId: catTransversal.id,
        mainImage: "/products/bolsa-transversal-mare-dourada.jpg",
        isPromo: true,
        isFeatured: true,
        isAvailable: true,
        stock: 5,
      },
      {
        name: "Bolsa Artesanal Brisa do Mar",
        slug: "bolsa-artesanal-brisa-do-mar",
        shortDesc: "Bolsa artesanal com inspiração praiana, charmosa e exclusiva.",
        fullDesc: "Modelo inspirado no clima de Pirangi do Norte, pensado para clientes que gostam de peças com personalidade, acabamento delicado e visual de verão.\n\nMaterial: Fibras naturais/sintéticas com acabamento artesanal\nCores: Natural, Off-white",
        price: 219.90,
        categoryId: catArtesanal.id,
        mainImage: "/products/bolsa-artesanal-brisa-do-mar.jpg",
        isPromo: false,
        isFeatured: true,
        isAvailable: true,
        stock: 2,
      },
    ]

    for (const prod of produtosMock) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          mainImage: prod.mainImage,
          stock: prod.stock,
          isAvailable: prod.isAvailable,
          categoryId: prod.categoryId
        },
        create: prod,
      })
    }
    console.log("Produtos específicos atualizados/inseridos com sucesso.")
  }

  console.log("Patch concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
