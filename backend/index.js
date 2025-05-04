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