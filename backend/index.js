const express = require('express');
const {Client} = require('pg');
const app= express();
const cors = require('cors');
app.use(express.json());
const con = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"Pranav@2004",
    database:"registries"
});   


app.use(cors());
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

con.connect().then(()=>{
    console.log("Connected to the database")
}).catch((err)=>{
    console.log("Error connecting to the database", err)
})

  app.get('/assets', async(req, res) => {
 
    try {
        const result = await con.query(`
            SELECT 
              a.id, a.name, a.type, a.capacity, a.description, a.location, a.available,
              COALESCE(
                json_agg(
                  CASE WHEN am.id IS NOT NULL THEN 
                    json_build_object('id', am.id, 'name', am.name)
                  ELSE NULL END
                ) FILTER (WHERE am.id IS NOT NULL), '[]'
              ) AS amenities
            FROM 
              assets a
            LEFT JOIN 
              asset_amenities aa ON a.id = aa.asset_id
            LEFT JOIN 
              amenities am ON aa.amenity_id = am.id
            GROUP BY 
              a.id
          `);

        
        res.json(result.rows);
    } catch(err) {
        console.error("Error fetching assets:", err);
        res.status(500).json({error: "Error fetching assets"});
    }
});
app.get('/amenities', async(req, res) => {
   
    try {
        const result = await con.query('SELECT * FROM amenities');
        res.json(result.rows);
    } catch(err) {
        console.error("Error fetching amenities:", err);
        res.status(500).json({error: "Error fetching amenities"});
    }
});

app.post('/bookings', async (req, res) => {
  try {
    const { asset_id, name, email, start_time, end_time } = req.body;

    const clash = await con.query(`
      SELECT * FROM bookings 
      WHERE asset_id = $1 
      AND status = 'approved'
      AND (
        (start_time <= $2 AND end_time >= $2) OR 
        (start_time <= $3 AND end_time >= $3) OR
        (start_time >= $2 AND end_time <= $3)
      )
    `, [asset_id, start_time, end_time]);

    if (clash.rows.length > 0) {
      return res.status(409).json({ error: "Asset already booked for this time." });
    }

    let uid;
    const uChk = await con.query('SELECT id FROM users WHERE email = $1', [email]);

    if (uChk.rows.length > 0) {
      uid = uChk.rows[0].id;
    } else {
      const newU = await con.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id',
        [name, email, 'user']
      );
      uid = newU.rows[0].id;
    }

    const booked = await con.query(
      'INSERT INTO bookings (asset_id, user_id, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [asset_id, uid, start_time, end_time, 'pending']
    );

    res.status(201).json({
      message: "Booking request sent. Awaiting approval.",
      booking_id: booked.rows[0].id
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Couldn't create booking" });
  }
});

app.get('/admin/bookings', async (req, res) => {
  try {
    const data = await con.query(`
      SELECT b.*, a.name as asset_name, u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN assets a ON b.asset_id = a.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);
    res.json(data.rows);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Couldn't fetch bookings" });
  }
});

app.put('/admin/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await con.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Couldn't update status" });
  }
});
