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
    { name: "Bolsas Transversais", slug: "bolsas-transversais" },
    { name: "Bolsas de Mão", slug: "bolsas-de-mao" },
    { name: "Mochilas", slug: "mochilas" },
    { name: "Carteiras", slug: "carteiras" },
    { name: "Acessórios", slug: "acessorios" },
  ]

  for (const cat of categorias) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log("Categorias inseridas.")

  // 4. Produtos Iniciais
  const catTransversal = await prisma.category.findUnique({ where: { slug: "bolsas-transversais" } })
  const catMochila = await prisma.category.findUnique({ where: { slug: "mochilas" } })
  const catCarteira = await prisma.category.findUnique({ where: { slug: "carteiras" } })
  const catMao = await prisma.category.findUnique({ where: { slug: "bolsas-de-mao" } })

  if (catTransversal && catMochila && catCarteira && catMao) {
    const produtosMock = [
      {
        name: "Bolsa Elegance Nude",
        slug: "bolsa-elegance-nude",
        shortDesc: "Bolsa transversal nude com acabamento em couro sintético.",
        price: 299.90,
        promoPrice: 249.90,
        categoryId: catTransversal.id,
        mainImage: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
        isPromo: true,
        isFeatured: true,
      },
      {
        name: "Mochila Couro Classic",
        slug: "mochila-couro-classic",
        shortDesc: "Mochila de couro marrom espaçosa e moderna.",
        price: 359.90,
        categoryId: catMochila.id,
        mainImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
        isFeatured: true,
      },
      {
        name: "Carteira Minimalista",
        slug: "carteira-minimalista",
        shortDesc: "Carteira compacta para o dia a dia.",
        price: 89.90,
        categoryId: catCarteira.id,
        mainImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
        isFeatured: true,
      },
      {
        name: "Bolsa de Mão Glamour",
        slug: "bolsa-de-mao-glamour",
        shortDesc: "Bolsa estruturada perfeita para eventos sociais.",
        price: 429.90,
        promoPrice: 399.90,
        categoryId: catMao.id,
        mainImage: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop",
        isPromo: true,
        isFeatured: true,
      },
    ]

    for (const prod of produtosMock) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: prod,
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
