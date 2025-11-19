import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    const [
      totalTemplates,
      templatesWithCampaigns,
      recentTemplates,
      categoryCounts,
    ] = await Promise.all([
      // Total templates
      prisma.template.count({ where: { userId } }),
      
      // Templates used in campaigns
      prisma.template.findMany({
        where: { 
          userId,
          campaigns: { some: {} },
        },
        select: { id: true },
      }),
      
      // Recently created (last 7 days)
      prisma.template.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      
      // Category breakdown
      prisma.template.groupBy({
        by: ['category'],
        where: { userId },
        _count: true,
      }),
    ]);

    // Get most used templates
    const mostUsedTemplates = await prisma.template.findMany({
      where: { userId },
      include: {
        _count: {
          select: { campaigns: true },
        },
      },
      orderBy: {
        campaigns: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return NextResponse.json({
      totalTemplates,
      usedTemplates: templatesWithCampaigns.length,
      unusedTemplates: totalTemplates - templatesWithCampaigns.length,
      recentTemplates,
      categories: categoryCounts.map(c => ({
        category: c.category || 'Uncategorized',
        count: c._count,
      })),
      mostUsedTemplates: mostUsedTemplates.map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        usageCount: t._count.campaigns,
      })),
    });
  } catch (error: any) {
    console.error('Get template stats error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch template stats',
      details: error.message 
    }, { status: 500 });
  }
}
