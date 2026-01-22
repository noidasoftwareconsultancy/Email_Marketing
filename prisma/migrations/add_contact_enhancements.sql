-- Migration: Add Contact Enhancements
-- Run this SQL in Supabase SQL Editor or your PostgreSQL client

-- ============================================
-- 1. Add new columns to Contact table
-- ============================================

ALTER TABLE "Contact" 
ADD COLUMN IF NOT EXISTS "linkedInUrl" TEXT,
ADD COLUMN IF NOT EXISTS "twitterHandle" TEXT,
ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT,
ADD COLUMN IF NOT EXISTS "birthday" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "gender" TEXT,
ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS "timezone" TEXT,
ADD COLUMN IF NOT EXISTS "score" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "rating" INTEGER,
ADD COLUMN IF NOT EXISTS "lastContactedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "lastEngagedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "phoneVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "doNotEmail" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "doNotCall" BOOLEAN DEFAULT false;

-- ============================================
-- 2. Create ContactActivity table
-- ============================================

CREATE TABLE IF NOT EXISTS "ContactActivity" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactActivity_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- 3. Create ContactDuplicate table
-- ============================================

CREATE TABLE IF NOT EXISTS "ContactDuplicate" (
    "id" TEXT NOT NULL,
    "contactId1" TEXT NOT NULL,
    "contactId2" TEXT NOT NULL,
    "similarityScore" DOUBLE PRECISION NOT NULL,
    "matchedFields" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactDuplicate_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- 4. Create ContactSegment table
-- ============================================

CREATE TABLE IF NOT EXISTS "ContactSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "conditions" JSONB NOT NULL,
    "contactIds" TEXT[],
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSegment_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- 5. Create ContactField table
-- ============================================

CREATE TABLE IF NOT EXISTS "ContactField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT[],
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactField_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- 6. Create indexes for ContactActivity
-- ============================================

CREATE INDEX IF NOT EXISTS "ContactActivity_contactId_idx" ON "ContactActivity"("contactId");
CREATE INDEX IF NOT EXISTS "ContactActivity_type_idx" ON "ContactActivity"("type");
CREATE INDEX IF NOT EXISTS "ContactActivity_createdAt_idx" ON "ContactActivity"("createdAt");

-- ============================================
-- 7. Create indexes for ContactDuplicate
-- ============================================

CREATE INDEX IF NOT EXISTS "ContactDuplicate_status_idx" ON "ContactDuplicate"("status");
CREATE INDEX IF NOT EXISTS "ContactDuplicate_similarityScore_idx" ON "ContactDuplicate"("similarityScore");
CREATE UNIQUE INDEX IF NOT EXISTS "ContactDuplicate_contactId1_contactId2_key" ON "ContactDuplicate"("contactId1", "contactId2");

-- ============================================
-- 8. Create indexes for ContactSegment
-- ============================================

CREATE INDEX IF NOT EXISTS "ContactSegment_userId_idx" ON "ContactSegment"("userId");
CREATE INDEX IF NOT EXISTS "ContactSegment_isActive_idx" ON "ContactSegment"("isActive");

-- ============================================
-- 9. Create indexes for ContactField
-- ============================================

CREATE INDEX IF NOT EXISTS "ContactField_userId_idx" ON "ContactField"("userId");
CREATE INDEX IF NOT EXISTS "ContactField_isActive_idx" ON "ContactField"("isActive");
CREATE UNIQUE INDEX IF NOT EXISTS "ContactField_name_userId_key" ON "ContactField"("name", "userId");

-- ============================================
-- 10. Add foreign key constraints
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ContactActivity_contactId_fkey'
    ) THEN
        ALTER TABLE "ContactActivity" 
        ADD CONSTRAINT "ContactActivity_contactId_fkey" 
        FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Note: ContactDuplicate foreign keys are intentionally not added to avoid circular dependencies
-- The application handles referential integrity for duplicate contacts

-- ============================================
-- 11. Create many-to-many relation table
-- ============================================

CREATE TABLE IF NOT EXISTS "_ContactToContactSegment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "_ContactToContactSegment_AB_unique" ON "_ContactToContactSegment"("A", "B");
CREATE INDEX IF NOT EXISTS "_ContactToContactSegment_B_index" ON "_ContactToContactSegment"("B");

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_ContactToContactSegment_A_fkey'
    ) THEN
        ALTER TABLE "_ContactToContactSegment" 
        ADD CONSTRAINT "_ContactToContactSegment_A_fkey" 
        FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_ContactToContactSegment_B_fkey'
    ) THEN
        ALTER TABLE "_ContactToContactSegment" 
        ADD CONSTRAINT "_ContactToContactSegment_B_fkey" 
        FOREIGN KEY ("B") REFERENCES "ContactSegment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ============================================
-- 12. Verification queries
-- ============================================

-- Check new Contact columns
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'Contact' 
AND column_name IN ('linkedInUrl', 'twitterHandle', 'score', 'rating', 'emailVerified')
ORDER BY column_name;

-- Check new tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ContactActivity', 'ContactDuplicate', 'ContactSegment', 'ContactField')
ORDER BY table_name;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'New columns added to Contact table';
    RAISE NOTICE 'New tables created: ContactActivity, ContactDuplicate, ContactSegment, ContactField';
END $$;
