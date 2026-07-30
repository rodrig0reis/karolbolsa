import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  console.log("Iniciando seed...")

  // 1. Criar usuário admin inicial
  const adminEmail = process.env.ADMIN_EMAIL || "admin@karolbolsas.com.br"
  let adminPassword = process.env.ADMIN_PASSWORD
  
  if (process.env.NODE_ENV === "production") {
    if (!adminPassword || adminPassword.trim() === "") {
      throw new Error("ADMIN_PASSWORD é obrigatório em produção. Configure no .env!")
    }
  } else {
    adminPassword = adminPassword || "senha_segura_123"
  }
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    await prisma.user.create({
      data: {
        name: process.env.ADMIN_NAME || "Karol Admin",
        email: adminEmail,
        passwordHash,
        role: "admin",
      }
    })
    console.log("Admin criado:", adminEmail)
  }

  // 2. Configurações da loja
  const settingsCount = await prisma.storeSettings.count()
  if (settingsCount === 0) {
    await prisma.storeSettings.create({
      data: {
        storeName: "Karol Bolsas",
        whatsappNumber: process.env.WHATSAPP_NUMBER || null,
        whatsappMsg: "Olá, vi este produto no site da Karol Bolsas e tenho interesse: [NOME DO PRODUTO] - Valor: R$ [VALOR]. Pode me passar mais informações?",
        instagramLink: process.env.INSTAGRAM_URL || "https://www.instagram.com/karolbolsas_artesanais/",
        footerText: "Sua loja especializada em bolsas e acessórios femininos com elegância, qualidade e estilo.",
      }
    })
    console.log("Configurações da loja inseridas.")
  }

  // 3. Categorias Base
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
  console.log("Categorias inseridas.")

  // 4. Produtos Iniciais
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
          categoryId: prod.categoryId,
          price: prod.price,
          promoPrice: prod.promoPrice,
          isPromo: prod.isPromo,
          isFeatured: prod.isFeatured,
          isActive: true
        },
        create: { ...prod, isActive: true },
      })
    }
    console.log("Produtos inseridos.")
  }

  console.log("Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
