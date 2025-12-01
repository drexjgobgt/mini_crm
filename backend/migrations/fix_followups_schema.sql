-- Migration script untuk memperbaiki schema followups
-- Jalankan script ini jika ada error 500 di endpoint /api/followups

-- 1. Cek apakah kolom status sudah ada
DO $$
BEGIN
    -- Jika kolom status tidak ada, tambahkan
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'followups' 
        AND column_name = 'status'
    ) THEN
        -- Tambahkan kolom status
        ALTER TABLE followups ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
        
        -- Migrate data dari completed ke status
        UPDATE followups 
        SET status = CASE 
            WHEN completed = true THEN 'completed'
            WHEN completed = false THEN 'pending'
            ELSE 'pending'
        END
        WHERE status IS NULL;
        
        RAISE NOTICE 'Kolom status berhasil ditambahkan dan data dimigrasi';
    ELSE
        RAISE NOTICE 'Kolom status sudah ada';
    END IF;
END $$;

-- 2. Cek apakah kolom followup_date sudah ada
DO $$
BEGIN
    -- Jika kolom followup_date tidak ada tapi due_date ada, rename
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'followups' 
        AND column_name = 'followup_date'
    ) AND EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'followups' 
        AND column_name = 'due_date'
    ) THEN
        ALTER TABLE followups RENAME COLUMN due_date TO followup_date;
        RAISE NOTICE 'Kolom due_date berhasil diubah menjadi followup_date';
    ELSE
        RAISE NOTICE 'Kolom followup_date sudah ada atau due_date tidak ditemukan';
    END IF;
END $$;

-- 3. Cek apakah kolom notes sudah ada
DO $$
BEGIN
    -- Jika kolom notes tidak ada tapi message ada, rename
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'followups' 
        AND column_name = 'notes'
    ) AND EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'followups' 
        AND column_name = 'message'
    ) THEN
        ALTER TABLE followups RENAME COLUMN message TO notes;
        RAISE NOTICE 'Kolom message berhasil diubah menjadi notes';
    ELSE
        RAISE NOTICE 'Kolom notes sudah ada atau message tidak ditemukan';
    END IF;
END $$;

-- 4. Pastikan semua kolom yang diperlukan ada
-- Jika kolom followup_date tidak ada sama sekali, tambahkan
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'followups' 
        AND column_name = 'followup_date'
    ) THEN
        ALTER TABLE followups ADD COLUMN followup_date DATE;
        RAISE NOTICE 'Kolom followup_date berhasil ditambahkan';
    END IF;
END $$;

-- Jika kolom notes tidak ada sama sekali, tambahkan
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'followups' 
        AND column_name = 'notes'
    ) THEN
        ALTER TABLE followups ADD COLUMN notes TEXT;
        RAISE NOTICE 'Kolom notes berhasil ditambahkan';
    END IF;
END $$;

-- 5. Update status yang NULL menjadi 'pending'
UPDATE followups 
SET status = 'pending' 
WHERE status IS NULL OR status = '';

-- 6. Buat index jika belum ada
CREATE INDEX IF NOT EXISTS idx_followups_status ON followups(status);
CREATE INDEX IF NOT EXISTS idx_followups_followup_date ON followups(followup_date);
CREATE INDEX IF NOT EXISTS idx_followups_customer_id ON followups(customer_id);

-- Selesai
SELECT 'Migration selesai!' as result;

