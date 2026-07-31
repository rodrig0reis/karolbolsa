-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "position" TEXT NOT NULL DEFAULT 'home',
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StoreSettings" ADD COLUMN     "aboutText" TEXT,
ADD COLUMN     "allowIndexing" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "facebookLink" TEXT,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "floatWhatsapp" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "footerLogoUrl" TEXT,
ADD COLUMN     "linktreeLink" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "ogImageUrl" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "pinterestLink" TEXT,
ADD COLUMN     "primaryColor" TEXT,
ADD COLUMN     "secondaryColor" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "shortDesc" TEXT,
ADD COLUMN     "slogan" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "tiktokLink" TEXT,
ADD COLUMN     "whatsappGeneralMsg" TEXT DEFAULT 'Olá, vim pelo site da Karol Bolsas e gostaria de atendimento.',
ALTER COLUMN "whatsappMsg" SET DEFAULT 'Olá, vi este produto no site da Karol Bolsas e tenho interesse: {produto} - Valor: {preco}. Pode me passar mais informações?';
