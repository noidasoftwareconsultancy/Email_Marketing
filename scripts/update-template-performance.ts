/**
 * Script to update template performance metrics
 * Run this after migration to populate performance data for existing templates
 * 
 * IMPORTANT: Run these commands first:
 * 1. npx prisma migrate dev --name add_template_performance_tracking
 * 2. npx prisma generate
 * 3. npx tsx scripts/update-template-performance.ts
 * 
 * This script will have TypeScript errors until you run the migration and generate Prisma client.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTemplatePerformance() {
  console.log('🔄 Starting template performance update...\n');

  try {
    // Get all templates
    const templates = await prisma.template.findMany({
      include: {
        campaigns: {
          select: {
            totalSent: true,
            totalOpened: true,
            totalClicked: true,
            sentAt: true,
          },
        },
      },
    });

    console.log(`📊 Found ${templates.length} templates to update\n`);

    let updatedCount = 0;

    for (const template of templates) {
      // Calculate aggregate statistics
      const totalSent = template.campaigns.reduce((sum, c) => sum + c.totalSent, 0);
      const totalOpened = template.campaigns.reduce((sum, c) => sum + c.totalOpened, 0);
      const totalClicked = template.campaigns.reduce((sum, c) => sum + c.totalClicked, 0);

      const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
      const avgClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

      // Calculate performance score (0-100)
      let performanceScore = 0;
      if (totalSent > 0) {
        // Open rate score (max 50 points) - 30% open rate = 50 points
        performanceScore += Math.min((avgOpenRate / 30) * 50, 50);
        // Click rate score (max 30 points) - 5% click rate = 30 points
        performanceScore += Math.min((avgClickRate / 5) * 30, 30);
        // Usage score (max 20 points) - 10 campaigns = 20 points
        performanceScore += Math.min((template.campaigns.length / 10) * 20, 20);
      }

      // Find last used date
      const lastUsedAt = template.campaigns
        .filter(c => c.sentAt)
        .sort((a, b) => {
          if (!a.sentAt || !b.sentAt) return 0;
          return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
        })[0]?.sentAt || null;

      // Update template
      await prisma.template.update({
        where: { id: template.id },
        data: {
          totalSent,
          totalOpened,
          totalClicked,
          avgOpenRate,
          avgClickRate,
          performanceScore: Math.round(performanceScore),
          lastUsedAt,
        },
      });

      updatedCount++;
      console.log(`✅ Updated: ${template.name}`);
      console.log(`   - Campaigns: ${template.campaigns.length}`);
      console.log(`   - Total Sent: ${totalSent.toLocaleString()}`);
      console.log(`   - Open Rate: ${avgOpenRate.toFixed(1)}%`);
      console.log(`   - Click Rate: ${avgClickRate.toFixed(1)}%`);
      console.log(`   - Performance Score: ${Math.round(performanceScore)}/100`);
      console.log('');
    }

    console.log(`\n✨ Successfully updated ${updatedCount} templates!`);

    // Show summary statistics
    const stats = await prisma.template.aggregate({
      _avg: {
        performanceScore: true,
        avgOpenRate: true,
        avgClickRate: true,
      },
      _max: {
        performanceScore: true,
      },
      _min: {
        performanceScore: true,
      },
    });

    console.log('\n📈 Summary Statistics:');
    console.log(`   - Average Performance Score: ${stats._avg.performanceScore?.toFixed(1) || 0}/100`);
    console.log(`   - Average Open Rate: ${stats._avg.avgOpenRate?.toFixed(1) || 0}%`);
    console.log(`   - Average Click Rate: ${stats._avg.avgClickRate?.toFixed(1) || 0}%`);
    console.log(`   - Best Score: ${stats._max.performanceScore || 0}/100`);
    console.log(`   - Lowest Score: ${stats._min.performanceScore || 0}/100`);

    // Show top performers
    const topTemplates = await prisma.template.findMany({
      where: {
        performanceScore: { gt: 0 },
      },
      orderBy: {
        performanceScore: 'desc',
      },
      take: 5,
      select: {
        name: true,
        performanceScore: true,
        avgOpenRate: true,
        avgClickRate: true,
        _count: {
          select: { campaigns: true },
        },
      },
    });

    if (topTemplates.length > 0) {
      console.log('\n🏆 Top Performing Templates:');
      topTemplates.forEach((template, index) => {
        console.log(`   ${index + 1}. ${template.name}`);
        console.log(`      Score: ${template.performanceScore}/100`);
        console.log(`      Open Rate: ${template.avgOpenRate.toFixed(1)}%`);
        console.log(`      Click Rate: ${template.avgClickRate.toFixed(1)}%`);
        console.log(`      Campaigns: ${template._count.campaigns}`);
      });
    }

  } catch (error) {
    console.error('❌ Error updating template performance:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateTemplatePerformance()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
