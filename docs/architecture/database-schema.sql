-- NOVA Core Database Schema
-- Version: 1.0.0 (Sprint 1 & 2 Focus)

-- 1. Folders Table (Recursive structure)
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    is_smart_folder BOOLEAN DEFAULT FALSE,
    smart_logic JSONB, -- Filter criteria for smart folders
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Assets Table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Storage path
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    phash TEXT, -- Perceptual Hash for similarity search
    palette JSONB, -- Array of hex color strings
    thumbnail_url TEXT,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_favorite BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- EXIF, device info, etc.
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tags Table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Asset-Tag Mapping (Many-to-Many)
CREATE TABLE asset_tags (
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (asset_id, tag_id)
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own folders" ON folders
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own assets" ON assets
    FOR ALL USING (auth.uid() = user_id);

-- 6. Indexes for Performance
CREATE INDEX idx_assets_folder_id ON assets(folder_id);
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_asset_tags_asset_id ON asset_tags(asset_id);
