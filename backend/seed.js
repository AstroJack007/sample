const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Pranav@2004",
    database: "registries"
});

async function initializeSchema() {
    try {
        await client.connect();
        console.log("Connected to the database");

        await client.query(`
            CREATE TABLE IF NOT EXISTS institutions (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                address TEXT,
                city TEXT,
                state TEXT,
                pincode TEXT
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS assets (
                id SERIAL PRIMARY KEY,
                institution_id INTEGER REFERENCES institutions(id),
                name TEXT NOT NULL,
                type TEXT CHECK (type IN ('classroom', 'lab', 'hostel', 'faculty', 'hall')),
                capacity INTEGER,
                description TEXT,
                location TEXT,
                available BOOLEAN DEFAULT TRUE
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS amenities (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS asset_amenities (
                asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
                amenity_id INTEGER REFERENCES amenities(id) ON DELETE CASCADE,
                PRIMARY KEY (asset_id, amenity_id)
            );
        `);

     
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user'
            );
        `);

        
        await client.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Database schema created successfully");
        
       
        await insertSampleData();
        
        client.end();
    } catch (error) {
        console.error("Error initializing schema:", error);
        client.end();
    }
}

//sample data for testing
async function insertSampleData() {
    try {
        
        await client.query(`
            INSERT INTO institutions (name, address, city, state, pincode)
            VALUES 
            ('IIT Delhi', 'Hauz Khas', 'New Delhi', 'Delhi', '110016'),
            ('NIT Warangal', 'NIT Campus', 'Warangal', 'Telangana', '506004')
            ON CONFLICT DO NOTHING;
        `);

        
        await client.query(`
            INSERT INTO amenities (name)
            VALUES 
            ('Wi-Fi'),
            ('Projector'),
            ('Air Conditioning'),
            ('Computer Lab'),
            ('Whiteboard')
            ON CONFLICT DO NOTHING;
        `);


        await client.query(`
            INSERT INTO users (name, email, role)
            VALUES 
            ('Admin User', 'admin@karmayogi.gov.in', 'admin'),
            ('Regular User', 'iit.delhi@karmayogi.in', 'user'),
            
            ('Regular User',	'nit.trichy@karmayogi.in'	,'user')

            ON CONFLICT DO NOTHING;
        `);
        await client.query(`
          INSERT INTO assets (institution_id, name, type, capacity, description, location, available)
          VALUES 
          (1, 'Lecture Hall A', 'classroom', 100, 'Large lecture hall with stadium seating', 'Main Building, Ground Floor', true),
          (1, 'Computer Lab 101', 'lab', 50, 'Computer lab with high-end workstations', 'Tech Block, First Floor', true),
          (1, 'Faculty Cabin 201', 'faculty', 3, 'Faculty office space', 'Academic Block, Second Floor', true),
          (2, 'Seminar Hall', 'hall', 150, 'Multi-purpose seminar hall', 'Admin Block, Ground Floor', true),
          (2, 'Hostel Block A', 'hostel', 200, 'Student accommodation with single rooms', 'North Campus', true),
          (2, 'Chemistry Lab', 'lab', 40, 'Well-equipped chemistry laboratory', 'Science Block, Ground Floor', true)
          ON CONFLICT DO NOTHING;
      `);
      
     
      await client.query(`
          INSERT INTO asset_amenities (asset_id, amenity_id)
          VALUES 
          (1, 1), (1, 2), (1, 3), (1, 5),  -- Lecture Hall has Wi-Fi, Projector, AC, Whiteboard
          (2, 1), (2, 3), (2, 4),          -- Computer Lab has Wi-Fi, AC, Computer Lab
          (4, 1), (4, 2), (4, 3), (4, 5)   -- Seminar Hall has Wi-Fi, Projector, AC, Whiteboard
          ON CONFLICT DO NOTHING;
      `);
        
        console.log("Sample data inserted successfully");
    } catch (error) {
        console.error("Error inserting sample data:", error);
    }
}

module.exports = {
    initializeSchema
};