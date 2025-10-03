-- Create roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_ts TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
	username VARCHAR(12) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,  -- store hashed password
    role INTEGER REFERENCES user_roles(id) DEFAULT 3,
    created_ts TIMESTAMPTZ DEFAULT NOW(),
    last_updated_ts TIMESTAMPTZ DEFAULT NOW()
);

-- Insert demo roles
INSERT INTO user_roles (name, description) VALUES
('super_admin', 'Administrator with full access'),
('admin', 'Administrator with access to manage app and user'),
('editor', 'Can edit content'),
('viewer', 'Can only view content')
ON CONFLICT DO NOTHING;

-- Insert demo users (replace passwords with hashed ones in real use)
INSERT INTO users (first_name, last_name, username, email_id, password, role)
VALUES
('Anil', 'Dani', 'anild', 'anil@gmail.com', '$2b$12$hashed_admin_password', 1),
('Alice', 'A', 'alicea', 'alice.admin@example.com', '$2b$12$hashed_admin_password', 2),
('Bob', 'E', 'bobe', 'bob.editor@example.com', '$2b$12$hashed_editor_password', 2),
('Charlie', 'V', 'charliev', 'charlie.viewer@example.com', '$2b$12$hashed_viewer_password', 3)
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION set_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    -- Set created_ts on INSERT if column exists and is NULL
    IF TG_OP = 'INSERT' THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name=TG_TABLE_NAME AND column_name='created_ts') THEN
            IF NEW.created_ts IS NULL THEN
                NEW.created_ts := CURRENT_TIMESTAMP;
            END IF;
        END IF;
    END IF;

    -- Set last_updated_ts on UPDATE if column exists
    IF TG_OP = 'UPDATE' THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name=TG_TABLE_NAME AND column_name='last_updated_ts') THEN
            NEW.last_updated_ts := CURRENT_TIMESTAMP;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


select * from users;
select * from user_roles;

