import { prisma } from "@/lib/prisma"
import { StatCard } from "@/components/admin/stat-card"
import { QuickActionCard } from "@/components/admin/quick-action-card"
import { Package, Tags, Store, PlusCircle, Settings, Image as ImageIcon, Star, Percent, AlertCircle, Activity, TrendingUp, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "@/components/admin/status-badge"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminDashboard() {
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    outOfStockProducts,
    featuredProducts,
    promoProducts,
    totalCategories,
    latestProducts
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.count({ where: { isPromo: true } }),
    prisma.category.count(),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    })
  ])

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    visitsToday,
    visits7Days,
    visits30Days,
    topPathsData
  ] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.pageView.groupBy({
      by: ['path'],
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 5
    })
  ])



  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral e atalhos rápidos para gerenciar sua loja.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <QuickActionCard 
            title="Novo Produto" 
            icon={PlusCircle} 
            href="/admin/produtos/novo" 
            variant="primary"
          />
          <QuickActionCard 
            title="Nova Categoria" 
            icon={Tags} 
            href="/admin/categorias/nova" 
          />
          <QuickActionCard 
            title="Banners" 
            icon={ImageIcon} 
            href="/admin/banners" 
          />
          <QuickActionCard 
            title="Configurações" 
            icon={Settings} 
            href="/admin/configuracoes" 
          />
          <QuickActionCard 
            title="Ver Loja" 
            icon={Store} 
            href="/" 
            variant="outline"
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Métricas Principais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Produtos"
            value={totalProducts}
            icon={Package}
            description="Cadastrados no sistema"
          />
          <StatCard
            title="Produtos Ativos"
            value={activeProducts}
            icon={Package}
            description="Visíveis no site"
            trend="up"
          />
          <StatCard
            title="Esgotados"
            value={outOfStockProducts}
            icon={AlertCircle}
            description="Sem estoque"
            trend={outOfStockProducts > 0 ? "down" : "neutral"}
          />
          <StatCard
            title="Categorias"
            value={totalCategories}
            icon={Tags}
            description="Ativas e inativas"
          />
        </div>
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">Destaques e Ofertas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Em Destaque"
            value={featuredProducts}
            icon={Star}
            description="Produtos na vitrine principal"
            className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900"
          />
          <StatCard
            title="Em Promoção"
            value={promoProducts}
            icon={Percent}
            description="Produtos com desconto"
            className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900"
          />
          <StatCard
            title="Inativos"
            value={inactiveProducts}
            icon={Package}
            description="Ocultos do site"
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Acessos da Loja (Real)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Acessos Hoje"
            value={visitsToday}
            icon={Activity}
            description="Desde 00:00"
            className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900"
          />
          <StatCard
            title="Últimos 7 Dias"
            value={visits7Days}
            icon={TrendingUp}
            description="Visitas na semana"
          />
          <StatCard
            title="Últimos 30 Dias"
            value={visits30Days}
            icon={Calendar}
            description="Visitas no mês"
          />
        </div>
        
        {topPathsData.length > 0 && (
          <div className="mt-4 bg-card rounded-xl border overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-base font-semibold">Páginas Mais Acessadas</h3>
            </div>
            <div className="divide-y text-sm">
              {topPathsData.map(p => (
                <div key={p.path} className="flex items-center justify-between p-4 sm:px-6 hover:bg-muted/50">
                  <span className="font-medium text-foreground truncate max-w-[70%]">{p.path}</span>
                  <span className="flex items-center gap-2 text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    <Eye className="w-4 h-4" />
                    {p._count.path}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bg-card rounded-xl border overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Últimos Produtos Cadastrados</h2>
          <Link href="/admin/produtos" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="divide-y">
          {latestProducts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </div>
          ) : (
            latestProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img 
                      src={product.mainImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-medium">
                      R$ {Number(product.promoPrice || product.price).toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-muted-foreground">Estoque: {product.stock}</p>
                  </div>
                  <div className="hidden sm:block">
                    <StatusBadge 
                      status={!product.isActive ? "inactive" : product.stock === 0 ? "out-of-stock" : "active"} 
                    />
                  </div>
                  <Link href={`/admin/produtos/${product.id}/editar`} className="text-sm font-medium text-primary hover:underline px-2 py-1 bg-primary/10 rounded-md">
                    Editar
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
